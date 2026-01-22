<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssistanceType extends Model
{
    protected $guarded = ['id'];

    public function reports()
    {
        return $this->belongsToMany(Report::class, 'report_assistance_details')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
