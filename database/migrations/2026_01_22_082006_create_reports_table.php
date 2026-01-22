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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique(); // Resi: RPT-001
            
            // Relasi ke User & Jenis Bencana
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('disaster_type_id')->constrained();
            $table->string('other_disaster_name')->nullable(); // Jika pilih 'Lainnya'
            
            // Lokasi (Wilayah & Peta)
            $table->char('province_id', 2)->nullable();
            $table->char('city_id', 4)->nullable();
            $table->char('district_id', 7)->nullable();
            $table->char('village_id', 10)->nullable();
            $table->text('address_detail')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Data Laporan
            $table->text('description');
            $table->enum('priority', ['rendah', 'sedang', 'tinggi', 'darurat'])->default('sedang');
            $table->enum('status', ['pending', 'verified', 'rejected', 'done'])->default('pending');
            $table->text('admin_note')->nullable(); // Catatan admin jika ditolak
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
