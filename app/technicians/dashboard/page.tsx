'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import TechnicianAppLayout from '../components/TechnicianAppLayout';
import { getMyProfile } from '../lib/api';
import { TechnicianProfile } from '../lib/types';

export default function TechnicianDashboardPage() {
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setTechnician(await getMyProfile());
      } catch (requestError) {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message ?? 'Could not load your profile' : 'Could not load your profile');
      }
    }
    loadProfile();
  }, []);

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <PageTitle
          title={technician ? `Welcome, ${technician.fullName}` : 'Technician dashboard'}
          description="Claim work, run checks, and keep your maintenance records up to date."
        />
        {error && <p className="mb-6 rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {technician && technician.approvalStatus !== 'Approved' && (
          <p className="mb-6 rounded bg-amber-50 p-4 text-amber-800">
            Your profile is {technician.approvalStatus.toLowerCase()}. You can browse the dashboard, but submitting new work records requires admin approval.
          </p>
        )}
        <div className="grid gap-5 md:grid-cols-3">
          <DashboardCard
            title="Report / Claim Fault"
            description="Log a fault found on a charging station or device."
            href="/technicians/faults"
          />
          <DashboardCard
            title="Perform Safety Check"
            description="Record the outcome of a safety inspection."
            href="/technicians/safety-check"
          />
          <DashboardCard
            title="Perform Maintenance"
            description="Log charging or hardware maintenance work."
            href={technician ? `/technicians/profile/${technician.id}/maintenance` : '/technicians/dashboard'}
          />
        </div>
      </section>
    </TechnicianAppLayout>
  );
}

function DashboardCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-600 hover:shadow-md">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Link>
  );
}
