<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\ReportsExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ExportController extends Controller
{
    // Tampilkan Halaman UI
    public function index()
    {
        return Inertia::render('Admin/Export/Index');
    }

    // Proses Download Excel
    public function download(Request $request)
    {
        $request->validate([
            'type' => 'required|in:daily,range',
            'date' => 'required_if:type,daily|date',
            'start_date' => 'required_if:type,range|date',
            'end_date' => 'required_if:type,range|date|after_or_equal:start_date',
        ]);

        if ($request->type === 'daily') {
            // Laporan Harian (Start = End = Hari yang dipilih)
            $start = $request->date;
            $end = $request->date;
            $filename = 'Laporan_Harian_' . $start . '.xlsx';
        } else {
            // Laporan Range/Bulanan
            $start = $request->start_date;
            $end = $request->end_date;
            $filename = 'Laporan_Rekap_' . $start . '_sd_' . $end . '.xlsx';
        }

        return Excel::download(new ReportsExport($start, $end), $filename);
    }
}