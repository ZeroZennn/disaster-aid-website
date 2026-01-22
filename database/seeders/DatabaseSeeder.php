<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DisasterType;
use App\Models\AssistanceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin / User Utama
        User::create([
            'name' => 'Admin BPBD',
            'email' => 'admin@bpbd.com', // Email untuk Login
            'password' => Hash::make('AdminBPDB@123'), // Password Login
            'role' => 'admin', // Pastikan kolom role ada di tabel users, atau abaikan jika belum pakai role
        ]);

        // 2. Akun USER / PELAPOR (Untuk masuk Dashboard User)
        User::create([
            'name' => 'Pengurus Desa Beji',
            'email' => 'beji@bpbd.com',
            'password' => Hash::make('BPDBBeji@123'),
            'role' => 'user',      // <--- Role User
            'phone_number' => '089876543210',
        ]);

        // 2. Isi Master Data Jenis Bencana
        $disasters = ['Banjir', 'Gempa Bumi', 'Tanah Longsor', 'Kebakaran', 'Angin Puting Beliung', 'Tsunami', 'Lainnya'];
        foreach ($disasters as $d) {
            DisasterType::create(['name' => $d]);
        }

        // 3. Isi Master Data Jenis Bantuan
        $assistances = [
            ['name' => 'Paket Makanan Siap Saji', 'unit' => 'Box'],
            ['name' => 'Air Bersih', 'unit' => 'Liter'],
            ['name' => 'Obat-obatan / P3K', 'unit' => 'Paket'],
            ['name' => 'Selimut & Pakaian', 'unit' => 'Pcs'],
            ['name' => 'Tenda Pengungsian', 'unit' => 'Unit'],
            ['name' => 'Perlengkapan Bayi', 'unit' => 'Paket'],
        ];
        
        foreach ($assistances as $a) {
            AssistanceType::create($a);
        }
    }
}