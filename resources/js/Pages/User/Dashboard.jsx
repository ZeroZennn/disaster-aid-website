import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, reports }) {
    
    // Hitung Statistik
    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === 'pending').length,
        verified: reports.filter(r => r.status === 'verified').length,
        completed: reports.filter(r => r.status === 'completed').length,
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard User" />

            {/* HEADER PAGE */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Halo, {auth.user.name}
                        
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Selamat datang kembali! Berikut ringkasan laporan bencana Anda.</p>
                </div>
                <Link 
                    href={route('report.create')} 
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Buat Laporan Baru
                </Link>
            </div>

            {/* STATS CARDS (Updated Icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { 
                        title: 'Total Laporan', 
                        value: stats.total, 
                        // Icon: Clipboard List
                        icon: <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>,
                        color: 'bg-blue-50 text-blue-600 border-blue-100' 
                    },
                    { 
                        title: 'Menunggu', 
                        value: stats.pending, 
                        // Icon: Clock
                        icon: <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
                        color: 'bg-yellow-50 text-yellow-600 border-yellow-100' 
                    },
                    { 
                        title: 'Diverifikasi', 
                        value: stats.verified, 
                        // Icon: Check Circle
                        icon: <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
                        color: 'bg-green-50 text-green-600 border-green-100' 
                    },
                    { 
                        title: 'Selesai', 
                        value: stats.completed, 
                        // Icon: Shield Check
                        icon: <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>, 
                        color: 'bg-gray-50 text-gray-600 border-gray-100' 
                    },
                ].map((stat, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${stat.color} transition-all duration-200 hover:shadow-md`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium opacity-80 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold">{stat.value}</h3>
                            </div>
                            <span>{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABEL RIWAYAT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Riwayat Aktivitas
                    </h3>
                </div>
                
                <div className="overflow-x-auto">
                    {reports.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Belum ada laporan</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Anda belum pernah mengirim laporan bencana. Jika terjadi keadaan darurat, segera lapor.</p>
                            <Link href={route('report.create')} className="text-red-600 font-bold hover:underline">
                                + Buat Laporan Sekarang
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-4">Tiket</th>
                                    <th className="px-6 py-4">Jenis Bencana</th>
                                    <th className="px-6 py-4">Tanggal & Waktu</th>
                                    <th className="px-6 py-4 text-center">Prioritas</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                                                {report.ticket_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">
                                                {report.disaster_type?.name || 'Lainnya'}
                                            </p>
                                            {report.other_disaster_name && (
                                                <p className="text-xs text-gray-500 italic">"{report.other_disaster_name}"</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-xs">
                                                    {new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                report.priority === 'darurat' ? 'bg-red-100 text-red-800' :
                                                report.priority === 'tinggi' ? 'bg-orange-100 text-orange-800' :
                                                report.priority === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {report.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm ${
                                                report.status === 'pending' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                                                report.status === 'verified' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                report.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                'bg-green-100 text-green-700 border border-green-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    report.status === 'pending' ? 'bg-gray-400' :
                                                    report.status === 'verified' ? 'bg-blue-500' :
                                                    report.status === 'rejected' ? 'bg-red-500' :
                                                    'bg-green-500'
                                                }`}></span>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={route('report.show', report.id)} 
                                                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center justify-end gap-1 w-full"
                                            >
                                                Detail
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}