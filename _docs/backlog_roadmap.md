# Backlog & Roadmap - Rental App FE

## MVP 0 - Setup & Fondasi
- Konfigurasi Tailwind v4 + tokens theme (`bg-app`, `bg-surface`, `text-primary`, `text-strong`, `border-default`).
- Struktur folder feature-driven + routing dasar.
- API client dengan standar response `ApiResponse`.
- Global error handling + empty state dasar.

## MVP 1 - Public Landing Page
- List kendaraan (GET `/api/public/vehicles`).
- Filter dasar: query `q`, `categoryId` (opsional).
- Status badge + `nextAvailableDate` pada card.
- Detail kendaraan (GET `/api/public/vehicles/{id}`) + galeri.
- Form tanggal (start/end) opsional + refresh availability.
- CTA "Pesan via WhatsApp" dengan template link.

## MVP 2 - Admin Kendaraan
- CRUD kendaraan (GET/POST/PUT/DELETE `/api/vehicles`).
- Update status kendaraan (PATCH `/api/vehicles/{id}/status`).
- Manajemen foto kendaraan: list/upload/update/delete.

## MVP 3 - Rental Management (Admin/Staff)
- Buat rental (POST `/api/rentals`).
- Update rental (PATCH `/api/rentals/{id}`).
- Pengembalian (POST `/api/rentals/{id}/return`).
- Validasi konflik tanggal dan status.

## MVP 4 - Monitoring & Riwayat
- Riwayat rental (GET `/api/rentals/history`).
- Kalender ketersediaan (GET `/api/availability/calendar`).

## Enhancement
- Kategori kendaraan (opsional).
- Export histori (opsional).
- Refinement empty/error states + UX copy.
