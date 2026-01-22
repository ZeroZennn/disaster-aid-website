import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navbar Fixed */}
            <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-2xl font-bold text-red-600 tracking-tighter hover:opacity-80 transition">
                            DisasterAid
                        </Link>
                    </div>

                    {/* Navigasi Kanan */}
                    <div className="relative">
                        {auth.user ? (
                            // KONDISI 1: SUDAH LOGIN (Tampilkan Profil & Dropdown)
                            <div>
                                <button 
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="hidden md:inline">{auth.user.name}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                        {/* Cek Role untuk arah dashboard */}
                                        <Link 
                                            href={auth.user.role === 'admin' ? route('admin.dashboard') : route('dashboard')} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link 
                                            href={route('profile.edit')} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profil Saya
                                        </Link>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Keluar
                                        </Link>
                                    </div>
                                )}
                                
                                {/* Overlay klik di luar untuk tutup dropdown */}
                                {isDropdownOpen && (
                                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                                )}
                            </div>
                        ) : (
                            // KONDISI 2: BELUM LOGIN (Tombol Masuk)
                            <div className="space-x-4">
                                <Link 
                                    href={route('login')} 
                                    className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Content Halaman */}
            <main className="pt-20">
                {children}
            </main>
        </div>
    );
}