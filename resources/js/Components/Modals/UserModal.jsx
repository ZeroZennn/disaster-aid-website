import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function UserModal({ isOpen, onClose, user = null }) {
    // Mode Create atau Edit?
    const isEditMode = !!user;

    // Setup Form Inertia
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    // Reset atau Isi Data saat Modal Dibuka/Ditutup
    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (isEditMode) {
                // Mode Edit: Isi form dengan data user
                setData({
                    name: user.name,
                    email: user.email,
                    password: '', // Password kosongkan (hanya diisi jika mau ganti)
                    role: user.role,
                });
            } else {
                // Mode Create: Form kosong
                reset();
            }
        }
    }, [isOpen, user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditMode) {
            put(route('admin.users.update', user.id), {
                onSuccess: () => { reset(); onClose(); }
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => { reset(); onClose(); }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
                
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isEditMode ? 'Edit Data User' : 'Tambah User Baru'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            className="w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                        <input 
                            type="email" 
                            className="w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role / Hak Akses</label>
                        <select 
                            className="w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                            value={data.role}
                            onChange={e => setData('role', e.target.value)}
                        >
                            <option value="user">User (Pelapor)</option>
                            <option value="admin">Admin (Pengelola)</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isEditMode ? 'Password Baru (Opsional)' : 'Password'}
                        </label>
                        <input 
                            type="password" 
                            placeholder={isEditMode ? 'Biarkan kosong jika tidak ingin mengganti' : 'Minimal 8 karakter'}
                            className="w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-red-200"
                        >
                            {processing ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Buat User')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}