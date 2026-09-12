import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountLayout({ children, title, description }: {
  children: ReactNode; title: string; description: string;
}) {
  return <div data-theme="light" className="ev-green min-h-screen bg-base-200">
    <header className="border-b border-base-300 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link className="text-xl font-bold tracking-tight" href="/">Charger Hub<span className="ml-1 text-primary">.</span></Link>
        <Link className="text-sm text-primary hover:underline" href="/user">User portal ↗</Link>
      </div>
    </header>
    <main className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-16">
      <div className="max-w-lg">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary">CHARGING MADE SIMPLE</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-base-content/65">{description}</p>
        <div className="mt-8 hidden rounded-3xl bg-[#deecdb] p-7 lg:block">
          <p className="text-lg font-semibold text-[#174530]">Less waiting. More living.</p>
          <p className="mt-2 text-sm leading-6 text-[#52705e]">Manage your profile, find your slot and keep every booking in one place.</p>
        </div>
      </div>
      <div className="dui-card w-full max-w-lg justify-self-center border border-base-300 bg-white shadow-sm">
        <div className="dui-card-body p-6 sm:p-8">{children}</div>
      </div>
    </main>
  </div>;
}
