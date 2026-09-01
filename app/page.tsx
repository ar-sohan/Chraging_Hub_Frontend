import Link from "next/link";

export default function Home() {
  return (
    <div className="m-10">
      <div className="mt-16 flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl font-bold">CHARGEHUB</h1>
        <h2 className="text-2xl font-semibold">EV charging made simple.</h2>
        <p className="text-lg text-gray-600">Choose your portal to book a charging slot or manage the platform.</p>
        <div>
          <Link href="/user">
            <button className="p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold mr-5">User portal</button>
          </Link>
          <Link href="/admin">
            <button className="p-3 rounded-xl border-blue-700 border-2 hover:bg-blue-600 hover:text-white font-bold">Admin portal</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
