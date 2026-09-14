import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ShowProduct from "./admin/showServices/page";
import ShowStations from "./admin/showStations/page";
import LandingLogin from "./components/LandingLogin";

export default function Home() {
  return (
    <>
      {/* navbar */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><a href="../admin/dashboard">Dashboard</a></li>
              <li>
                <a>User Management</a>
                <ul className="p-2">
                  <li><a href="../admin/manage_payments">Payments</a></li>
                  <li><a href="../admin/manage_bookings">Bookings</a></li>
                  <li><a href="../admin/manage_user">Users</a></li>
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
            <li><a href="../admin/dashboard">Dashboard</a></li>
            <li>
              <details>
                <summary>User Management</summary>
                <ul className="p-2 bg-base-100 w-40 z-1">
                  <li><a href="../admin/manage_payments">Payments</a></li>
                  <li><a href="../admin/manage_bookings">Bookings</a></li>
                  <li><a href="../admin/manage_user">Users</a></li>
                </ul>
              </details>
            </li>
            <li><a href="../admin/manage_technician">Technician</a></li>
            <li><a href="../admin/manage_garage">Garage</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <a href="/admin/login" className="btn btn-sm bg-blue-500 text-white">
            Login
          </a>
        </div>
      </div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <img
            alt="EV charging station"
            src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">Charge smarter, drive further.</h1>
            <p className="py-6">
              ChargeHub EV connects drivers to nearby charging stations in real time,
              helps garage owners manage their stations, and gives technicians a
              simple way to handle service requests — all in one platform.
            </p>
            <a href="#stations" className="btn btn-primary">Find a Station</a>
          </div>
        </div>
      </div>

      <div id="services" className="py-10">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <ShowProduct></ShowProduct>
      </div>

      <div id="stations" className="py-10 bg-base-200">
        <h2 className="text-3xl font-bold text-center mb-8">Charging Stations Near You</h2>
        <ShowStations></ShowStations>
      </div>

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Already a member?</h1>
            <p className="py-6">
              Log in to manage your bookings, track your charging history, or
              access your garage and technician dashboard.
            </p>
          </div>
          <LandingLogin></LandingLogin>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}