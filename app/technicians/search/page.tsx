'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '../components/PageTitle';
import TechnicianAppLayout from '../components/TechnicianAppLayout';

export default function DeviceSearchPage() {
  const router = useRouter();
  const [stationId, setStationId] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = stationId.trim();
    if (!value) {
      setError('Enter a Device ID to search, for example DEV-202');
      return;
    }
    router.push(`/technicians/search/${encodeURIComponent(value)}`);
  }

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-2xl px-5 py-12">
        <PageTitle title="Search a device" description="Look up every fault, safety and maintenance report recorded for a device or station." />
        <form noValidate onSubmit={handleSubmit} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <input
            value={stationId}
            onChange={(event) => setStationId(event.target.value)}
            placeholder="Device ID, e.g. DEV-202"
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
          />
          <button type="submit" className="rounded bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800">Search</button>
        </form>
        {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>
    </TechnicianAppLayout>
  );
}
