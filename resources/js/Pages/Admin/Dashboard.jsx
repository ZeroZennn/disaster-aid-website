import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-red-600 leading-tight">Dashboard ADMIN PUSAT</h2>}
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-red-500">
                        <div className="p-6 text-gray-900">
                            Selamat Datang, Administrator!<br/>
                            Status: <span className="font-bold text-red-600">SUPER ADMIN</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}