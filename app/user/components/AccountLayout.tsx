import Footer from "./Footer";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountLayout({ children, title, description }: {
  children: ReactNode; title: string; description: string;
}) {
  return <div data-theme="light" className="ev-green account-screen min-h-screen bg-base-200">
    <header className="border-b border-base-300 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link className="text-xl font-bold tracking-tight" href="/">Charger Hub<span className="ml-1 text-primary">.</span></Link>
        <Link className="text-sm text-primary hover:underline" href="/user/login">Sign in ↗</Link>
      </div>
    </header>
    <main className="account-stack">
      <div className="account-intro">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary">CHARGING MADE SIMPLE</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-base-content/65">{description}</p>

      </div>
      <div className="dui-card account-form-card border border-base-300 bg-white">
        <div className="dui-card-body p-6 sm:p-8">{children}</div>
      </div>
    </main>
    <Footer />
  </div>;
}



