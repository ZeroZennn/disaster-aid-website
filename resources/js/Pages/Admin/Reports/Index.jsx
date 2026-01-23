import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ reports, filters }) {
    // State untuk Search & Filter
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Fungsi Trigger Search (Debounce atau Enter)
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('laporan.index'), { search, status }, { preserveState: true });
    };

    // Fungsi Filter Status
    const handleFilterStatus = (e) => {
        const val = e.target.value;
        setStatus(val);
        router.get(route('laporan.index'), { search, status: val }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Laporan" />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Laporan Masuk</h1>
                
                {/* TOOLBAR FILTER */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <select 
                        className="rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                        value={status}
                        onChange={handleFilterStatus}
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                    </select>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Cari Tiket / Nama..." 
                            className="rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            {/* TABEL DATA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b">
                            <tr>
                                <th className="px-6 py-4">Tiket</th>
                                <th className="px-6 py-4">Pelapor</th>
                                <th className="px-6 py-4">Bencana & Lokasi</th>
                                <th className="px-6 py-4 text-center">Prioritas</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reports.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                reports.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-slate-700">{item.ticket_number}</span>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{item.user?.name}</div>
                                            <div className="text-xs text-gray-500">{item.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">
                                                {item.disaster_type?.name || item.other_disaster_name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.city?.name}, {item.province?.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                item.priority === 'darurat' ? 'bg-red-100 text-red-800' :
                                                item.priority === 'tinggi' ? 'bg-orange-100 text-orange-800' :
                                                item.priority === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                item.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                                                item.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                                                item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link 
                                                href={route('admin.laporan.show', item.id)} 
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                            >
                                                Proses
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* PAGINATION */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        Menampilkan {reports.from || 0} - {reports.to || 0} dari {reports.total} data
                    </div>
                    <div className="flex gap-1">
                        {reports.links.map((link, k) => (
                            <Link 
                                key={k}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded text-xs ${
                                    link.active ? 'bg-red-600 text-white' : 
                                    !link.url ? 'text-gray-400' : 'bg-white border hover:bg-gray-100'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}