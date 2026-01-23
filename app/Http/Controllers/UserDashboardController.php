<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    public function index()
    {
        // Logic Eager Load dipindah kesini
        $reports = Auth::user()
            ->reports()
            ->with(['disasterType']) // Eager load relasi biar ringan
            ->latest()
            ->get();

        return Inertia::render('User/Dashboard', [
            'reports' => $reports
        ]);
    }
}