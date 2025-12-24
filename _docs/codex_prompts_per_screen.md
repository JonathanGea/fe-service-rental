# Codex Prompts per UI Screen (1-14)

## Prompt Umum (berlaku untuk semua screen)
Gunakan instruksi ini di setiap screen:
- Ikuti wireflow di `/_docs/sitemap_wireflow.md`.
- Mapping API sesuai `/_docs/api_docs.md`.
- Styling menggunakan token `/_docs/design-system.md`.
- Struktur feature-driven dan state handling lengkap (loading/empty/error).
- Jangan ubah backend; fokus implementasi FE.

---

## 1) Landing Page (Public)
```
Implementasikan Screen 1: Landing Page (Public).
Rujuk detail komponen dan state di `/_docs/sitemap_wireflow.md` bagian Landing Page.
API: GET `/api/public/vehicles` (query: startDate, endDate, q, categoryId).
Pastikan ada search bar, filter kategori, date range picker opsional, grid card kendaraan, status badge, nextAvailableDate, dan CTA detail.
Terapkan styling tokens dari `/_docs/design-system.md`.
```

## 2) Detail Kendaraan (Public)
```
Implementasikan Screen 2: Detail Kendaraan (Public).
Rujuk wireflow detail kendaraan di `/_docs/sitemap_wireflow.md`.
API: GET `/api/public/vehicles/{id}` (query: startDate, endDate).
Pastikan ada galeri foto, spesifikasi, status, available dates, date range picker opsional, dan CTA WhatsApp.
Gunakan state loading/error dan generate WhatsApp link.
```

## 3) Login (Admin)
```
Implementasikan Screen 3: Login (Admin).
Rujuk wireflow Login di `/_docs/sitemap_wireflow.md`.
API: POST `/api/auth/login`.
Pastikan ada form email/password, handling submitting, dan error invalid credentials.
```

## 4) Dashboard (Admin)
```
Implementasikan Screen 4: Dashboard (Admin).
Rujuk wireflow Dashboard di `/_docs/sitemap_wireflow.md`.
API: GET `/api/vehicles?status=` untuk agregasi di FE.
Tampilkan summary cards dan quick links ke Kendaraan/Rental.
```

## 5) List Kendaraan (Admin)
```
Implementasikan Screen 5: List Kendaraan (Admin).
Rujuk wireflow List Kendaraan di `/_docs/sitemap_wireflow.md`.
API: GET `/api/vehicles` (filter status/q/categoryId), DELETE `/api/vehicles/{id}`.
Pastikan ada table list, search/filter, button tambah, dan konfirmasi delete.
```

## 6) Create/Edit Kendaraan (Admin)
```
Implementasikan Screen 6: Create/Edit Kendaraan (Admin).
Rujuk wireflow Create/Edit di `/_docs/sitemap_wireflow.md`.
API: POST `/api/vehicles`, PUT `/api/vehicles/{id}`.
Pastikan form lengkap sesuai VehicleRequest dan validasi UI.
```

## 7) Detail Kendaraan (Admin)
```
Implementasikan Screen 7: Detail Kendaraan (Admin).
Rujuk wireflow Detail Kendaraan Admin di `/_docs/sitemap_wireflow.md`.
API: GET `/api/vehicles/{id}`, PATCH `/api/vehicles/{id}/status`.
Pastikan detail info, status badge, action update status, dan link ke foto kendaraan.
```

## 8) Foto Kendaraan (Admin)
```
Implementasikan Screen 8: Foto Kendaraan (Admin).
Rujuk wireflow Foto Kendaraan di `/_docs/sitemap_wireflow.md`.
API: GET `/api/vehicles/{id}/photos`, POST `/api/vehicles/{id}/photos`, PATCH `/api/vehicles/{id}/photos/{photoId}`, DELETE `/api/vehicles/{id}/photos/{photoId}`.
Pastikan grid foto, upload, edit caption/order, dan delete.
```

## 9) List Rental (Admin)
```
Implementasikan Screen 9: List Rental (Admin).
Rujuk wireflow List Rental di `/_docs/sitemap_wireflow.md`.
API: GET `/api/rentals` (filter vehicleId/status/startDate/endDate).
Pastikan table list dan filter.
```

## 10) Create Rental (Admin)
```
Implementasikan Screen 10: Create Rental (Admin).
Rujuk wireflow Create Rental di `/_docs/sitemap_wireflow.md`.
API: POST `/api/rentals`.
Pastikan form data peminjam, periode sewa, harga, serta validasi konflik tanggal.
```

## 11) Detail Rental (Admin)
```
Implementasikan Screen 11: Detail Rental (Admin).
Rujuk wireflow Detail Rental di `/_docs/sitemap_wireflow.md`.
API: GET `/api/rentals/{id}`, PATCH `/api/rentals/{id}`.
Pastikan detail peminjam, detail kendaraan, dan update form.
```

## 12) Return Rental (Admin)
```
Implementasikan Screen 12: Return Rental (Admin).
Rujuk wireflow Return Rental di `/_docs/sitemap_wireflow.md`.
API: POST `/api/rentals/{id}/return`.
Pastikan form returnDate + conditionNotes dan handling success.
```

## 13) Riwayat Rental (Admin)
```
Implementasikan Screen 13: Riwayat Rental (Admin).
Rujuk wireflow Riwayat Rental di `/_docs/sitemap_wireflow.md`.
API: GET `/api/rentals/history` (filter vehicleId/startDate/endDate).
Pastikan table history dan filter.
```

## 14) Kalender Ketersediaan (Admin)
```
Implementasikan Screen 14: Kalender Ketersediaan (Admin).
Rujuk wireflow Kalender Ketersediaan di `/_docs/sitemap_wireflow.md`.
API: GET `/api/availability/calendar` (vehicleId/startDate/endDate).
Pastikan vehicle selector, date range picker, dan calendar grid dengan status per tanggal.
```
