import Link from 'next/link';
import Header from './components/Header';

export default function AdminHome() {
    return (
        <>
            <div className='m-10'>
                <div className="mt-16 flex flex-col items-center justify-center gap-5">
                    <h1 className="text-3xl font-bold">Welcome to the Admin Panel</h1>
                    <p className="text-lg text-gray-600">Manage your application settings and user accounts.</p>
                    <div>
                        <Link href="/admin/login"><button className='p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold mr-5'>Login</button></Link>
                        <Link href="/admin/registration"><button className='p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold'>Registration</button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}