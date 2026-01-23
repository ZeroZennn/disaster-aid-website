<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\DisasterType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicMapController extends Controller
{
    // 1. Tampilkan Halaman Utama
    public function index()
    {
        // Kirim data jenis bencana untuk filter dropdown
        return Inertia::render('PublicMap', [
            'disasterTypes' => DisasterType::all()
        ]);
    }

    // 2. API untuk ambil data titik koordinat (Dipanggil via Axios/Fetch)
    public function getMapData(Request $request)
    {
        $query = Report::with(['disasterType', 'user', 'city'])
            ->where('status', 'verified'); // HANYA YANG SUDAH DIVERIFIKASI

        // Filter by Jenis Bencana
        if ($request->type_id) {
            $query->where('disaster_type_id', $request->type_id);
        }

        // Filter by Search (Lokasi/Keterangan)
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('address_detail', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Ambil data terbaru
        $reports = $query->latest()->get();

        return response()->json($reports);
    }
}