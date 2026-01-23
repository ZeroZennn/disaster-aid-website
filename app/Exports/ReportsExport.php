<?php

namespace App\Exports;

use App\Models\Report;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        // Pastikan nama relasi 'disasterType' sesuai dengan yang ada di Model Report.php
        return Report::with(['user', 'disasterType', 'province', 'city'])
            ->whereDate('created_at', '>=', $this->startDate)
            ->whereDate('created_at', '<=', $this->endDate)
            ->get();
    }

    public function headings(): array
    {
        return [
            'No. Tiket',
            'Tanggal Lapor',
            'Nama Pelapor',
            'Jenis Bencana',
            'Lokasi (Kota/Provinsi)',
            'Status',
            'Prioritas',
        ];
    }

    // --- BAGIAN YANG DIPERBAIKI ---
    public function map($report): array
    {
        // Logika Pengecekan:
        // 1. Cek apakah relasi disasterType ada isinya? Jika ada, ambil namanya.
        // 2. Jika tidak ada (null), ambil dari kolom other_disaster_name.
        // 3. Jika keduanya kosong, tulis strip (-).
        
        $disasterName = '-';

        if ($report->disasterType) {
            $disasterName = $report->disasterType->name;
        } elseif ($report->other_disaster_name) {
            $disasterName = $report->other_disaster_name;
        }

        return [
            $report->ticket_number,
            $report->created_at->format('Y-m-d H:i'),
            $report->user->name ?? 'User Terhapus',
            $disasterName,
            ($report->city->name ?? '-') . ', ' . ($report->province->name ?? '-'),
            $report->status,
            $report->priority,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}