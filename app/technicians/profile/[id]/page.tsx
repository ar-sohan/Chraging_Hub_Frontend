'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import StatusBadge from '../../components/StatusBadge';
import TechnicianLayout from '../../components/TechnicianLayout';
import { getTechnician } from '../../lib/api';
import { TechnicianProfile } from '../../lib/types';

export default function TechnicianProfilePage() {
  const params = useParams<{ id: string }>();
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setTechnician(await getTechnician(params.id));
      } catch (requestError) {
        if (axios.isAxiosError(requestError)) {
          setError(requestError.response?.data?.message ?? 'Could not load this technician profile');
        } else {
          setError('Could not load this technician profile');
        }
      }
    }
    loadProfile();
  }, [params.id]);

  return (
    <TechnicianLayout>
      <section className="mx-auto max-w-4xl px-5 py-12">
        <PageTitle title="Technician profile" description="Dynamic route: this page loads a profile using its ID from the URL." />
        {error && <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {!technician && !error && <p className="text-slate-600">Loading profile...</p>}
        {technician && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h2 className="text-2xl font-bold">{technician.fullName}</h2><p className="text-slate-600">{technician.primarySpecialisation}</p></div>
              <StatusBadge status={technician.approvalStatus} />
            </div>
            <dl className="mt-7 grid gap-5 sm:grid-cols-2">
              <Info label="Email" value={technician.email} /><Info label="Phone" value={technician.phone} />
              <Info label="Location" value={`${technician.location}, ${technician.country}`} /><Info label="Experience" value={`${technician.experience} year(s)`} />
              <Info label="Certification" value={technician.certification || 'Not provided'} /><Info label="Joined" value={new Date(technician.joiningDate).toLocaleDateString()} />
            </dl>
            <div className="mt-7"><h3 className="font-bold">Specialisations</h3><p className="mt-2 text-slate-600">{technician.specialisations.map((item) => item.name).join(', ') || technician.primarySpecialisation}</p></div>
            <Link href={`/technicians/profile/${technician.id}/maintenance`} className="mt-7 inline-block rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Manage maintenance tasks</Link>
          </div>
        )}
      </section>
    </TechnicianLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1 text-slate-900">{value}</dd></div>;
}
