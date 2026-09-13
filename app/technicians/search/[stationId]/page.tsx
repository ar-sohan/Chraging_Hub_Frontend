'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import TechnicianAppLayout from '../../components/TechnicianAppLayout';
import { searchByStation } from '../../lib/api';
import { StationSearchResult } from '../../lib/types';

export default function DeviceSearchResultsPage() {
  const params = useParams<{ stationId: string }>();
  const stationId = decodeURIComponent(params.stationId);
  const [result, setResult] = useState<StationSearchResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadResults() {
      try {
        setResult(await searchByStation(stationId));
      } catch (requestError) {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message ?? 'Could not search this device' : 'Could not search this device');
      }
    }
    loadResults();
  }, [stationId]);

  const totalResults = result ? result.faultReports.length + result.safetyChecks.length + result.maintenanceTasks.length : 0;

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-5xl px-5 py-12">
        <PageTitle title={`Device: ${stationId}`} description="All activities and reports recorded for this device." />
        {error && <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {!result && !error && <p className="text-slate-600">Searching...</p>}
        {result && totalResults === 0 && <p className="text-slate-600">No activities found for device {stationId}.</p>}

        {result && result.faultReports.length > 0 && (
          <ResultSection title="Fault Reports">
            {result.faultReports.map((item) => (
              <Link key={item.id} href={`/technicians/reports/fault/${item.id}`} className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-blue-600">
                <div className="flex justify-between gap-2"><h3 className="font-bold">{item.faultType}</h3><span className="text-sm text-slate-500">{item.status}</span></div>
                <p className="mt-2 text-sm text-slate-600">Problem: {item.description}</p>
                <p className="mt-2 text-sm text-slate-500">Date: {item.reportDate} &bull; Reported by: {item.technician?.fullName || 'Unknown'}</p>
              </Link>
            ))}
          </ResultSection>
        )}

        {result && result.safetyChecks.length > 0 && (
          <ResultSection title="Safety Reports">
            {result.safetyChecks.map((item) => (
              <Link key={item.id} href={`/technicians/reports/safety/${item.id}`} className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-blue-600">
                <div className="flex justify-between gap-2"><h3 className="font-bold">{item.checkType}</h3><span className="text-sm text-slate-500">{item.result}</span></div>
                <p className="mt-2 text-sm text-slate-500">Date: {item.reportDate} &bull; Performed by: {item.technician?.fullName || 'Unknown'}</p>
              </Link>
            ))}
          </ResultSection>
        )}

        {result && result.maintenanceTasks.length > 0 && (
          <ResultSection title="Maintenance Reports">
            {result.maintenanceTasks.map((item) => (
              <Link key={item.id} href={`/technicians/reports/maintenance/${item.id}`} className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-blue-600">
                <div className="flex justify-between gap-2"><h3 className="font-bold">{item.category} Maintenance</h3><span className="text-sm text-slate-500">{item.status}</span></div>
                <p className="mt-2 text-sm text-slate-600">Issue: {item.issue}</p>
                <p className="mt-2 text-sm text-slate-500">Date: {item.maintenanceDate} &bull; Performed by: {item.technician?.fullName || 'Unknown'}</p>
              </Link>
            ))}
          </ResultSection>
        )}
      </section>
    </TechnicianAppLayout>
  );
}

function ResultSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}
