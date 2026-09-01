import Link from "next/link";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <>
      <div className="flex flex-col m-10 justify-center items-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <div className="my-8">
          <LoginForm />

          <div className="flex justify-center mt-3">
            <p>Don&apos;t Have an Account! <Link href="/user/registration" className="text-indigo-700 font-semibold">Register</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
