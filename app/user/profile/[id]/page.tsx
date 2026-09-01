import Header from "../../components/Header";
import Footer from "../../components/Footer";

type ProfileProps = { params: Promise<{ id: string }> };

export default async function Profile({ params }: ProfileProps) {
  const { id } = await params;
  return (
    <>
      <Header />
      <div className="m-10">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-lg text-gray-600 mt-3">User ID: {id}</p>
      </div>
      <Footer />
    </>
  );
}
