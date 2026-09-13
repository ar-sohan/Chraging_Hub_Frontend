'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageTitle from '../../../components/PageTitle';
import TechnicianAppLayout from '../../../components/TechnicianAppLayout';
import { getSafetyCheckById } from '../../../lib/api';
import { SafetyCheck } from '../../../lib/types';

export default function SafetyCheckDetailPage() {
  const params = useParams<{ id: string }>();
  const [check, setCheck] = useState<SafetyCheck | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCheck() {
      try {
        setCheck(await getSafetyCheckById(Number(params.id)));
      } catch (requestError) {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message ?? 'Could not load this safety report' : 'Could not load this safety report');
      }
    }
    loadCheck();
  }, [params.id]);

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <PageTitle title="Safety report" description="Complete details of this safety inspection." />
        {error && <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {!check && !error && <p className="text-slate-600">Loading...</p>}
        {check && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-bold">{check.checkType}</h2>
              <span className="text-sm font-semibold text-slate-500">{check.result}</span>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Device / Station ID" value={check.stationId} />
              <Info label="Location" value={check.stationLocation || 'Not provided'} />
              <Info label="Report date" value={check.reportDate} />
              <Info label="Performed by" value={check.technician?.fullName || 'Unknown'} />
              <Info label="Checked at" value={new Date(check.checkedAt).toLocaleString()} />
            </dl>
            <div className="mt-5">
              <h3 className="font-semibold text-slate-700">Remarks</h3>
              <p className="mt-1 text-slate-600">{check.remarks}</p>
            </div>
          </div>
        )}
      </section>
    </TechnicianAppLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1 text-slate-900">{value}</dd></div>;
}
