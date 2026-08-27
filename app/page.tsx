import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl text-center font-bold">Home</h1>
      <div className="flex flex-col items-center justify-center mt-8 gap-5" >
        <h1 className="text-2xl font-semibold">latest News</h1>
        <p className="text-center max-w-2xl mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        </p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Learn More
        </button>
      </div>
    </>
  );
}
