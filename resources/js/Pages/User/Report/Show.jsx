import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import MapView from '@/Components/Maps/MapView';

export default function Show({ auth, report }) {
    
    // Helper untuk Warna Status
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'verified': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <DashboardLayout>
            <Head title={`Laporan #${report.ticket_number}`} />

            {/* HEADER: Tombol Kembali & Judul */}
            <div className="mb-6 flex items-center gap-4">
                <Link 
                    href={route('dashboard')} 
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detail Laporan</h1>
                    <p className="text-gray-500 text-sm">Tiket: <span className="font-mono font-bold">{report.ticket_number}</span></p>
                </div>
                <div className="ml-auto">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border capitalize ${getStatusColor(report.status)}`}>
                        {report.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: Informasi Utama */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* KARTU 1: Info Bencana */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Informasi Kejadian
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Jenis Bencana</p>
                                <p className="text-lg font-medium text-gray-900 mt-1">
                                    {report.disaster_type?.name || report.other_disaster_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Tingkat Prioritas</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-md text-sm font-bold capitalize ${
                                    report.priority === 'darurat' ? 'bg-red-100 text-red-800' :
                                    report.priority === 'tinggi' ? 'bg-orange-100 text-orange-800' :
                                    report.priority === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {report.priority}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Deskripsi / Kronologi</p>
                                <p className="text-gray-700 mt-1 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {report.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KARTU 2: Lokasi & Peta */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Lokasi Kejadian
                        </h3>
                        
                        <div className="mb-4 text-sm text-gray-600">
                            <p className="font-semibold text-gray-900 text-base">
                                {report.address_detail}
                            </p>
                            <p className="mt-1">
                                {report.village?.name}, {report.district?.name} <br/>
                                {report.city?.name}, {report.province?.name}
                            </p>
                        </div>

                        {/* Peta Read-Only */}
                        <MapView lat={report.latitude} lng={report.longitude} />
                    </div>

                    {/* KARTU 3: List Bantuan */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            Permintaan Bantuan
                        </h3>
                        
                        {report.assistance_details?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {report.assistance_details.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                        <span className="font-medium text-gray-800">{item.name}</span>
                                        <span className="bg-white px-3 py-1 rounded-md text-red-600 font-bold text-sm shadow-sm border border-red-100">
                                            {item.pivot.quantity} {item.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Tidak ada bantuan khusus yang diminta.</p>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN: Bukti Foto/Video */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Bukti Lapangan
                        </h3>
                        
                        {report.evidences?.map((evidence, index) => (
                            <div key={index} className="mb-4">
                                {evidence.file_type === 'video' ? (
                                    <video controls className="w-full rounded-lg shadow-sm border border-gray-200">
                                        <source src={`/storage/${evidence.file_path}`} type="video/mp4" />
                                        Browser Anda tidak mendukung video.
                                    </video>
                                ) : (
                                    <div className="group relative">
                                        <img 
                                            src={`/storage/${evidence.file_path}`} 
                                            alt="Bukti Bencana" 
                                            className="w-full rounded-lg shadow-sm border border-gray-200 object-cover hover:opacity-95 transition" 
                                        />
                                        <a 
                                            href={`/storage/${evidence.file_path}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                        >
                                            Perbesar
                                        </a>
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Diunggah: {new Date(evidence.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Info Tambahan */}
                    <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Catatan:</strong><br/>
                            Laporan ini sedang ditinjau oleh tim BPBD. Jika status berubah menjadi <span className="font-bold">Diverifikasi</span>, bantuan akan segera dikirim.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}