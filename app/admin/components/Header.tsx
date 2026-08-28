import Link from 'next/link'
import Nav from './Nav'

export default function Header() {
    return (
        <>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Charger Hub</h1>
                <Nav></Nav>
                <div>
                    <Link href="/admin/profile"><button className='font-bold border-2 border-blue-700 text-black hover:bg-blue-700 hover:text-white py-2 px-4 rounded-xl mr-2'>Profile</button></Link>
                </div>
            </div>
        </>
    )
}