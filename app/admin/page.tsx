import Link from 'next/link';

export default function AdminHome() {
    return (
        <>
            <div className='m-10'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold'>Charger Hub</h1>
                    <div>
                        <Link href="admin/login"><button className='font-bold border-2 border-blue-700 text-black hover:bg-blue-700 hover:text-white py-2 px-4 rounded-xl mr-2'>LogIn</button></Link>
                        <Link href="admin/registration"><button className='font-bold border-2 border-blue-700 text-black hover:bg-blue-700 hover:text-white py-2 px-4 rounded-xl mr-2'>Registration</button></Link>
                    </div>
                </div>
                <div className="mt-16 flex flex-col items-center justify-center gap-5">
                    <h1 className="text-3xl font-bold">Welcome to the Admin Panel</h1>
                    <p className="text-lg text-gray-600">Manage your application settings and user accounts.</p>
                    <div>
                        <Link href="admin/manage_user"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mr-2">Manage User </button></Link>
                        <Link href="admin/manage_payments"><button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-xl mr-2">Manage Payments</button></Link>
                        <Link href="admin/manage_technician"><button className="bg-pink-500 hover:bg-pink-700 text-white py-2 px-4 rounded-xl mr-2">Manage Technician</button></Link>
                        <Link href="admin/error"><button className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-xl mr-2">Manage Garage</button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}