import Header from "../components/Header";

export default function profile() {
    return (
        <>
            <div className="m-5">
                <Header></Header>
                <div className="flex flex-col justify-center items-center my-10">
                    <h1 className="text-2xl font-semibold">Welcome to your profile!</h1>
                </div>
            </div>
        </>
    )
}