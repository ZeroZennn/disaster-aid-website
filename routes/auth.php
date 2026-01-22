<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    // HANYA ROUTE LOGIN (Register dihapus)
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    // ROUTE LOGOUT
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');
});