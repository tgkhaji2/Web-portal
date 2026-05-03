# MIT Jabalnur Backend

Backend Express ini menggunakan MySQL lokal dan menyediakan API untuk admin panel serta berita.

## Setup

1. Copy file contoh environment:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Sesuaikan konfigurasi MySQL jika perlu. Default menggunakan:
   - host: `127.0.0.1`
   - port: `3306`
   - user: `root`
   - password: ``
   - database: `mitdb`

3. Install dependency backend:
   ```bash
   cd backend
   npm install
   ```

4. Jalankan backend:
   ```bash
   npm run dev
   ```

## Endpoint penting

- `POST /api/auth/login` — login admin
- `GET /api/categories` — daftar kategori
- `POST /api/categories` — buat kategori (butuh token)
- `GET /api/news` — daftar berita
- `POST /api/news` — buat berita (butuh token)
- `GET /api/news/:id` — detail berita

## Default admin

Login default:
- username: `admin`
- password: `admin123`

Pastikan backend berjalan di `http://localhost:4000` agar frontend dapat terhubung.
