import Link from "next/link";

export default function Nav() {
    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><a href="/admin/dashboard">Dashboard</a></li>
                            <li>
                                <a>User Management</a>
                                <ul className="p-2">
                                    <li><a href="/admin/manage_payments">Payments</a></li>
                                    <li><a href="/admin/manage_bookings">Bookings</a></li>
                                    <li><a href="/admin/manage_users">Users</a></li>
                                </ul>
                            </li>
                            <li><a>Technician</a></li>
                            <li><a>Garage</a></li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">Charging Hub</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a href="/admin/dashboard">Dashboard</a></li>
                        <li>
                            <details>
                                <summary>User Management</summary>
                                <ul className="p-2 bg-base-100 w-40 z-1">
                                    <li><a href="/admin/manage_payments">Payments</a></li>
                                    <li><a href="/admin/manage_bookings">Bookings</a></li>
                                    <li><a href="/admin/manage_users">Users</a></li>
                                </ul>
                            </details>
                        </li>
                        <li><a href="/admin/manage_technician">Technician</a></li>
                        <li><a href="/admin/manage_garage">Garage</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <a className="btn">Button</a>
                </div>
            </div>
        </>
    )
}