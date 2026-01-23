import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrasi Komponen ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ stats, recentReports, chart = null }) {

    // SAFETY CHECK: Jika data chart belum ada, jangan render grafik dulu
    if (!chart || !stats) {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-gray-500">
                    Memuat data statistik...
                </div>
            </AdminLayout>
        );
    }

    // Konfigurasi Grafik
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Sembunyikan legenda biar bersih
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 } // Paksa angka bulat (gak ada laporan 1.5)
            }
        }
    };

    const chartData = {
        labels: chart.labels,
        datasets: [
            {
                fill: true,
                label: 'Laporan Masuk',
                data: chart.dataset,
                borderColor: 'rgb(220, 38, 38)', // Merah
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4, // Garis melengkung halus
            },
        ],
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Pantau aktivitas pelaporan bencana secara realtime.</p>
            </div>

            {/* 1. KARTU STATISTIK */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Laporan */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Laporan</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                    </div>
                </div>

                {/* Perlu Verifikasi (PENDING) - Paling Penting */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-red-600 font-bold uppercase tracking-wider">Perlu Verifikasi</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3>
                    </div>
                </div>

                {/* Diverifikasi */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Telah Diverifikasi</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.verified}</h3>
                    </div>
                </div>

                {/* Ditolak */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Laporan Ditolak</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.rejected}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 2. GRAFIK TREN (KOLOM KIRI - LEBAR) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                        Tren Laporan (7 Hari Terakhir)
                    </h3>
                    <div className="h-64 w-full">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* 3. LAPORAN TERBARU (KOLOM KANAN - SEMPIT) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Laporan Terbaru</h3>
                        <Link href={route('admin.laporan.index')} className="text-xs text-blue-600 hover:underline">Lihat Semua</Link>
                    </div>
                    
                    <div className="space-y-4">
                        {recentReports.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">Belum ada laporan masuk.</p>
                        ) : (
                            recentReports.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={route('admin.laporan.show', item.id)}
                                    className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-mono text-gray-400 mb-1">{item.ticket_number}</p>
                                            <p className="font-semibold text-gray-800 text-sm group-hover:text-red-600 transition">
                                                {item.disaster_type?.name || 'Bencana Lain'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Oleh: {item.user?.name}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            item.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}