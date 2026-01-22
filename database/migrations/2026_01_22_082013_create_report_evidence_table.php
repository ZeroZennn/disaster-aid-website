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
        Schema::create('report_evidences', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel reports
            $table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            $table->string('file_path');
            $table->enum('file_type', ['image', 'video'])->default('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_evidence');
    }
};
