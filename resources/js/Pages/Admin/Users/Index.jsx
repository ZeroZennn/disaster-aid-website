import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CustomAlert from '@/Components/CustomAlert'; 
import UserModal from '@/Components/Modals/UserModal';

export default function Index({ users, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    // State untuk CustomAlert (Delete Confirmation)
    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'danger',
        title: '',
        message: '',
        targetId: null,
    });

    // State untuk Modal Form (Create/Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // --- LOGIC SEARCH ---
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    // --- LOGIC MODAL CREATE/EDIT ---
    const openCreateModal = () => {
        setEditingUser(null); // Mode Create
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user); // Mode Edit
        setIsModalOpen(true);
    };

    // --- LOGIC DELETE (CUSTOM ALERT) ---
    const promptDelete = (user) => {
        setAlertState({
            isOpen: true,
            type: 'danger',
            title: 'Hapus Pengguna?',
            message: `PERINGATAN: Akun ${user.name} akan dihapus permanen.`,
            targetId: user.id,
        });
    };

    const handleConfirmDelete = () => {
        router.delete(route('admin.users.destroy', alertState.targetId), {
            onFinish: () => setAlertState({ ...alertState, isOpen: false })
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pengguna" />
            
            {/* Component: Modal Form */}
            <UserModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={editingUser} 
            />

            {/* Component: Alert Delete */}
            <CustomAlert 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title={alertState.title}
                message={alertState.message}
                type="danger"
                confirmText="Ya, Hapus Permanen"
            />

            {/* HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Data Pengguna</h1>
                
                <div className="flex flex-col-reverse md:flex-row gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 w-full">
                        <input 
                            type="text" 
                            placeholder="Cari Nama / Email..." 
                            className="rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500 w-full md:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900">
                            Cari
                        </button>
                    </form>

                    {/* TOMBOL TAMBAH USER */}
                    <button 
                        onClick={openCreateModal}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        + User Baru
                    </button>
                </div>
            </div>

            {/* TABEL USER */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Nama User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Tanggal Bergabung</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase border border-purple-200">
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase border border-gray-200">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.id !== auth.user.id && (
                                            <div className="flex justify-end gap-2">
                                                {/* TOMBOL EDIT */}
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 border border-blue-200"
                                                    title="Edit User"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>

                                                {/* TOMBOL DELETE */}
                                                <button 
                                                    onClick={() => promptDelete(user)}
                                                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200"
                                                    title="Hapus User"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                        {user.id === auth.user.id && (
                                            <span className="text-xs text-gray-400 italic">Akun Anda</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total {users.total} Pengguna</span>
                    <div className="flex gap-1">
                        {users.links.map((link, i) => (
                            <Link 
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded text-xs ${
                                    link.active ? 'bg-slate-800 text-white' : 
                                    !link.url ? 'text-gray-300' : 'bg-white border hover:bg-gray-100'
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