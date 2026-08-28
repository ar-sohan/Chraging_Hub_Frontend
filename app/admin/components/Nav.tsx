import Link from "next/link";

export default function Nav() {
    return (
        <>
            <div>
                <Link href="/admin/dashboard"><button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl mr-2">Home </button></Link>

                <Link href="/admin/manage_user"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mr-2">Manage User </button></Link>

                <Link href="/admin/manage_payments"><button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-xl mr-2">Manage Payments</button></Link>

                <Link href="/admin/manage_technician"><button className="bg-pink-500 hover:bg-pink-700 text-white py-2 px-4 rounded-xl mr-2">Manage Technician</button></Link>

                <Link href="/admin/manage_garage"><button className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-xl mr-2">Manage Garage</button></Link>
            </div>
        </>
    )
}