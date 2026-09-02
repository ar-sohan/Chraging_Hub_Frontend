import Footer from "../../components/Footer";
import Header from "../../components/Header";

type Props = {
    params: Promise<{
        id: string;
        name: string;
        status: string;
    }>;
};

export default async function GarageDetails({ params }: Props) {
    const { id, name, status } = await params;

    return (
        <>
            <div className="m-5">
                <Header></Header>
            </div>

            <div>
                <h1>User Details</h1>

                <p>User ID: {id}</p>
                <p>User Name: {name}</p>
                <p>Status: {status}</p>
            </div>

            <div>
                <Footer></Footer>
            </div>
        </>
    );
}