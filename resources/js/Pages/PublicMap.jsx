import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'; // <--- Tambah ZoomControl
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// --- LOGIKA IKON CUSTOM ---
const createCustomIcon = (type) => {
    let iconSvg = '';
    let bgColor = '';
    let pulseColor = '';

    const typeName = type ? type.toLowerCase() : 'lainnya';

    if (typeName.includes('banjir')) {
        bgColor = 'bg-blue-500';
        pulseColor = 'bg-blue-400';
        iconSvg = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>`;
    } else if (typeName.includes('kebakaran') || typeName.includes('api')) {
        bgColor = 'bg-red-600';
        pulseColor = 'bg-red-500';
        iconSvg = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>`;
    } else if (typeName.includes('gempa')) {
        bgColor = 'bg-yellow-600';
        pulseColor = 'bg-yellow-500';
        iconSvg = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
    } else {
        bgColor = 'bg-gray-700';
        pulseColor = 'bg-gray-500';
        iconSvg = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    }

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="relative w-10 h-10 flex items-center justify-center">
                <div class="absolute w-full h-full rounded-full ${pulseColor} opacity-50 animate-ping"></div>
                <div class="relative w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-lg flex items-center justify-center">
                    ${iconSvg}
                </div>
                <div class="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

function FlyToLocation({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 16, { duration: 1.5 });
        }
    }, [coords]);
    return null;
}

export default function PublicMap({ disasterTypes }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('');
    const [search, setSearch] = useState('');
    const [activeLocation, setActiveLocation] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('public-map.data'), {
                params: { type_id: selectedType, search: search }
            });
            setReports(response.data);
        } catch (error) {
            console.error("Gagal mengambil data peta", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delay = setTimeout(() => fetchData(), 500);
        return () => clearTimeout(delay);
    }, [selectedType, search]);

    const validReports = reports.filter(r => r.latitude && r.longitude);

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
            <Head title="Peta Sebaran Bencana" />

            {/* === SIDEBAR === */}
            <div className="w-full md:w-96 bg-white shadow-xl z-20 flex flex-col h-full border-r border-gray-200">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-white z-10">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            DisasterAid
                        </Link>
                        <Link href="/" className="text-sm text-gray-400 hover:text-red-600 font-medium">
                            ← Beranda
                        </Link>
                    </div>
                    
                    <h2 className="font-bold text-gray-900 mb-4">Filter Data</h2>

                    <div className="space-y-3">
                        <select 
                            className="w-full rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Semua Jenis Bencana</option>
                            {disasterTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        <input 
                            type="text" 
                            placeholder="Cari lokasi..." 
                            className="w-full rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* List Laporan */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400 text-sm animate-pulse">Memuat data...</div>
                    ) : validReports.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm flex flex-col items-center">
                            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.98l-4.553-2.276M15 7l-5.447-2.724A1 1 0 019 3.382V14.118a1 1 0 01-.806.98L15 7m0 13V7"></path></svg>
                            <span>Tidak ada data valid ditemukan.</span>
                        </div>
                    ) : (
                        validReports.map((report) => (
                            <div 
                                key={report.id} 
                                onClick={() => setActiveLocation([parseFloat(report.latitude), parseFloat(report.longitude)])}
                                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-500 hover:shadow-md transition group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                        report.priority === 'darurat' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {report.priority}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(report.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-red-600 transition">
                                    {report.disaster_type?.name || report.other_disaster_name}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                    {report.city?.name || 'Lokasi tidak terdeteksi'}
                                </p>
                                <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                    Lihat di Peta →
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* === MAIN MAP === */}
            <div className="flex-1 relative z-10">
                <MapContainer 
                    center={[-2.5489, 118.0149]} 
                    zoom={5} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false} // Matikan zoom default (biasanya di kiri atas)
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© OpenStreetMap'
                    />
                    
                    <FlyToLocation coords={activeLocation} />

                    {/* --- TOMBOL ZOOM PINDAH KE KANAN BAWAH --- */}
                    <ZoomControl position="bottomright" /> 

                    {validReports.map((report) => {
                        const disasterName = report.disaster_type?.name || report.other_disaster_name;
                        const customIcon = createCustomIcon(disasterName);

                        return (
                            <Marker 
                                key={report.id} 
                                position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => setActiveLocation([parseFloat(report.latitude), parseFloat(report.longitude)]),
                                }}
                            >
                                <Popup className="custom-popup" closeButton={false}>
                                    <div className="p-1 min-w-[220px]">
                                        <h3 className="font-bold text-gray-900 mb-1 text-base">
                                            {disasterName}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
                                            {new Date(report.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                                        </p>
                                        
                                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 mb-3 border border-gray-100 leading-relaxed">
                                            "{report.description.substring(0, 100)}..."
                                        </div>

                                        <a 
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full text-center bg-blue-600 !text-white !no-underline text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            Buka Rute Google Maps
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>
                
                {/* Overlay Statistik */}
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 z-[1000] hidden md:block">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Bencana Terverifikasi</p>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-3xl font-extrabold text-red-600">{validReports.length}</h2>
                        <span className="text-sm text-gray-500">Titik</span>
                    </div>
                </div>
            </div>
        </div>
    );
}