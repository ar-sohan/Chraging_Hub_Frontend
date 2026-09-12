import Link from "next/link";
import LoginForm from "../components/LoginForm";
import AccountLayout from "../components/AccountLayout";
export default function Login() {
  return <AccountLayout title="Good to have you back." description="Your next journey starts with a simpler charging experience. Sign in to manage your account.">
    <h2 className="dui-card-title text-2xl">Login</h2>
    <p className="mb-3 text-sm text-base-content/60">Enter your account details below.</p>
    <LoginForm />
    <p className="mt-4 text-center text-sm text-base-content/65">New to Charger Hub? <Link href="/user/registration" className="font-semibold text-primary hover:underline">Create an account</Link></p>
  </AccountLayout>;
}
