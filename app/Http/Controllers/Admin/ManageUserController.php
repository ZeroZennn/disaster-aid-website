<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageUserController extends Controller
{
    // Halaman Kelola User
    public function index()
    {
        return Inertia::render('Admin/Users/Index');
    }
}