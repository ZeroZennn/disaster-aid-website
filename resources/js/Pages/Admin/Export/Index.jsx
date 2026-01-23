import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    // State Harian
    const [dailyDate, setDailyDate] = useState('');
    
    // State Range/Bulanan
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Fungsi Download Harian
    const handleDownloadDaily = () => {
        if (!dailyDate) return alert('Pilih tanggal terlebih dahulu!');
        // Kita pakai window.open untuk trigger download file
        window.location.href = route('admin.export.download', { 
            type: 'daily', 
            date: dailyDate 
        });
    };

    // Fungsi Download Range
    const handleDownloadRange = () => {
        if (!startDate || !endDate) return alert('Pilih rentang tanggal terlebih dahulu!');
        window.location.href = route('admin.export.download', { 
            type: 'range', 
            start_date: startDate, 
            end_date: endDate 
        });
    };

    return (
        <AdminLayout>
            <Head title="Rekap & Export Data" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Rekapitulasi Laporan</h1>
                <p className="text-gray-500">Unduh data laporan bencana dalam format Excel (.xlsx).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* KARTU 1: LAPORAN HARIAN */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group hover:shadow-md transition">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        Laporan Harian
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Export semua data laporan yang masuk pada satu tanggal spesifik.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
                            <input 
                                type="date" 
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                value={dailyDate}
                                onChange={(e) => setDailyDate(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleDownloadDaily}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Excel
                        </button>
                    </div>
                </div>

                {/* KARTU 2: LAPORAN BULANAN / RANGE */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group hover:shadow-md transition">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <svg className="w-24 h-24 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="bg-green-100 text-green-600 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </span>
                        Laporan Bulanan / Periode
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Export rekapitulasi data berdasarkan rentang tanggal tertentu (misal: 1 Bulan).
                    </p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                                <input 
                                    type="date" 
                                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                                <input 
                                    type="date" 
                                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleDownloadRange}
                            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Excel
                        </button>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}