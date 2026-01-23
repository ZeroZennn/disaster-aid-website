import { useState, useEffect } from 'react';

export default function CustomAlert({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = 'info', // info, success, warning, danger
    inputType = null, // null, 'text', 'textarea'
    inputPlaceholder = '',
    confirmText = 'Ya, Lanjutkan',
    processing = false
}) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    // Reset input saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setInputValue('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Konfigurasi Warna & Icon Berdasarkan Tipe
    const config = {
        success: { color: 'text-green-600', bg: 'bg-green-100', btn: 'bg-green-600 hover:bg-green-700', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /> },
        danger: { color: 'text-red-600', bg: 'bg-red-100', btn: 'bg-red-600 hover:bg-red-700', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
        warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', btn: 'bg-yellow-600 hover:bg-yellow-700', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        info: { color: 'text-blue-600', bg: 'bg-blue-100', btn: 'bg-blue-600 hover:bg-blue-700', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    };

    const currentConfig = config[type] || config.info;

    const handleConfirm = () => {
        // Validasi jika input wajib (misal untuk tipe danger/tolak)
        if (inputType && type === 'danger' && !inputValue.trim()) {
            setError('Kolom ini wajib diisi!');
            return;
        }
        onConfirm(inputValue); // Kirim nilai input ke parent
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 overflow-hidden">
                
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        {/* ICON BULAT */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${currentConfig.bg} ${currentConfig.color}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {currentConfig.icon}
                            </svg>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 mt-2">{message}</p>

                            {/* INPUT FIELD (KONDISIONAL) */}
                            {inputType && (
                                <div className="mt-4">
                                    {inputType === 'textarea' ? (
                                        <textarea
                                            className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm"
                                            rows="3"
                                            placeholder={inputPlaceholder}
                                            value={inputValue}
                                            onChange={(e) => {
                                                setInputValue(e.target.value);
                                                setError('');
                                            }}
                                        ></textarea>
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm"
                                            placeholder={inputPlaceholder}
                                            value={inputValue}
                                            onChange={(e) => {
                                                setInputValue(e.target.value);
                                                setError('');
                                            }}
                                        />
                                    )}
                                    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER BUTTONS */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={processing}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-bold shadow-md transition flex items-center gap-2 ${currentConfig.btn} ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}