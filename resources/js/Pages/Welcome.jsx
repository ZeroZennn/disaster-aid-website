import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Welcome() {
    const { flash } = usePage().props;
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

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            setShowSuccess(true);
        }
    }, [flash]);

    // Floating particles effect
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${15 + Math.random() * 10}s`,
        size: `${4 + Math.random() * 8}px`,
    }));

    return (
        <PublicLayout>
            <Head title="Selamat Datang" />

            {showSuccess && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 relative">
                        <div className="bg-green-200 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                            <strong className="font-bold text-lg">Laporan Terkirim!</strong>
                            <p className="block sm:inline text-sm mt-1">{flash.message}</p>
                        </div>
                        <button onClick={() => setShowSuccess(false)} className="text-green-500 hover:text-green-800 ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section - Enhanced */}
            <div className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-0 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                    {/* Floating particles */}
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute rounded-full bg-red-400/20 animate-float-up"
                            style={{
                                left: p.left,
                                bottom: '-20px',
                                width: p.size,
                                height: p.size,
                                animationDelay: p.delay,
                                animationDuration: p.duration,
                            }}
                        />
                    ))}

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f010_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f010_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-fade-in-up text-center md:text-left">
                            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-red-100 text-red-600 text-sm font-semibold mb-6 border border-red-200 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                🚑 Sistem Tanggap Darurat Terintegrasi
                            </span>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                                Laporkan Bencana,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 animate-gradient-x">
                                    Dapatkan Bantuan Cepat.
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                Kami menghubungkan laporan warga langsung dengan tim BPBD dan relawan untuk mempercepat distribusi bantuan logistik ke wilayah terdampak.
                            </p>

                            {/* CTA Buttons - UNCHANGED */}
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
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

                            {/* Trust indicators */}
                            <div className="mt-10 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Respon Cepat</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Terverifikasi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Gratis</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Illustration */}
                        <div className="hidden md:flex justify-center items-center animate-fade-in">
                            <div className="relative">
                                {/* Main illustration card */}
                                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                        {/* Emergency icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-32 h-32 text-red-500 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>

                                        {/* Decorative rings */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-40 h-40 border-4 border-red-200 rounded-full animate-ping-slow opacity-50"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-56 h-56 border-2 border-red-100 rounded-full animate-ping-slower opacity-30"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating notification cards */}
                                <div className="absolute -top-4 -left-8 bg-white rounded-xl shadow-lg p-3 animate-float">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Bantuan Terkirim</p>
                                            <p className="text-xs text-gray-500">Baru saja</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-2 -right-4 bg-white rounded-xl shadow-lg p-3 animate-float animation-delay-1000">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Lokasi Terpantau</p>
                                            <p className="text-xs text-gray-500">Real-time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Cara Kerja</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Proses Pelaporan yang Mudah</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Hanya butuh 3 langkah sederhana untuk melaporkan bencana dan mendapatkan bantuan</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="group relative">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-red-200">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Buat Laporan</h3>
                                <p className="text-gray-600">Isi formulir laporan dengan informasi lokasi, jenis bencana, dan kebutuhan bantuan yang diperlukan.</p>

                                <div className="mt-6 flex items-center text-red-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                                    <span>Mulai Lapor</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Connector line */}
                            <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-red-200"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="group relative">
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-orange-200">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Verifikasi Tim</h3>
                                <p className="text-gray-600">Tim kami akan memverifikasi laporan dan menghubungi Anda untuk konfirmasi data lebih lanjut.</p>

                                <div className="mt-6 flex items-center text-orange-600 font-semibold text-sm">
                                    <span>Proses Cepat</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Connector line */}
                            <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-orange-200"></div>
                        </div>

                        {/* Step 3 */}
                        <div className="group">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-green-200">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Bantuan Dikirim</h3>
                                <p className="text-gray-600">Tim relawan dan BPBD akan segera mendistribusikan bantuan ke lokasi yang terdampak bencana.</p>

                                <div className="mt-6 flex items-center text-green-600 font-semibold text-sm">
                                    <span>Bantuan Tiba</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - Enhanced */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-gray-400 text-sm">Siaga Bencana</div>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                            <div className="text-gray-400 text-sm">Relawan Aktif</div>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">1.2K+</div>
                            <div className="text-gray-400 text-sm">Laporan Terselesaikan</div>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">34</div>
                            <div className="text-gray-400 text-sm">Provinsi Terjangkau</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Butuh Bantuan Darurat?</h2>
                    <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">Jangan ragu untuk melaporkan. Setiap laporan akan ditindaklanjuti dengan cepat oleh tim kami.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href={route('report.create')}
                            className="bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl hover:-translate-y-1 transition transform duration-200"
                        >
                            Buat Laporan Sekarang
                        </Link>
                        <Link
                            href={route('public-map.index')}
                            className="bg-red-500/30 text-white border-2 border-white/50 px-8 py-4 rounded-xl text-lg font-bold hover:bg-red-500/50 transition"
                        >
                            Lihat Peta Bencana
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer info */}
            <div className="bg-gray-50 py-12 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="font-bold text-gray-900">Hotline Darurat</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">119</p>
                            <p className="text-gray-500 text-sm mt-1">Layanan 24 jam BNPB</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-bold text-gray-900">Jangkauan Nasional</span>
                            </div>
                            <p className="text-gray-600">Terintegrasi dengan BPBD seluruh Indonesia</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="font-bold text-gray-900">Data Aman</span>
                            </div>
                            <p className="text-gray-600">Informasi Anda terlindungi dengan enkripsi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL POPUP LACAK LAPORAN - UNCHANGED */}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Tiket (Contoh: AID-2026...)</label>
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
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${trackingResult.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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

            {/* Custom Styles */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes float-up {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes ping-slower {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animate-float-up { animation: float-up linear infinite; }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
                .animate-ping-slow { animation: ping-slow 2s ease-in-out infinite; }
                .animate-ping-slower { animation: ping-slower 3s ease-in-out infinite; }
                .animate-gradient-x { 
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite; 
                }
                .animation-delay-1000 { animation-delay: 1s; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </PublicLayout>
    );
}