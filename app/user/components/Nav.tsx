import Link from "next/link";

export default function Nav() {
  return (
    <div>
      <Link href="/user/dashboard">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl mr-2">Home</button>
      </Link>

      <Link href="/user/login">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mr-2">Login</button>
      </Link>

      <Link href="/user/registration">
        <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-xl mr-2">Registration</button>
      </Link>
    </div>
  );
}
