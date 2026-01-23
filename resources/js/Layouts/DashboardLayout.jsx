import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Menu Navigasi (Bisa ditambah nanti)
    const menus = [
        { 
            name: 'Dashboard', 
            route: 'dashboard', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            )
        },
        { 
            name: 'Buat Laporan', 
            route: 'report.create', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )
        },
        { 
            name: 'Pantau Peta', 
            route: 'public-map.index', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.98l-4.553-2.276M15 7l-5.447-2.724A1 1 0 019 3.382V14.118a1 1 0 01-.806.98L15 7m0 13V7"></path>
                </svg>
            )
        },
        
        
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            
            {/* === SIDEBAR (DESKTOP) === */}
            <aside className="bg-white w-64 shadow-xl z-30 hidden md:flex flex-col border-r border-gray-200">
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-gray-800 tracking-tighter hover:opacity-80 transition">
                        <svg className="w-8 h-8" fill="none" stroke="red" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span className="text-red-600">Disaster</span>Aid
                    </Link>
                </div>

                {/* Menu Area */}
                <div className="flex-1 overflow-y-auto py-6 px-3">
                    <nav className="space-y-1">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
                        {menus.map((menu, index) => (
                            <Link 
                                key={index} 
                                href={route(menu.route)} 
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    route().current(menu.route) 
                                    ? 'bg-red-50 text-red-600 shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {menu.icon}
                                {menu.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* User Profile Area (Bottom) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm border-2 border-white shadow-sm">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{auth.user.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{auth.user.role || 'User'}</p>
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="text-gray-400 hover:text-red-600 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* === KONTEN KANAN === */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* Mobile Header (Hanya muncul di HP) */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:hidden z-20">
                    <div className="font-bold text-lg text-red-600 flex items-center gap-2">
                        <span>🚨</span> DisasterAid
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </header>

                {/* Mobile Sidebar Overlay (Gelap-gelap background) */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                )}
                
                {/* Mobile Sidebar Content */}
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                   <div className="p-5 flex flex-col h-full">
                        <div className="mb-8 flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900">Menu</span>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            {menus.map((menu, index) => (
                                <Link key={index} href={route(menu.route)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
                                    {menu.icon}
                                    {menu.name}
                                </Link>
                            ))}
                        </nav>
                        <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 px-4 py-3 text-red-600 bg-red-50 rounded-lg mt-4 font-medium">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Keluar Aplikasi
                        </Link>
                   </div>
                </div>

                {/* AREA KONTEN UTAMA (Tempat Dashboard.jsx dirender) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}