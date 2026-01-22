<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Village;

class RegionController extends Controller
{
    // Ambil daftar Kota berdasarkan Kode Provinsi
    public function getCities($province_code)
    {
        // Kita gunakan pluck('name', 'code') agar yang dikirim ke frontend:
        // { "1101": "KABUPATEN ACEH SELATAN", ... }
        $cities = City::where('province_code', $province_code)->pluck('name', 'code');
        return response()->json($cities);
    }

    // Ambil daftar Kecamatan berdasarkan Kode Kota
    public function getDistricts($city_code)
    {
        $districts = District::where('city_code', $city_code)->pluck('name', 'code');
        return response()->json($districts);
    }

    // Ambil daftar Kelurahan berdasarkan Kode Kecamatan
    public function getVillages($district_code)
    {
        $villages = Village::where('district_code', $district_code)->pluck('name', 'code');
        return response()->json($villages);
    }
}