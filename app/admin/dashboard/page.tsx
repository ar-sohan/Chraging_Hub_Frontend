import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Nav from "@/app/components/Nav";

export default function(){
    return(
        <>
            <Nav></Nav>
            <div className="m-5">
                <div className="my-10 flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold">Welcome Name to the Dashboard</h1>
                </div>
            </div>

            <Footer></Footer> 
        </>
    )
}