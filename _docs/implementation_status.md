# Status Implementasi FE Service Rental

Sumber acuan: `_docs/backlog_roadmap.md`, `_docs/sitemap_wireflow.md`, `_docs/requirements_use_case.md`, `_docs/api_docs.md`.
Basis pengecekan: seluruh kode di `src/` (routes, layout, shared services, dan komponen UI).

## Done
- MVP 0: Tailwind v4 tokens + theme (`src/styles.css`), struktur feature-driven (`src/app/public`, `src/app/admin`, `src/app/shared`), API client `ApiResponse` di shared services.
- Public Landing Page: list kendaraan dari GET `/api/public/vehicles`, status badge, `nextAvailableDate`, CTA WhatsApp, state loading/empty/error (`src/app/public/home`).
- Admin Login: form login + error handling (`src/app/admin/login`).
- Admin Dashboard: summary status kendaraan dari GET `/api/vehicles` (`src/app/admin/dashboard`).
- Admin Kendaraan: list + filter, create/edit, detail, delete, update status, kelola foto (routes + komponen `src/app/admin/vehicles/*`).
- Admin Brand & Tipe Kendaraan: list + create/edit (`src/app/admin/brands/*`, `src/app/admin/vehicle-types/*`).
- Auth guard dan layout admin/public lengkap (navbar, sidebar, header/footer).

## Partial
- Landing Page filter & search: UI tanggal/lokasi ada, tapi belum terhubung ke query API (`q`, `categoryId`, `startDate`, `endDate`) dan belum ada category filter.
- CTA detail kendaraan: belum ada tombol/link ke halaman detail publik (hanya CTA WhatsApp).
- Global error handling: error/empty state sudah per-screen, tetapi belum ada handler global yang konsisten lintas halaman.

## Belum
- Public Detail Kendaraan (Screen 2) + galeri/availability per tanggal.
- Rental Management Admin: list rental, create rental, detail rental, return rental.
- Riwayat Rental (history) dan Kalender Ketersediaan.
- Validasi konflik tanggal rental di UI (sesuai use case).
- Export histori (opsional) dan kategori kendaraan (opsional) belum terlihat di UI.
