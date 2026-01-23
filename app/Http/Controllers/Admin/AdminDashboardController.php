<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Nanti bisa tambah logic statistik admin disini
        return Inertia::render('Admin/Dashboard');
    }
}