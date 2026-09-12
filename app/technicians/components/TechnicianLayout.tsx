import Link from 'next/link';
import { ReactNode } from 'react';

type TechnicianLayoutProps = {
  children: ReactNode;
};

export default function TechnicianLayout({ children }: TechnicianLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/technicians" className="text-xl font-bold text-blue-700">
            ChargeHub Technician
          </Link>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/technicians" className="hover:text-blue-700">Home</Link>
            <Link href="/technicians/login" className="hover:text-blue-700">Login</Link>
            <Link href="/technicians/register" className="rounded bg-blue-700 px-3 py-1.5 text-white hover:bg-blue-800">
              Register
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
