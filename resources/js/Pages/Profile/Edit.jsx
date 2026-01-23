import PublicLayout from '@/Layouts/PublicLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    return (
        <PublicLayout>
            <Head title="Pengaturan Akun" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 sm:px-0">
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800 leading-tight">Pengaturan Akun</h2>
                            <p className="text-gray-500 text-sm">Kelola informasi profil dan keamanan akun Anda.</p>
                        </div>
                        {/* Tombol Kembali ke Dashboard sesuai Role */}
                        <a 
                            href={auth.user.role === 'admin' ? route('admin.dashboard') : route('dashboard')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                        >
                            ← Kembali ke Dashboard
                        </a>
                    </div>

                    {/* GRID LAYOUT: Kiri (Menu/Info) - Kanan (Forms) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                        
                        {/* KOLOM KIRI: Ringkasan Profil */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-4xl font-bold text-red-600 mx-auto mb-4 border-4 border-white shadow-lg">
                                    {auth.user.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{auth.user.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{auth.user.email}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    auth.user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {auth.user.role === 'admin' ? 'Administrator' : 'Pengguna Umum'}
                                </span>
                            </div>
                        </div>

                        {/* KOLOM KANAN: Form Edit */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* 1. UPDATE INFO */}
                            <div className="p-6 sm:p-8 bg-white shadow-sm sm:rounded-2xl border border-gray-100">
                                <section className="max-w-xl">
                                    <header>
                                        <h2 className="text-lg font-bold text-gray-900">Informasi Profil</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Perbarui nama profil dan alamat email akun Anda.
                                        </p>
                                    </header>
                                    <div className="mt-6">
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                            className="max-w-xl"
                                        />
                                    </div>
                                </section>
                            </div>

                            {/* 2. UPDATE PASSWORD */}
                            <div className="p-6 sm:p-8 bg-white shadow-sm sm:rounded-2xl border border-gray-100">
                                <section className="max-w-xl">
                                    <header>
                                        <h2 className="text-lg font-bold text-gray-900">Ganti Password</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Pastikan akun Anda aman dengan menggunakan password yang panjang dan acak.
                                        </p>
                                    </header>
                                    <div className="mt-6">
                                        <UpdatePasswordForm className="max-w-xl" />
                                    </div>
                                </section>
                            </div>

                            {/* 3. DELETE ACCOUNT (Hanya tampil jika bukan Admin untuk keamanan, atau biarkan saja) */}
                            <div className="p-6 sm:p-8 bg-white shadow-sm sm:rounded-2xl border border-red-100">
                                <section className="max-w-xl">
                                    <header>
                                        <h2 className="text-lg font-bold text-red-600">Hapus Akun</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Setelah akun dihapus, semua data laporan Anda akan hilang permanen.
                                        </p>
                                    </header>
                                    <div className="mt-6">
                                        <DeleteUserForm className="max-w-xl" />
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}