<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    // Izinkan semua kolom diisi (kecuali ID)
    protected $guarded = ['id'];

    // Relasi ke User (Pelapor)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Jenis Bencana
    public function disasterType()
    {
        return $this->belongsTo(DisasterType::class);
    }

    // Relasi ke Bukti Foto/Video (One to Many)
    public function evidences()
    {
        return $this->hasMany(ReportEvidence::class);
    }

    // Relasi ke Detail Bantuan (Many to Many via Pivot)
    public function assistanceDetails()
    {
        return $this->belongsToMany(AssistanceType::class, 'report_assistance_details')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    // --- RELASI KE WILAYAH (Laravolt) ---
    // Agar nanti kita bisa panggil $report->province->name
    
    public function province()
    {
        return $this->belongsTo(\Laravolt\Indonesia\Models\Province::class, 'province_id');
    }

    public function city()
    {
        return $this->belongsTo(\Laravolt\Indonesia\Models\City::class, 'city_id');
    }

    public function district()
    {
        return $this->belongsTo(\Laravolt\Indonesia\Models\District::class, 'district_id');
    }

    public function village()
    {
        return $this->belongsTo(\Laravolt\Indonesia\Models\Village::class, 'village_id');
    }
}