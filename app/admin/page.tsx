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
                        <Link href="/admin/createAdmin"><button className='p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold'>Registration</button></Link>
                    </div>
                </div>
            </div>
            <div className="carousel w-full">
                <div id="slide1" className="carousel-item relative w-full">
                    <img
                        alt="Tailwind CSS slide example"
                        src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide4" className="btn btn-circle">❮</a>
                        <a href="#slide2" className="btn btn-circle">❯</a>
                    </div>
                </div>
                <div id="slide2" className="carousel-item relative w-full">
                    <img
                        alt="Tailwind CSS slide example"
                        src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide1" className="btn btn-circle">❮</a>
                        <a href="#slide3" className="btn btn-circle">❯</a>
                    </div>
                </div>
                <div id="slide3" className="carousel-item relative w-full">
                    <img
                        alt="Tailwind CSS slide example"
                        src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide2" className="btn btn-circle">❮</a>
                        <a href="#slide4" className="btn btn-circle">❯</a>
                    </div>
                </div>
                <div id="slide4" className="carousel-item relative w-full">
                    <img
                        alt="Tailwind CSS slide example"
                        src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide3" className="btn btn-circle">❮</a>
                        <a href="#slide1" className="btn btn-circle">❯</a>
                    </div>
                </div>
            </div>
        </>
    )
}