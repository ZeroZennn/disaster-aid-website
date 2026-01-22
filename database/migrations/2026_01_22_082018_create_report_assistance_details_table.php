<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('report_assistance_details', function (Blueprint $table) {
            $table->id();
            // Relasi ke reports & assistance_types
            $table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            $table->foreignId('assistance_type_id')->constrained('assistance_types');
            $table->integer('quantity'); // Jumlah bantuan yang diminta
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_assistance_details');
    }
};
