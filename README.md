#  DisasterAid - Sistem Informasi Pelaporan Bencana

**Versi Prototype / Functional Testing**

Proyek ini adalah sistem berbasis web untuk pelaporan, verifikasi, dan pemantauan bencana alam secara real-time. Dibangun menggunakan teknologi modern **Laravel** (Backend) dan **React/Inertia.js** (Frontend).

> **Catatan:**
> Versi ini difokuskan pada **Fungsionalitas Sistem (Core Features)**. Desain antarmuka (UI) saat ini menggunakan template standar dan siap disesuaikan (*re-skin*) sepenuhnya sesuai dengan desain visual yang diinginkan nanti.

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