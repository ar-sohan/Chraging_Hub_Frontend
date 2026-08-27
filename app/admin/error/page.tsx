export default function Error(){
    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="font-bold text-lg">
                    <span className="text-4xl text-yellow-500 pr-3">404</span> not found!
                </h1><br />
                <p className="text-3xl font-medium">This page will be available soon</p>
            </div>
        </>
    )
}