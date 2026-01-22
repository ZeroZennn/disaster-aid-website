import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import axios from 'axios';

export default function Welcome() {
    // State untuk Modal Tracking
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketInput, setTicketInput] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Fungsi Cari Status
    const handleTrackStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setTrackingResult(null);

        try {
            const res = await axios.post(route('report.check'), { ticket_number: ticketInput });
            if (res.data.found) {
                setTrackingResult(res.data.data);
            } else {
                setErrorMsg(res.data.message);
            }
        } catch (err) {
            setErrorMsg('Terjadi kesalahan sistem. Coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <Head title="Selamat Datang" />

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-6 py-24 text-center">
                <div className="animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 text-sm font-semibold mb-6">
                        🚑 Sistem Tanggap Darurat Terintegrasi
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Laporkan Bencana,<br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                            Dapatkan Bantuan Cepat.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Kami menghubungkan laporan warga langsung dengan tim BPBD dan relawan untuk mempercepat distribusi bantuan logistik ke wilayah terdampak.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {/* Tombol Lapor */}
                        <Link 
                            href={route('report.create')} 
                            className="bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 transition transform duration-200"
                        >
                            Lapor Sekarang
                        </Link>
                        
                        {/* Tombol Lacak Status (Memicu Modal) */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 hover:border-gray-400 transition"
                        >
                            Lacak Status Laporan
                        </button>
                    </div>
                </div>

                {/* Statistik Singkat (Hiasan) */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-10">
                    <div>
                        <div className="text-3xl font-bold text-gray-900">24/7</div>
                        <div className="text-gray-500">Siaga Bencana</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-gray-900">Terintegrasi</div>
                        <div className="text-gray-500">Pusat & Daerah</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-gray-900">Transparan</div>
                        <div className="text-gray-500">Pantau Realtime</div>
                    </div>
                </div>
            </div>

            {/* MODAL POPUP LACAK LAPORAN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        {/* Header Modal */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Lacak Tiket Laporan</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6">
                            <form onSubmit={handleTrackStatus}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Tiket (Contoh: RPT-2026...)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500 uppercase"
                                        placeholder="Masukkan Kode Tiket..."
                                        value={ticketInput}
                                        onChange={(e) => setTicketInput(e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 transition"
                                    >
                                        {loading ? '...' : 'Cari'}
                                    </button>
                                </div>
                            </form>

                            {/* Hasil Pencarian */}
                            <div className="mt-6">
                                {loading && <p className="text-center text-gray-500">Sedang mencari data...</p>}
                                
                                {errorMsg && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                        {errorMsg}
                                    </div>
                                )}

                                {trackingResult && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-500">Nomor Tiket</p>
                                                <p className="font-bold text-gray-900">{trackingResult.ticket}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                trackingResult.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                trackingResult.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                                                trackingResult.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {trackingResult.status}
                                            </span>
                                        </div>
                                        <div className="border-t border-green-200 pt-2">
                                            <p className="text-sm"><span className="font-semibold">Bencana:</span> {trackingResult.disaster}</p>
                                            <p className="text-sm"><span className="font-semibold">Lokasi:</span> {trackingResult.location}</p>
                                            <p className="text-sm"><span className="font-semibold">Tanggal:</span> {trackingResult.date}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}