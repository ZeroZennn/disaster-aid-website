<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportEvidence extends Model
{
    protected $guarded = ['id'];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
