import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import MapPicker from '@/Components/Maps/MapPicker';
import { useState, useEffect } from 'react';

export default function Create({ auth, disasterTypes, assistanceTypes, provinces }) {
    
    // --- 1. SETUP STATE DATA ---
    const { data, setData, post, processing, errors } = useForm({
        // Info Bencana
        disaster_type_id: '',
        other_disaster_name: '',
        description: '',
        priority: 'sedang', // Default Sedang
        
        // Lokasi
        province_code: '',
        city_code: '',
        district_code: '',
        village_code: '',
        address_detail: '',
        latitude: '',
        longitude: '',
        
        // Bantuan (Kita simpan ID dan Jumlahnya)
        // Format: { id_bantuan: jumlah, ... }
        assistance_quantities: {}, 
        
        // Bukti
        file_evidence: null,
    });

    const otherTypeId = disasterTypes.find(type => type.name === 'Lainnya')?.id;
    const isOtherSelected = parseInt(data.disaster_type_id) === otherTypeId;

    // State Lokal untuk menyimpan opsi dropdown yang diambil dari API
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // --- 2. LOGIKA API WILAYAH (CASCADING DROPDOWN) ---
    
    // Fetch Kota saat Provinsi berubah
    const handleProvinceChange = async (e) => {
        const code = e.target.value;
        console.log("Provinsi dipilih:", code); // Debug 1

        // Reset
        setData(d => ({ ...d, province_code: code, city_code: '', district_code: '', village_code: '' }));
        setCities([]); setDistricts([]); setVillages([]);

        if(code) {
            try {
                // Fetch Data
                const res = await fetch(`/api/cities/${code}`);
                console.log("Status API:", res.status); // Debug 2
                
                if (!res.ok) throw new Error("Gagal request ke server");
                
                const data = await res.json();
                console.log("Data diterima:", data); // Debug 3

                // Cek apakah data kosong?
                if (Object.keys(data).length === 0) {
                    alert("Data Kota kosong untuk provinsi ini!");
                }
                
                setCities(data);
            } catch (err) {
                console.error("Error Fetching:", err);
                alert("Terjadi kesalahan saat mengambil data kota.");
            }
        }
    };

    // Fetch Kecamatan saat Kota berubah
    const handleCityChange = async (e) => {
        const code = e.target.value;
        setData(d => ({ ...d, city_code: code, district_code: '', village_code: '' }));
        setDistricts([]); setVillages([]);

        if(code) {
            const res = await fetch(`/api/districts/${code}`);
            const data = await res.json();
            setDistricts(data);
        }
    };

    // Fetch Kelurahan saat Kecamatan berubah
    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        setData(d => ({ ...d, district_code: code, village_code: '' }));
        setVillages([]);

        if(code) {
            const res = await fetch(`/api/villages/${code}`);
            const data = await res.json();
            setVillages(data);
        }
    };

    // --- 3. LOGIKA BANTUAN ---
    
    // Saat Checkbox diklik
    const handleAssistanceCheck = (typeId, isChecked) => {
        const newQuantities = { ...data.assistance_quantities };
        if (isChecked) {
            newQuantities[typeId] = 1; // Default jumlah 1 jika dicentang
        } else {
            delete newQuantities[typeId]; // Hapus dari data jika uncheck
        }
        setData('assistance_quantities', newQuantities);
    };

    // Saat Jumlah diubah
    const handleQuantityChange = (typeId, qty) => {
        const newQuantities = { ...data.assistance_quantities };
        newQuantities[typeId] = qty;
        setData('assistance_quantities', newQuantities);
    };

    // --- 4. LAIN-LAIN ---
    
    const handleLocationSelect = (latlng) => {
        setData(data => ({ ...data, latitude: latlng.lat, longitude: latlng.lng }));
    };

    if (Object.keys(errors).length > 0) {
        console.error("VALIDASI ERROR DARI SERVER:", errors);
    }

    const submit = (e) => {
        e.preventDefault();
        post(route('report.store'));
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Laporan Baru</h2>}
        >
            <Head title="Lapor Bencana" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white overflow-hidden shadow-xl sm:rounded-xl p-8 space-y-10">
                        
                        {/* ================= SECTION 1: LOKASI BENCANA ================= */}
                        <div className="space-y-6">
                            <div className="border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-900">📍 Lokasi Bencana</h3>
                                <p className="text-sm text-gray-500">Tentukan lokasi wilayah administratif dan titik koordinat peta.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Provinsi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Provinsi</label>
                                    <select 
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500"
                                        value={data.province_code}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">-- Pilih Provinsi --</option>
                                        {Object.entries(provinces).map(([code, name]) => (
                                            <option key={code} value={code}>{name}</option>
                                        ))}
                                    </select>
                                    {errors.province_code && <p className="text-red-500 text-xs mt-1">{errors.province_code}</p>}
                                </div>

                                {/* Kota/Kab */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                                    <select 
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                                        value={data.city_code}
                                        onChange={handleCityChange}
                                        disabled={!cities || Object.keys(cities).length === 0}
                                    >
                                        <option value="">-- Pilih Kota/Kab --</option>
                                        {Object.entries(cities).map(([code, name]) => (
                                            <option key={code} value={code}>{name}</option>
                                        ))}
                                    </select>
                                    {errors.city_code && <p className="text-red-500 text-xs mt-1">{errors.city_code}</p>}
                                </div>

                                {/* Kecamatan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
                                    <select 
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                                        value={data.district_code}
                                        onChange={handleDistrictChange}
                                        disabled={!districts || Object.keys(districts).length === 0}
                                    >
                                        <option value="">-- Pilih Kecamatan --</option>
                                        {Object.entries(districts).map(([code, name]) => (
                                            <option key={code} value={code}>{name}</option>
                                        ))}
                                    </select>
                                    {errors.district_code && <p className="text-red-500 text-xs mt-1">{errors.district_code}</p>}
                                </div>

                                {/* Kelurahan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kelurahan/Desa</label>
                                    <select 
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                                        value={data.village_code}
                                        onChange={(e) => setData('village_code', e.target.value)}
                                        disabled={!villages || Object.keys(villages).length === 0}
                                    >
                                        <option value="">-- Pilih Kelurahan --</option>
                                        {Object.entries(villages).map(([code, name]) => (
                                            <option key={code} value={code}>{name}</option>
                                        ))}
                                    </select>
                                    {errors.village_code && <p className="text-red-500 text-xs mt-1">{errors.village_code}</p>}
                                </div>
                            </div>

                            {/* Alamat Detail */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Alamat Lengkap / Patokan</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500"
                                    placeholder="Jl. Mawar No. 12, RT 05/RW 02 (Dekat Masjid Al-Huda)"
                                    value={data.address_detail}
                                    onChange={(e) => setData('address_detail', e.target.value)}
                                />
                            </div>

                            {/* Peta */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Titik Koordinat Peta <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-1">
                                    <MapPicker onLocationSelect={handleLocationSelect} />
                                </div>
                                <div className="flex gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                                    <span>Lat: {data.latitude || 'Belum dipilih'}</span>
                                    <span>Long: {data.longitude || 'Belum dipilih'}</span>
                                </div>
                                {(errors.latitude || errors.longitude) && <p className="text-red-500 text-sm">Harap klik titik lokasi kejadian di peta.</p>}
                            </div>
                        </div>

                        {/* ================= SECTION 2: JENIS BENCANA & DESKRIPSI ================= */}
                        <div className="space-y-6">
                            <div className="border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-900">⚠️ Informasi Kejadian</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* JENIS BENCANA */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Jenis Bencana</label>
                                    <select 
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500"
                                        value={data.disaster_type_id}
                                        onChange={(e) => setData('disaster_type_id', e.target.value)}
                                    >
                                        <option value="">-- Pilih Jenis Bencana --</option>
                                        {disasterTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.disaster_type_id && <p className="text-red-500 text-xs mt-1">{errors.disaster_type_id}</p>}
                                </div>

                                {/* INPUT KHUSUS JIKA 'LAINNYA' DIPILIH */}
                                {isOtherSelected && (
                                    <div className="animate-fade-in-down">
                                        <label className="block text-sm font-medium text-gray-700">Sebutkan Bencananya</label>
                                        <input 
                                            type="text" 
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 bg-yellow-50"
                                            placeholder="Contoh: Wabah Penyakit, Meteor Jatuh..."
                                            value={data.other_disaster_name}
                                            onChange={(e) => setData('other_disaster_name', e.target.value)}
                                        />
                                        {errors.other_disaster_name && <p className="text-red-500 text-xs mt-1">{errors.other_disaster_name}</p>}
                                    </div>
                                )}

                                {/* PRIORITAS */}
                                <div className={isOtherSelected ? "md:col-span-2" : ""}> 
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Prioritas</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['rendah', 'sedang', 'tinggi', 'darurat'].map((prio) => (
                                            <label key={prio} className="flex items-center space-x-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="priority" 
                                                    value={prio}
                                                    checked={data.priority === prio}
                                                    onChange={(e) => setData('priority', e.target.value)}
                                                    className="text-red-600 focus:ring-red-500"
                                                />
                                                <span className={`capitalize px-2 py-1 rounded text-sm font-semibold ${
                                                    prio === 'darurat' ? 'bg-red-100 text-red-800' : 
                                                    prio === 'tinggi' ? 'bg-orange-100 text-orange-800' : 
                                                    prio === 'sedang' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {prio}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
                                </div>
                            </div>

                            {/* DESKRIPSI */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Kronologi</label>
                                <textarea 
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500"
                                    rows="4"
                                    placeholder="Jelaskan secara detail kejadian bencana, waktu kejadian, dan dampak kerusakan..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        {/* ================= SECTION 3: JENIS BANTUAN ================= */}
                        <div className="space-y-6">
                            <div className="border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-900">📦 Bantuan yang Dibutuhkan</h3>
                                <p className="text-sm text-gray-500">Centang bantuan yang diperlukan dan masukkan jumlah estimasinya.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {assistanceTypes.map((assist) => (
                                    <div key={assist.id} className={`border rounded-lg p-3 transition ${data.assistance_quantities[assist.id] ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    id={`assist-${assist.id}`}
                                                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                                    onChange={(e) => handleAssistanceCheck(assist.id, e.target.checked)}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm flex-grow">
                                                <label htmlFor={`assist-${assist.id}`} className="font-medium text-gray-700">
                                                    {assist.name}
                                                </label>
                                                <p className="text-gray-500 text-xs">Satuan: {assist.unit}</p>
                                                
                                                {/* Input Jumlah hanya muncul jika dicentang */}
                                                {data.assistance_quantities[assist.id] !== undefined && (
                                                    <div className="mt-2">
                                                        <input 
                                                            type="number" 
                                                            min="1"
                                                            placeholder="Jumlah"
                                                            className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 py-1"
                                                            value={data.assistance_quantities[assist.id]}
                                                            onChange={(e) => handleQuantityChange(assist.id, e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ================= SECTION 4: BUKTI FOTO/VIDEO ================= */}
                        <div className="space-y-6">
                            <div className="border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-900">📷 Upload Bukti</h3>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                                <input 
                                    type="file" 
                                    id="file_upload"
                                    className="hidden"
                                    accept="image/*,video/*"
                                    onChange={(e) => setData('file_evidence', e.target.files[0])}
                                />
                                <label htmlFor="file_upload" className="cursor-pointer">
                                    <div className="text-gray-600">
                                        {data.file_evidence ? (
                                            <div className="font-semibold text-red-600">
                                                File terpilih: {data.file_evidence.name}
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">Klik untuk upload foto/video kejadian</p>
                                                <p className="mt-1 text-xs text-gray-500">PNG, JPG, MP4 up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                            {errors.file_evidence && <p className="text-red-500 text-sm">{errors.file_evidence}</p>}
                        </div>

                        {/* TOMBOL SUBMIT */}
                        <div className="pt-6 border-t flex justify-end items-center gap-4">
                            <button 
                                type="button" 
                                onClick={() => window.history.back()}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition ${
                                    processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {processing ? 'Mengirim...' : 'Kirim Laporan Bencana'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}