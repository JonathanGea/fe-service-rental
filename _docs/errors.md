# Error Log dan Rekomendasi

## ng serve gagal bind ke 127.0.0.1:4200

**Waktu**: saat eksekusi lokal

**Perintah**:

```bash
npx ng serve
```

**Output**:

```
An unhandled exception occurred: listen EPERM: operation not permitted 127.0.0.1:4200
See "/tmp/ng-yzDDoV/angular-errors.log" for further details.
```

**Log detail** (`/tmp/ng-yzDDoV/angular-errors.log`):

```
[error] Error: listen EPERM: operation not permitted 127.0.0.1:4200
    at Server.setupListenHandle [as _listen2] (node:net:1886:21)
    at listenInCluster (node:net:1965:12)
    at GetAddrInfoReqWrap.doListen [as callback] (node:net:2139:7)
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:113:8)
```

**Analisa singkat**:
- Proses dev server gagal membuka socket pada `127.0.0.1:4200` karena izin (EPERM).
- Ini biasanya terjadi karena kebijakan sandbox, port diblokir oleh OS/antivirus, atau port 4200 dipesan oleh sistem.

**Rekomendasi perbaikan**:
1. Ganti port dan host agar bind ke alamat yang diizinkan, misalnya `0.0.0.0:4300`.
2. Jika masih gagal, cek:
   - Port lain yang bebas (`lsof -i :PORT` / `netstat -ano | findstr PORT`).
   - Kebijakan firewall/antivirus yang memblokir bind pada port tertentu.
   - Jalankan terminal dengan izin yang memadai atau ubah kebijakan sandbox.

**Perbaikan yang diterapkan di repo ini**:
- Default `ng serve` diubah agar menggunakan `--host 0.0.0.0 --port 4300`.
- Konfigurasi `serve.options` di `angular.json` disetel ke host/port yang sama.

## Tailwind PostCSS plugin tidak kompatibel

**Waktu**: saat eksekusi lokal

**Perintah**:

```bash
ng serve
```

**Output**:

```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
    at Object.lt [as default] (.../node_modules/tailwindcss/dist/lib.js:38:1643)
    at StylesheetPluginFactory.initPostcss (.../node_modules/@angular/build/src/tools/esbuild/stylesheets/stylesheet-plugin-factory.js:173:66)
```

**Analisa singkat**:
- Angular Build hanya membaca `postcss.config.json` atau `.postcssrc.json`, bukan `postcss.config.js`.
- Karena tidak ada konfigurasi PostCSS berbasis JSON, Angular mendeteksi `tailwind.config.*` lalu memakai `tailwindcss` langsung sebagai plugin PostCSS, yang tidak didukung di Tailwind v4.

**Rekomendasi perbaikan**:
1. Tambahkan `postcss.config.json` dengan plugin `@tailwindcss/postcss` dan `autoprefixer`.
2. Pastikan file JSON tersebut berada di root project agar terbaca oleh Angular Build.

**Perbaikan yang diterapkan di repo ini**:
- Menambahkan `postcss.config.json` berisi konfigurasi plugin PostCSS yang kompatibel dengan Tailwind v4.

## Public home data tidak muncul sampai user klik

**Waktu**: saat akses halaman publik (home)

**Gejala**:
- Daftar kendaraan kosong saat halaman pertama kali dirender.
- Data baru terlihat setelah ada interaksi (klik filter).

**Analisa singkat**:
- `HomePageComponent` belum dideklarasikan sebagai standalone, tetapi memakai `imports` untuk `NgIf`, `NgFor`, dan `DecimalPipe`.
- Pada app yang seluruhnya standalone, ini membuat directive/pipes tidak terdaftar untuk render awal, sehingga tampilan tidak diperbarui secara benar.

**Rekomendasi perbaikan**:
1. Set `standalone: true` pada `HomePageComponent`.
2. Pindahkan `loadVehicles()` ke `ngOnInit()` agar lifecycle render konsisten.

**Perbaikan yang diterapkan di repo ini**:
- Menambahkan `standalone: true` dan memindahkan fetch data ke `ngOnInit()` di `src/app/public/home/home.ts`.

## Data hanya muncul setelah klik di semua halaman

**Waktu**: setelah integrasi data API di berbagai halaman (public + admin)

**Gejala**:
- Data list/summary kosong saat load awal.
- Data baru tampil setelah user melakukan klik/scroll (trigger change detection manual via event).

**Analisa singkat**:
- Aplikasi berjalan tanpa `zone.js`, sehingga perubahan dari async (HTTP/RxJS) tidak otomatis memicu change detection.
- UI hanya re-render ketika ada event DOM dari user (klik/scroll).

**Rekomendasi perbaikan**:
1. Tambahkan `zone.js` sebagai dependency runtime.
2. Import `zone.js` di entrypoint (`src/main.ts`) agar change detection berjalan normal.
3. Pastikan change detection zone-based diaktifkan eksplisit via `provideZoneChangeDetection()`.

**Perbaikan yang diterapkan di repo ini**:
- Menambahkan `zone.js` di `package.json`.
- Menambahkan `import 'zone.js';` di `src/main.ts`.
- Menjalankan `npm install` untuk mengunduh `zone.js` ke `node_modules`.
- Menambahkan `provideZoneChangeDetection()` pada `src/app/app.config.ts`.

## Build gagal karena modul zone.js tidak ditemukan

**Waktu**: setelah menambahkan `import 'zone.js';` di entrypoint

**Gejala**:
- Build/serve gagal dengan error `Failed to resolve import "zone.js"`.

**Analisa singkat**:
- Dependency `zone.js` belum terpasang di `node_modules`.

**Rekomendasi perbaikan**:
1. Jalankan `npm install` (atau `npm install zone.js`) untuk mengunduh dependency.
2. Restart dev server agar Vite/Angular melakukan rebuild ulang.

**Perbaikan yang diterapkan di repo ini**:
- Dependency `zone.js` sudah ditambahkan ke `package.json`.
 - `node_modules/zone.js` kini tersedia setelah `npm install`.
