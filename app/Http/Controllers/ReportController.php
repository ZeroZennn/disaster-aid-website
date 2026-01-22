<?php

namespace App\Http\Controllers;

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
        // 1. Validasi (Tetap Sama)
        $validated = $request->validate([
            'disaster_type_id' => 'required|exists:disaster_types,id',
            'other_disaster_name' => 'nullable|string',
            'province_code' => 'required', // Kita terima Code
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

        try {
            // --- PERBAIKAN LOGIC DISINI ---
            // Kita cari ID aslinya dulu berdasarkan CODE yang dikirim
            $provinceId = Province::where('code', $validated['province_code'])->value('id');
            $cityId     = City::where('code', $validated['city_code'])->value('id');
            $districtId = District::where('code', $validated['district_code'])->value('id');
            $villageId  = Village::where('code', $validated['village_code'])->value('id');

            // Pastikan data ketemu (Safety check)
            if (!$provinceId || !$cityId || !$districtId || !$villageId) {
                return back()->withErrors(['error' => 'Data wilayah tidak valid di database.']);
            }

            // Upload File (Tetap Sama)
            $evidencePath = null;
            if ($request->hasFile('file_evidence')) {
                $evidencePath = $request->file('file_evidence')->store('evidences', 'public');
            }
            $ticketNumber = 'AID-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            // Simpan Laporan
            $report = $request->user()->reports()->create([
                'ticket_number' => $ticketNumber,
                'disaster_type_id' => $validated['disaster_type_id'],
                'other_disaster_name' => $validated['other_disaster_name'] ?? null,
                
                // --- SIMPAN ID ASLI (Bukan Code lagi) ---
                'province_id' => $provinceId,
                'city_id'     => $cityId,
                'district_id' => $districtId,
                'village_id'  => $villageId,
                // ----------------------------------------

                'address_detail' => $validated['address_detail'],
                'description' => $validated['description'],
                'priority' => $validated['priority'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'status' => 'pending',
            ]);

            // Simpan Evidence & Bantuan (Tetap Sama)
            if ($evidencePath) {
                $report->evidences()->create([
                    'file_path' => $evidencePath,
                    'file_type' => $request->file('file_evidence')->getClientMimeType() === 'video/mp4' ? 'video' : 'image',
                ]);
            }

            if (!empty($request->assistance_quantities)) {
                $syncData = [];
                foreach ($request->assistance_quantities as $assistanceId => $qty) {
                    if ($qty > 0) $syncData[$assistanceId] = ['quantity' => $qty];
                }
                $report->assistanceDetails()->attach($syncData);
            }

            return redirect()->route('dashboard')->with('message', 'Laporan berhasil dikirim! Kode Tiket: ' . $ticketNumber);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menyimpan laporan: ' . $e->getMessage()]);
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
}