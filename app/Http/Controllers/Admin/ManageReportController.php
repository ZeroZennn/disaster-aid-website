<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageReportController extends Controller
{
    // Halaman List Laporan Masuk
    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }

    // Export ke Excel (Placeholder)
    public function export()
    {
        return redirect()->back()->with('message', 'Fitur Export belum dibuat.');
    }
}