<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Models\AssistanceType;
use App\Models\DisasterType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Village;



class ReportController extends Controller
{
    /**
     * Menampilkan Halaman Form Laporan (User/Report/Create.jsx)
     */
    public function create()
    {
        return Inertia::render('User/Report/Create', [
            // Kirim data master ke Frontend untuk isi Dropdown
            'disasterTypes' => DisasterType::all(),
            'assistanceTypes' => AssistanceType::all(),
            // Mengambil Provinsi: [Kode => Nama]
            'provinces' => Province::pluck('name', 'code'),
        ]);
    }

    /**
     * Menyimpan Laporan ke Database
     */
    public function store(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'disaster_type_id' => 'required|exists:disaster_types,id',
            'other_disaster_name' => 'nullable|string',
            'province_code' => 'required',
            'city_code' => 'required',
            'district_code' => 'required',
            'village_code' => 'required',
            'address_detail' => 'nullable|string',
            'description' => 'required|string',
            'priority' => 'required|in:rendah,sedang,tinggi,darurat',
            'latitude' => 'required',
            'longitude' => 'required',
            'file_evidence' => 'required|file|mimes:jpg,jpeg,png,mp4|max:10240',
            'assistance_quantities' => 'nullable|array',
        ]);

        // MULAI TRANSAKSI DATABASE
        DB::beginTransaction();

        try {
            // A. Cek ID Wilayah
            $provinceId = Province::where('code', $validated['province_code'])->value('id');
            $cityId     = City::where('code', $validated['city_code'])->value('id');
            $districtId = District::where('code', $validated['district_code'])->value('id');
            $villageId  = Village::where('code', $validated['village_code'])->value('id');

            if (!$provinceId || !$cityId || !$districtId || !$villageId) {
                throw new \Exception("Data wilayah tidak valid/tidak ditemukan di database.");
            }

            // B. Upload File
            $evidencePath = null;
            if ($request->hasFile('file_evidence')) {
                $evidencePath = $request->file('file_evidence')->store('evidences', 'public');
            }
            
            $ticketNumber = 'AID-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            // C. Simpan Laporan Utama
            $report = $request->user()->reports()->create([
                'ticket_number' => $ticketNumber,
                'disaster_type_id' => $validated['disaster_type_id'],
                'other_disaster_name' => $validated['other_disaster_name'] ?? null,
                'province_id' => $provinceId,
                'city_id'     => $cityId,
                'district_id' => $districtId,
                'village_id'  => $villageId,
                'address_detail' => $validated['address_detail'],
                'description' => $validated['description'],
                'priority' => $validated['priority'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'status' => 'pending',
            ]);

            // D. Simpan Evidence
            if ($evidencePath) {
                $report->evidences()->create([
                    'file_path' => $evidencePath,
                    'file_type' => $request->file('file_evidence')->getClientMimeType() === 'video/mp4' ? 'video' : 'image',
                ]);
            }

            // E. Simpan Detail Bantuan (Pivot)
            if (!empty($request->assistance_quantities)) {
                $syncData = [];
                foreach ($request->assistance_quantities as $assistanceId => $qty) {
                    // Pastikan qty valid angka
                    if (intval($qty) > 0) {
                        $syncData[$assistanceId] = ['quantity' => intval($qty)];
                    }
                }
                // Attach hanya jika ada data
                if (count($syncData) > 0) {
                    $report->assistanceDetails()->attach($syncData);
                }
            }

            // JIKA SEMUA SUKSES, BARU COMMIT (SIMPAN PERMANEN)
            DB::commit();

            return redirect()->route('home')->with('message', 'Laporan berhasil dikirim! Simpan Kode Tiket Anda: ' . $ticketNumber);

        } catch (\Exception $e) {
            // JIKA ADA ERROR, BATALKAN SEMUA (ROLLBACK)
            DB::rollBack();

            // Catat error asli di storage/logs/laravel.log agar kita bisa baca
            Log::error("GAGAL SIMPAN LAPORAN: " . $e->getMessage());
            Log::error($e->getTraceAsString());

            // Kembalikan pesan error ke frontend (Cukup pesan singkatnya)
            return back()->withErrors(['error' => 'Gagal: ' . $e->getMessage()]);
        }
    }

    public function checkStatus(Request $request)
    {
        try {
            $request->validate(['ticket_number' => 'required|string']);

            // Cari laporan beserta relasinya
            $report = \App\Models\Report::with(['disasterType', 'province', 'city'])
                        ->where('ticket_number', $request->ticket_number)
                        ->first();

            if (!$report) {
                return response()->json(['found' => false, 'message' => 'Laporan tidak ditemukan. Cek kembali nomor tiket.']);
            }

            // Gunakan optional() agar jika data relasi hilang, tidak error 500
            $disasterName = optional($report->disasterType)->name ?? ($report->other_disaster_name ?? 'Tidak diketahui');
            $cityName = optional($report->city)->name ?? '-';
            $provName = optional($report->province)->name ?? '-';

            return response()->json([
                'found' => true,
                'data' => [
                    'ticket' => $report->ticket_number,
                    'status' => $report->status,
                    'disaster' => $disasterName,
                    'location' => "$cityName, $provName",
                    'date' => $report->created_at->format('d M Y H:i'),
                ]
            ]);

        } catch (\Exception $e) {
            // Log error sebenarnya agar bisa dicek developer
            \Illuminate\Support\Facades\Log::error("Error Check Status: " . $e->getMessage());

            return response()->json([
                'found' => false, 
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage() // Tampilkan error ke layar sementara
            ], 500);
        }
    }

    public function show(\App\Models\Report $report)
    {
        // 1. Keamanan: Pastikan yang akses adalah pemilik laporan (atau Admin)
        if ($report->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403, 'Anda tidak memiliki akses ke laporan ini.');
        }

        // 2. Ambil Data Lengkap (Eager Loading)
        $report->load([
            'disasterType',
            'province', 'city', 'district', 'village', // Data Wilayah
            'evidences',                               // Foto/Video Bukti
            'assistanceDetails'                        // List Bantuan yang diminta
        ]);

        return Inertia::render('User/Report/Show', [
            'report' => $report
        ]);
    }
}