'use client';

import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageTitle from '../../../components/PageTitle';
import TechnicianAppLayout from '../../../components/TechnicianAppLayout';
import { getFaultById, getMyProfile, updateFaultStatus } from '../../../lib/api';
import { FaultReport } from '../../../lib/types';

export default function FaultReportDetailPage() {
  const params = useParams<{ id: string }>();
  const [fault, setFault] = useState<FaultReport | null>(null);
  const [myTechnicianId, setMyTechnicianId] = useState<number | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function loadFault() {
    try {
      const [faultData, myProfile] = await Promise.all([getFaultById(Number(params.id)), getMyProfile()]);
      setFault(faultData);
      setMyTechnicianId(myProfile.id);
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not load this fault report'));
    }
  }

  useEffect(() => { loadFault(); }, [params.id]);

  async function handleResolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fault) return;
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await updateFaultStatus(fault.id, 'Resolved', resolutionNote || undefined);
      setFault(updated);
      setMessage('Fault marked as resolved.');
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not update the fault status'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <PageTitle title="Fault report" description="Complete details of this fault report." />
        {error && <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {!fault && !error && <p className="text-slate-600">Loading...</p>}
        {fault && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-bold">{fault.faultType}</h2>
              <span className="text-sm font-semibold text-slate-500">{fault.status}</span>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Device / Station ID" value={fault.stationId} />
              <Info label="Location" value={fault.stationLocation || 'Not provided'} />
              <Info label="Severity" value={fault.severity} />
              <Info label="Report date" value={fault.reportDate} />
              <Info label="Reported by" value={fault.technician?.fullName || 'Unknown'} />
              <Info label="Reported at" value={new Date(fault.reportedAt).toLocaleString()} />
              <Info label="Resolved at" value={fault.resolvedAt ? new Date(fault.resolvedAt).toLocaleString() : 'Not resolved yet'} />
            </dl>
            <div className="mt-5">
              <h3 className="font-semibold text-slate-700">Problem description</h3>
              <p className="mt-1 text-slate-600">{fault.description}</p>
            </div>
            {fault.resolutionNote && (
              <div className="mt-5">
                <h3 className="font-semibold text-slate-700">Resolution note</h3>
                <p className="mt-1 text-slate-600">{fault.resolutionNote}</p>
              </div>
            )}
            {fault.status !== 'Resolved' && fault.technician?.id === myTechnicianId && (
              <form onSubmit={handleResolve} className="mt-6 border-t border-slate-200 pt-5">
                <label htmlFor="resolutionNote" className="mb-1 block text-sm font-semibold text-slate-700">Resolution note (optional)</label>
                <textarea
                  id="resolutionNote"
                  value={resolutionNote}
                  onChange={(event) => setResolutionNote(event.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
                  rows={3}
                />
                <button disabled={isSaving} type="submit" className="mt-3 rounded bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400">
                  {isSaving ? 'Saving...' : 'Mark as resolved'}
                </button>
              </form>
            )}
            {message && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">{message}</p>}
          </div>
        )}
      </section>
    </TechnicianAppLayout>
  );
}

function getMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error) ? error.response?.data?.message ?? fallback : fallback;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1 text-slate-900">{value}</dd></div>;
}
