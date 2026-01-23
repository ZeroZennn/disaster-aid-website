<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Hitung Statistik Kartu
        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'pending')->count(),
            'verified' => Report::where('status', 'verified')->count(),
            'rejected' => Report::where('status', 'rejected')->count(),
        ];

        // 2. Ambil 5 Laporan Terbaru (Untuk Widget "Perlu Tindakan")
        $recentReports = Report::with(['user', 'disasterType'])
            ->latest()
            ->limit(5)
            ->get();

        // 3. Data Grafik (Tren 7 Hari Terakhir)
        // Query ini mengelompokkan laporan berdasarkan tanggal pembuatan
        $chartData = Report::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(6)) // 7 hari terakhir
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Format Data untuk Chart.js (Array Labels & Array Data)
        // Kita loop 7 hari terakhir agar tanggal yang kosong tetap muncul angka 0
        $labels = [];
        $data = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $record = $chartData->firstWhere('date', $date);
            
            $labels[] = Carbon::parse($date)->format('d M'); // Format: 24 Jan
            $data[] = $record ? $record->count : 0;
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'chart' => [
                'labels' => $labels,
                'dataset' => $data
            ]
        ]);
    }
}