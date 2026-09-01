import Link from 'next/link';

export default function UserHome() {
    return (
        <>
            <div className='m-10'>
                <div className="mt-16 flex flex-col items-center justify-center gap-5">
                    <h1 className="text-3xl font-bold">Welcome to the User Panel</h1>
                    <p className="text-lg text-gray-600">Book your charging slot and manage your account.</p>
                    <div>
                        <Link href="/user/login"><button className='p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold mr-5'>Login</button></Link>
                        <Link href="/user/registration"><button className='p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold'>Registration</button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}
