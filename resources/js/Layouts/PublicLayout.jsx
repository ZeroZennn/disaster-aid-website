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
                    
                    {/* --- BAGIAN KIRI: LOGO --- */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-2xl font-bold text-red-600 tracking-tighter hover:opacity-80 transition flex items-center gap-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Disaster <span className='text-gray-700 '>Aid</span> 
                        </Link>
                    </div>

                    {/* --- BAGIAN KANAN: MENU PETA + AUTH --- */}
                    <div className="flex items-center gap-3 md:gap-6">
                        
                        {/* 1. MENU PANTAU PETA */}
                        <Link 
                            href={route('public-map.index')} 
                            className={`flex items-center gap-2 text-sm font-medium transition ${
                                route().current('public-map.*') 
                                ? 'text-red-600 font-bold' 
                                : 'text-gray-500 hover:text-red-600'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.98l-4.553-2.276M15 7l-5.447-2.724A1 1 0 019 3.382V14.118a1 1 0 01-.806.98L15 7m0 13V7"></path>
                            </svg>
                            <span className="hidden md:inline">Pantau Peta</span>
                        </Link>

                        {/* Pemisah Vertikal */}
                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {/* 2. LOGIC AUTHENTICATION */}
                        {auth.user ? (
                            // KONDISI: SUDAH LOGIN
                            <div className="relative">
                                <button 
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium focus:outline-none"
                                >
                                    <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold border border-red-200">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="hidden md:inline text-sm">{auth.user.name}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Akun Anda</p>
                                                <p className="font-bold text-gray-800 truncate text-sm mt-1">{auth.user.email}</p>
                                            </div>
                                            
                                            <div className="py-1">
                                                <Link 
                                                    href={auth.user.role === 'admin' ? route('admin.dashboard') : route('dashboard')} 
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                                    Dashboard
                                                </Link>
                                                <Link 
                                                    href={route('profile.edit')} 
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    Pengaturan Akun
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 my-1"></div>
                                            
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button" 
                                                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                                Keluar
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            // KONDISI: BELUM LOGIN (Hanya Tombol Masuk)
                            <div className="flex items-center gap-2">
                                <Link 
                                    href={route('login')} 
                                    className="bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 hover:shadow-xl transition transform hover:-translate-y-0.5"
                                >
                                    Masuk Aplikasi
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