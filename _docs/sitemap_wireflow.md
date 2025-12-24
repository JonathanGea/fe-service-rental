# Sitemap & Wireflow Detail - Rental App FE

## Sitemap (struktur halaman)
- Public
  - Landing Page
  - Detail Kendaraan
- Admin
  - Login
  - Dashboard
  - Kendaraan
    - List Kendaraan
    - Create/Edit Kendaraan
    - Detail Kendaraan (Admin)
    - Foto Kendaraan
  - Rental
    - List Rental
    - Create Rental
    - Detail Rental
    - Return Rental
  - Riwayat Rental
  - Kalender Ketersediaan

---

## Wireflow Detail (per screen, komponen, state, API mapping)

### 1) Landing Page (Public)
**Tujuan:** Menampilkan daftar kendaraan dan opsi filter + tanggal.

**Komponen utama:**
- Header / Brand
- Search bar (input `q`)
- Filter kategori (dropdown `categoryId`, opsional)
- Date range picker (startDate, endDate opsional)
- Grid card kendaraan
- Status badge (available / rented / maintenance / unavailable)
- Info `nextAvailableDate`
- CTA "Lihat Detail"

**State:**
- Loading list
- Empty list
- Error list
- Filter aktif
- Date range valid/invalid

**API mapping:**
- GET `/api/public/vehicles?startDate=&endDate=&q=&categoryId=`

---

### 2) Detail Kendaraan (Public)
**Tujuan:** Menampilkan detail spesifikasi + galeri + CTA WA.

**Komponen utama:**
- Header (nama, brand, tipe)
- Galeri foto (carousel/grid)
- Spesifikasi (tahun, transmisi, kapasitas, harga per hari)
- Status + available dates
- Date range picker (opsional, untuk cek availability)
- CTA "Pesan via WhatsApp" (link dinamis)

**State:**
- Loading detail
- Error detail
- Selected date range
- WhatsApp link generated

**API mapping:**
- GET `/api/public/vehicles/{id}?startDate=&endDate=`

---

### 3) Login (Admin)
**Tujuan:** Akses admin/staff.

**Komponen utama:**
- Form email + password
- Button login
- Error message

**State:**
- Submitting
- Invalid credentials

**API mapping:**
- POST `/api/auth/login`

---

### 4) Dashboard (Admin)
**Tujuan:** Ringkasan status kendaraan + shortcut.

**Komponen utama:**
- Card total kendaraan
- Card rented/available/maintenance
- Quick links ke Kendaraan/Rental

**State:**
- Loading summary
- Error summary

**API mapping:**
- GET `/api/vehicles?status=` (gunakan agregasi di FE jika belum ada endpoint ringkas)

---

### 5) List Kendaraan (Admin)
**Tujuan:** CRUD kendaraan + filter.

**Komponen utama:**
- Table list kendaraan
- Search/filter status
- Button tambah kendaraan
- Row action: edit, delete

**State:**
- Loading list
- Empty list
- Delete confirm

**API mapping:**
- GET `/api/vehicles?status=&q=&categoryId=`
- DELETE `/api/vehicles/{id}`

---

### 6) Create/Edit Kendaraan (Admin)
**Tujuan:** Form data kendaraan.

**Komponen utama:**
- Form field: name, brand, type, year, transmission, capacity, pricePerDay, description, status, categoryId
- Button save
- Validation message

**State:**
- Submitting
- Validation error
- Success toast

**API mapping:**
- POST `/api/vehicles`
- PUT `/api/vehicles/{id}`

---

### 7) Detail Kendaraan (Admin)
**Tujuan:** Lihat detail dan update status.

**Komponen utama:**
- Detail info kendaraan
- Status badge + action update status
- Link ke Foto Kendaraan

**State:**
- Loading detail
- Error detail
- Status update pending

**API mapping:**
- GET `/api/vehicles/{id}`
- PATCH `/api/vehicles/{id}/status`

---

### 8) Foto Kendaraan (Admin)
**Tujuan:** Upload, urutkan, hapus foto.

**Komponen utama:**
- Grid foto
- Upload button (multipart)
- Edit caption/order
- Delete foto

**State:**
- Uploading
- Reorder pending
- Delete confirm

**API mapping:**
- GET `/api/vehicles/{id}/photos`
- POST `/api/vehicles/{id}/photos` (multipart)
- PATCH `/api/vehicles/{id}/photos/{photoId}`
- DELETE `/api/vehicles/{id}/photos/{photoId}`

---

### 9) List Rental (Admin)
**Tujuan:** Monitor rental aktif.

**Komponen utama:**
- Table list rental
- Filter: status, vehicleId, startDate, endDate
- Action: view detail

**State:**
- Loading list
- Empty list

**API mapping:**
- GET `/api/rentals?vehicleId=&status=&startDate=&endDate=`

---

### 10) Create Rental (Admin)
**Tujuan:** Input transaksi rental.

**Komponen utama:**
- Form data peminjam + periode sewa + harga
- Button save
- Validation message

**State:**
- Submitting
- Conflict tanggal

**API mapping:**
- POST `/api/rentals`

---

### 11) Detail Rental (Admin)
**Tujuan:** Lihat detail dan update data rental.

**Komponen utama:**
- Detail peminjam + kendaraan
- Form update (optional)
- Button update

**State:**
- Loading detail
- Update pending

**API mapping:**
- GET `/api/rentals/{id}`
- PATCH `/api/rentals/{id}`

---

### 12) Return Rental (Admin)
**Tujuan:** Proses pengembalian kendaraan.

**Komponen utama:**
- Form returnDate + conditionNotes
- Button submit

**State:**
- Submitting
- Success state

**API mapping:**
- POST `/api/rentals/{id}/return`

---

### 13) Riwayat Rental (Admin)
**Tujuan:** Audit histori rental.

**Komponen utama:**
- Filter vehicleId + date range
- Table history
- Export button (opsional)

**State:**
- Loading list
- Empty list

**API mapping:**
- GET `/api/rentals/history?vehicleId=&startDate=&endDate=`

---

### 14) Kalender Ketersediaan (Admin)
**Tujuan:** Lihat availability per tanggal.

**Komponen utama:**
- Vehicle selector
- Date range picker
- Calendar grid dengan status per tanggal

**State:**
- Loading calendar
- Empty calendar

**API mapping:**
- GET `/api/availability/calendar?vehicleId=&startDate=&endDate=`
