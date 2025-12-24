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
