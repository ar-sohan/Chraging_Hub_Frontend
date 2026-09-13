'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutTechnician } from '../lib/api';

type TechnicianAppLayoutProps = {
  children: ReactNode;
};

// Guards every authenticated technician page: redirects to login when there is no token,
// and provides the shared top navigation (Profile, Search, Log/Activity, Logout).
export default function TechnicianAppLayout({ children }: TechnicianAppLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('technicianToken');
    if (!token) {
      router.replace('/technicians/login');
      return;
    }
    setIsChecking(false);
  }, [router]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stationId = searchValue.trim();
    if (!stationId) return;
    router.push(`/technicians/search/${encodeURIComponent(stationId)}`);
  }

  function handleLogout() {
    logoutTechnician();
    router.push('/technicians/login');
  }

  if (isChecking) {
    return <p className="p-8 text-center text-slate-600">Checking your session...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/technicians/dashboard" className="text-xl font-bold text-blue-700">
            ChargeHub Technician
          </Link>
          <form onSubmit={handleSearchSubmit} className="order-3 flex w-full gap-2 sm:order-none sm:w-auto">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search Device ID (e.g. DEV-202)"
              aria-label="Search device ID"
              className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600 sm:w-56"
            />
            <button type="submit" className="rounded bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900">
              Search
            </button>
          </form>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/technicians/profile" className="hover:text-blue-700">Profile</Link>
            <Link href="/technicians/logs" className="hover:text-blue-700">Log/Activity</Link>
            <button onClick={handleLogout} className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700">
              Logout
            </button>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
