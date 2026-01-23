<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RegionController;
// Controller Dashboard Baru
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ManageReportController;
use App\Http\Controllers\Admin\ManageUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// [1] HOMEPAGE (Public)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
    ]);
})->name('home');

// [2] LOGIN (Guest Only) - Diurus oleh auth.php
require __DIR__.'/auth.php';

Route::post('/check-status', [ReportController::class, 'checkStatus'])->name('report.check');

// --- AREA USER (Pelapor) ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    // [3] DASHBOARD USER (Riwayat)
    // DASHBOARD USER
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    // [4] FORM LAPORAN
    Route::get('/lapor', [ReportController::class, 'create'])->name('report.create');
    Route::post('/lapor', [ReportController::class, 'store'])->name('report.store');
    Route::get('/lapor/{report}', [ReportController::class, 'show'])->name('report.show');

    // API WILAYAH (Untuk Dropdown)
    Route::get('/api/cities/{province}', [RegionController::class, 'getCities']);
    Route::get('/api/districts/{city}', [RegionController::class, 'getDistricts']);
    Route::get('/api/villages/{district}', [RegionController::class, 'getVillages']);

    // PROFILE
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- AREA ADMIN (Pengelola) ---
// Nanti kita buat middleware 'admin' biar user biasa gak bisa masuk sini
Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    
    // [5] DASHBOARD ADMIN
    Route::get('/dashboard', function() {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // [6] KELOLA LAPORAN
    Route::resource('laporan', ManageReportController::class);

    // [7] KELOLA USER
    Route::resource('users', ManageUserController::class);
    
    // [8] REKAP / EXPORT
    Route::get('/rekap', [ManageReportController::class, 'export'])->name('rekap.index');
});