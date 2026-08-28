import Header from "../components/Header";
import Footer from "../components/Footer";

export default function(){
    return(
        <>
            <div className="m-5">
                <Header></Header>
            </div>

            <div className="m-5">
                <div className="my-10 flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold">Welcome Name to the Dashboard</h1>
                </div>
            </div>

            <div >
                <Footer></Footer>
            </div>
        </>
    )
}