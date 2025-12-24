# fe-service

Aplikasi frontend berbasis Angular.

## Tech Stack

- Angular 21 (CLI/Build)
- TypeScript 5.9
- Tailwind CSS 4 via `@tailwindcss/postcss` + `autoprefixer`
- RxJS 7.8
- Vitest + jsdom (unit test)
- Package manager: npm 10

## Prasyarat

- Node.js 18.19+, 20, atau 22 (disarankan LTS)
- npm 10+

## Instalasi

```bash
npm install
```

## Menjalankan Aplikasi (Development)

```bash
npm start
```

Akses di `http://localhost:4200/`. HMR/reload aktif saat file diubah.

## Build Production

```bash
npm run build
```

Hasil build berada di folder `dist/fe-service`.

## Unit Test

```bash
npm test
```

Menggunakan Vitest + jsdom melalui integrasi Angular Build.

## Tailwind CSS

- Sudah terpasang Tailwind v4 dan diimpor di `src/styles.css` melalui `@import "tailwindcss";`.
- PostCSS dikonfigurasi di `postcss.config.js` menggunakan plugin `@tailwindcss/postcss` dan `autoprefixer`.
- Gunakan utility class langsung di template, contoh:
  ```html
  <h1 class="text-2xl font-bold text-slate-800">Halo</h1>
  ```
- Kustomisasi (opsional): jika perlu tema/extend, buat `tailwind.config.ts/js` dan tetap gunakan konfigurasi PostCSS saat ini.

## Scaffolding Komponen

```bash
npm run ng generate component nama-komponen
# atau
ng generate component nama-komponen
```

Referensi perintah lengkap: `ng generate --help`.

## Referensi

- Angular CLI docs: https://angular.dev/tools/cli
- Tailwind CSS v4: https://tailwindcss.com
