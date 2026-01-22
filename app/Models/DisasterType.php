<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisasterType extends Model
{
    protected $guarded = ['id'];

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
