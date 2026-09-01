import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="m-10">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-lg text-gray-600 mt-3">Welcome to your Charger Hub account.</p>
      </div>
      <Footer />
    </>
  );
}
