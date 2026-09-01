import Link from "next/link";
import RegistrationForm from "../components/RegistrationForm";

export default function Registration() {
  return (
    <>
      <div className="flex flex-col m-10 justify-center items-center">
        <h1 className="text-3xl font-bold">Registration</h1>
        <div className="border-2 border-indigo-300 m-4 p-6 rounded-xl">
          <RegistrationForm />

          <div className="my-2 flex justify-center">
            <p>Already Have an Account! <Link href="/user/login" className="text-indigo-700 font-semibold">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
