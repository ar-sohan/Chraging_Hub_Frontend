import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ShowProduct from "./admin/showServices/page";
import ShowStations from "./admin/showStations/page";
import LandingLogin from "./components/LandingLogin";

export default function Home() {
  return (
    <>
      <Nav></Nav>

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
