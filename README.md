# DisasterAid - Sistem Informasi Pelaporan Bencana

**Versi Prototype / Functional Testing**

Proyek ini adalah sistem berbasis web untuk pelaporan, verifikasi, dan pemantauan bencana alam secara real-time. Dibangun menggunakan teknologi modern **Laravel** (Backend) dan **React/Inertia.js** (Frontend).

> **Catatan untuk Klien:**
> Versi ini difokuskan pada **Fungsionalitas Sistem (Core Features)**. Desain antarmuka (UI) saat ini menggunakan template standar dan siap disesuaikan (*re-skin*) sepenuhnya sesuai dengan desain visual (Mockup) yang diinginkan nanti.

---

## 📋 Fitur Utama

Berikut adalah fitur-fitur yang siap untuk diuji coba:

1.  **Pelaporan Bencana (User)**
    * Formulir pelaporan dengan upload bukti foto/video.
    * Deteksi lokasi otomatis (Latitude/Longitude).
2.  **Verifikasi Laporan (Admin)**
    * Dashboard statistik & grafik tren laporan mingguan.
    * Sistem Approval: Verifikasi, Tolak (wajib alasan), dan Selesai.
    * Notifikasi *popup* interaktif (Custom Alert).
3.  **Peta Sebaran Publik (Public Map)**
    * Visualisasi titik bencana yang **sudah diverifikasi** menggunakan Leaflet Maps.
    * Filter data berdasarkan jenis bencana.
    * Ikon marker visual (Banjir, Kebakaran, Gempa, dll).
    * Integrasi tombol navigasi langsung ke **Google Maps**.
4.  **Manajemen Data & Admin**
    * **Export Excel:** Unduh laporan Harian & Bulanan.
    * **Manajemen User:** Tambah, Edit, Hapus User, dan Pengaturan Role Admin.
    * **Pengaturan Akun:** Ganti profil dan password.

---

## 🛠️ Persyaratan Sistem (Prerequisites)

Pastikan komputer server/local sudah terinstal:

1.  **PHP** (Versi 8.1 atau lebih baru).
2.  **Composer** (Untuk install library PHP).
3.  **Node.js & NPM** (Untuk compile aset Frontend).
4.  **MySQL** (Database).

---

## 🚀 Panduan Instalasi (Langkah demi Langkah)

Ikuti langkah ini secara berurutan di terminal (Command Prompt / Terminal):

### 1. Clone & Install Dependencies
Masuk ke folder proyek, lalu jalankan perintah berikut untuk mengunduh semua library yang dibutuhkan:

```bash
# Install library Backend (Laravel)
composer install

# Install library Frontend (React/Inertia)
npm install

### 2. Konfigurasi Environment (PENTING)
Langkah ini wajib dilakukan agar aplikasi bisa terhubung ke database.

**a. Duplikat File Konfigurasi**
Jalankan perintah ini di terminal:
```bash
cp .env.example .env

```

*(Catatan: Jika menggunakan Command Prompt Windows biasa, gunakan perintah: `copy .env.example .env`)*

**b. Edit File .env**
Buka file bernama **`.env`** yang baru saja dibuat menggunakan text editor (Notepad, VS Code, dll). Cari bagian Database dan ubah sesuai settingan komputer Anda:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=disaster_aid_db  # <-- Ganti dengan nama database yang Anda buat di phpMyAdmin
DB_USERNAME=root             # <-- User database (default XAMPP/Laragon: root)
DB_PASSWORD=                 # <-- Password database (default kosong)

```

### 3. Setup Database & Data Awal

Jalankan perintah berikut untuk membuat struktur tabel dan mengisi data akun admin standar:

```bash
# Generate App Key (Kunci Enkripsi Aplikasi)
php artisan key:generate

# Membuat tabel database (Pastikan database 'disaster_aid_db' sudah dibuat manual di phpMyAdmin)
php artisan migrate

# Mengisi data dummy (Akun Admin, Jenis Bencana, Wilayah)
php artisan db:seed

```

### 4. Setup Penyimpanan File

Agar foto bukti laporan bisa muncul di browser, jalankan:

```bash
php artisan storage:link

```

---

## ▶️ Cara Menjalankan Aplikasi

Aplikasi ini membutuhkan **2 Terminal** yang berjalan bersamaan agar berfungsi normal:

**Terminal 1 (Menjalankan Server Backend):**

```bash
php artisan serve

```

**Terminal 2 (Menjalankan Frontend Vite):**

```bash
npm run dev

```

Setelah keduanya jalan, buka browser dan akses:
👉 **http://127.0.0.1:8000**

---

## 🔑 Akun Login (Testing)

Gunakan akun berikut untuk menguji fitur berdasarkan hak akses:

| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@example.com` | `password` |
| **User** | `user@example.com` | `password` |

*(Anda juga bisa mencoba mendaftar akun baru lewat menu Register di halaman depan)*

---

## 🧪 Skenario Pengujian (Checklist)

Untuk memastikan alur sistem berjalan lancar, silakan coba skenario berikut:

1. **Lapor:** Login sebagai **User**, buat laporan baru (isi foto & lokasi).
2. **Cek Peta (Awal):** Buka menu "Pantau Peta". Laporan tadi **belum muncul** (karena status masih Pending).
3. **Verifikasi:** Login sebagai **Admin**, buka Dashboard -> Laporan Masuk. Klik "Verifikasi" pada laporan tadi.
4. **Cek Peta (Akhir):** Kembali ke menu "Pantau Peta". Titik lokasi **sudah muncul**. Klik marker untuk melihat detail & coba tombol "Buka Rute Google Maps".
5. **Export:** Di panel Admin, masuk menu "Rekap & Export". Coba download Excel harian.
6. **Kelola User:** Di panel Admin, coba tambahkan user baru atau edit user yang ada.

---

## ⚠️ Troubleshooting

* **Gambar tidak muncul?** Pastikan sudah menjalankan `php artisan storage:link`.
* **Tampilan berantakan?** Pastikan `npm run dev` sedang berjalan.
* **Error Database?** Pastikan database sudah dibuat di phpMyAdmin dan nama database di file `.env` sudah sesuai.

```

```



