import Link from "next/link";
import RegistrationForm from "../components/RegistrationForm";
import AccountLayout from "../components/AccountLayout";
export default function Registration() {
  return <AccountLayout title="A fresh start. A better charge." description="Create your driver account and make charging one less thing to think about.">
    <h2 className="dui-card-title text-2xl">Create an account</h2>
    <p className="mb-3 text-sm text-base-content/60">A few details and you are ready to go.</p>
    <RegistrationForm />
    <p className="mt-4 text-center text-sm text-base-content/65">Already have an account? <Link href="/user/login" className="font-semibold text-primary hover:underline">Login</Link></p>
  </AccountLayout>;
}
