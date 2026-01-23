import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import MapView from '@/Components/Maps/MapView';
import { useState } from 'react';
import CustomAlert from '@/Components/CustomAlert';

export default function Show({ report }) {
    
    // Setup Form Inertia
    const { data, setData, put, processing } = useForm({
        status: report.status,
        admin_note: report.admin_note || '', // State untuk catatan
    });

    // STATE UNTUK MENGONTROL ALERT
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        inputType: null,
        inputPlaceholder: '',
        targetStatus: null, // Menyimpan status tujuan (verified/rejected/done)
    });

    // 1. FUNGSI MEMBUKA ALERT
    const openAlert = (actionType) => {
        let config = {};

        switch (actionType) {
            case 'verified':
                config = {
                    type: 'info', // Biru
                    title: 'Verifikasi Laporan?',
                    message: 'Laporan akan ditandai sebagai valid. Pastikan bukti sudah sesuai.',
                    inputType: null,
                    confirmText: 'Ya, Verifikasi'
                };
                break;
            case 'done':
                config = {
                    type: 'success', // Hijau
                    title: 'Selesaikan Laporan?',
                    message: 'Pastikan bantuan telah dikirim. Anda bisa menambahkan catatan logistik.',
                    inputType: 'textarea',
                    inputPlaceholder: 'Catatan penyelesaian (Opsional)...',
                    confirmText: 'Tandai Selesai'
                };
                break;
            case 'rejected':
                config = {
                    type: 'danger', // Merah
                    title: 'Tolak Laporan?',
                    message: 'Laporan akan ditandai sebagai ditolak. Wajib sertakan alasan.',
                    inputType: 'textarea',
                    inputPlaceholder: 'Masukkan alasan penolakan...',
                    confirmText: 'Tolak Laporan'
                };
                break;
        }

        setAlertState({
            isOpen: true,
            targetStatus: actionType,
            ...config
        });
    };

    // 2. FUNGSI EKSEKUSI (DIPANGGIL SAAT TOMBOL KONFIRMASI DI ALERT DIKLIK)
    const handleConfirmAction = (inputValue) => {
        
        // Update data form
        data.status = alertState.targetStatus;
        data.admin_note = inputValue;

        // Kirim ke Backend
        put(route('admin.laporan.update', report.id), {
            data: { 
                status: alertState.targetStatus, 
                admin_note: inputValue 
            },
            preserveScroll: true,
            onSuccess: () => {
                setAlertState({ ...alertState, isOpen: false }); // Tutup Alert
            },
            // Note: Error handling sudah dihandle Inertia default atau bisa tambah state error
        });
    };

    return (
        <AdminLayout>
            <Head title={`Verifikasi #${report.ticket_number}`} />

            <CustomAlert 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                onConfirm={handleConfirmAction}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                inputType={alertState.inputType}
                inputPlaceholder={alertState.inputPlaceholder}
                confirmText={alertState.confirmText}
                processing={processing}
            />

            {/* HEADER & NAVIGASI */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <Link href={route('admin.laporan.index')} className="text-gray-500 hover:text-gray-900 text-sm mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Verifikasi Laporan</h1>
                    <p className="text-gray-500">Tiket: <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{report.ticket_number}</span></p>
                </div>
                
                {/* PANEL TOMBOL AKSI */}
                <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                    
                    {['pending', 'rejected'].includes(report.status) && (
                        <button 
                            onClick={() => openAlert('verified')}
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Verifikasi
                        </button>
                    )}
                    
                    {report.status === 'verified' && (
                        <button 
                            onClick={() => openAlert('done')}
                            disabled={processing}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Selesai
                        </button>
                    )}

                    {report.status !== 'rejected' && report.status !== 'done' && (
                        <button 
                            onClick={() => openAlert('rejected')}
                            disabled={processing}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 border border-red-200 transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            Tolak
                        </button>
                    )}
                </div>
            </div>

            {/* STATUS BANNER (Jika ada catatan admin) */}
            {report.admin_note && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                    report.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' : 
                    report.status === 'done' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-200'
                }`}>
                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h4 className="font-bold text-sm uppercase mb-1">Catatan Admin ({report.status}):</h4>
                        <p className="text-sm">{report.admin_note}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* KOLOM KIRI: Detail Laporan */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info Pelapor */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold border-b pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Data Pelapor
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Nama Lengkap</p>
                                <p className="font-semibold text-gray-900">{report.user.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Email Kontak</p>
                                <p className="font-semibold text-gray-900">{report.user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Waktu Lapor</p>
                                <p className="font-semibold text-gray-900">{new Date(report.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Status Saat Ini</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                                    report.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                                    report.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                                    report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Kejadian */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold border-b pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Detail Kejadian
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Jenis Bencana</p>
                                <p className="font-bold text-lg text-gray-900 mt-1">{report.disaster_type?.name || report.other_disaster_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Prioritas</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${
                                    report.priority === 'darurat' ? 'bg-red-100 text-red-800' : 
                                    report.priority === 'tinggi' ? 'bg-orange-100 text-orange-800' : 
                                    report.priority === 'sedang' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {report.priority}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Deskripsi / Kronologi</p>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-line border border-gray-100 text-sm leading-relaxed">
                            {report.description}
                        </div>
                    </div>
                    
                    {/* Peta */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold border-b pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Lokasi Kejadian
                        </h3>
                        <p className="mb-4 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {report.address_detail}, {report.village?.name}, {report.district?.name}, {report.city?.name}, {report.province?.name}
                        </p>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <MapView lat={report.latitude} lng={report.longitude} />
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: Bukti & Bantuan */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Bukti Foto */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold border-b pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Bukti Lapangan
                        </h3>
                        <div className="space-y-4">
                            {report.evidences.map((ev, i) => (
                                <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                                    {ev.file_type === 'video' ? (
                                        <video controls className="w-full bg-black"><source src={`/storage/${ev.file_path}`} /></video>
                                    ) : (
                                        <a href={`/storage/${ev.file_path}`} target="_blank" rel="noreferrer" className="block relative group">
                                            <img src={`/storage/${ev.file_path}`} className="w-full hover:opacity-90 transition object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black bg-opacity-30">
                                                <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">Perbesar</span>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permintaan Bantuan */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold border-b pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            Bantuan Diminta
                        </h3>
                        {report.assistance_details.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Tidak ada bantuan spesifik yang diminta.</p>
                        ) : (
                            <ul className="space-y-2">
                                {report.assistance_details.map((item, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                        <span className="text-gray-700 font-medium">{item.name}</span>
                                        <span className="font-bold text-red-600 bg-white px-2 py-0.5 rounded shadow-sm border border-red-100">
                                            {item.pivot.quantity} {item.unit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}