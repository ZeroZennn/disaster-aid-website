<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageReportController extends Controller
{
    /**
     * Tampilkan daftar laporan masuk
     */
    public function index(Request $request)
    {
        // Ambil parameter filter dari request (search & status)
        $query = Report::with(['user', 'disasterType', 'province', 'city'])
            ->latest();

        // Filter Status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Search Tiket / Nama Pelapor
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('ticket_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($u) use ($request) {
                      $u->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $query->paginate(10)->withQueryString(), // Pagination 10 item
            'filters' => $request->only(['search', 'status']), // Kirim balik filter ke frontend biar input gak reset
        ]);
    }

    /**
     * Tampilkan detail laporan untuk diverifikasi
     */
    public function show(Report $laporan) // Parameter 'laporan' sesuai route resource
    {
        // Load relasi lengkap
        $laporan->load([
            'user', 'disasterType', 
            'province', 'city', 'district', 'village', 
            'evidences', 'assistanceDetails'
        ]);

        return Inertia::render('Admin/Reports/Show', [
            'report' => $laporan
        ]);
    }

    /**
     * Update Status Laporan (Verifikasi / Tolak / Selesai)
     */
    public function update(Request $request, Report $laporan)
    {
        // 1. Validasi
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected,done,pending',
            'admin_note' => 'nullable|string|max:500' // Tambahkan validasi catatan
        ]);

        // 2. Update Data
        $laporan->update([
            'status' => $validated['status'],
            'admin_note' => $validated['admin_note'] ?? null, // Simpan catatan jika ada
        ]);

        // 3. Redirect dengan Pesan Spesifik
        $statusMsg = match($validated['status']) {
            'verified' => 'Diverifikasi',
            'rejected' => 'Ditolak',
            'done' => 'Diselesaikan',
            default => 'Diubah'
        };

        return redirect()->route('admin.laporan.index')
            ->with('message', "Laporan {$laporan->ticket_number} berhasil {$statusMsg}.");
    }
}