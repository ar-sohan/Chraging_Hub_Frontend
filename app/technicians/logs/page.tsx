'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import TechnicianAppLayout from '../components/TechnicianAppLayout';
import { getMyProfile } from '../lib/api';
import { TechnicianProfile } from '../lib/types';

type ActivityItem = {
  key: string;
  label: string;
  href: string;
  stationId: string;
  status: string;
  description: string;
  date: string;
};

function buildActivity(technician: TechnicianProfile): ActivityItem[] {
  const faults: ActivityItem[] = technician.faultReports.map((item) => ({
    key: `fault-${item.id}`,
    label: 'Fault Report',
    href: `/technicians/reports/fault/${item.id}`,
    stationId: item.stationId,
    status: item.status,
    description: item.description,
    date: item.reportDate,
  }));
  const safetyChecks: ActivityItem[] = technician.safetyChecks.map((item) => ({
    key: `safety-${item.id}`,
    label: 'Safety Report',
    href: `/technicians/reports/safety/${item.id}`,
    stationId: item.stationId,
    status: item.result,
    description: item.checkType,
    date: item.reportDate,
  }));
  // Category distinguishes a plain Maintenance report from a Hardware Maintenance report.
  const maintenanceTasks: ActivityItem[] = technician.maintenanceTasks.map((item) => ({
    key: `maintenance-${item.id}`,
    label: item.category === 'Hardware' ? 'Hardware Maintenance Report' : 'Maintenance Report',
    href: `/technicians/reports/maintenance/${item.id}`,
    stationId: item.stationId,
    status: item.status,
    description: item.issue,
    date: item.maintenanceDate,
  }));

  return [...faults, ...safetyChecks, ...maintenanceTasks].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function TechnicianActivityLogPage() {
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadActivity() {
      try {
        setActivity(buildActivity(await getMyProfile()));
      } catch (requestError) {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message ?? 'Could not load your activity log' : 'Could not load your activity log');
      }
    }
    loadActivity();
  }, []);

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-5xl px-5 py-12">
        <PageTitle title="My activity" description="Every fault, safety and maintenance report you have submitted." />
        {error && <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {!activity && !error && <p className="text-slate-600">Loading activity...</p>}
        {activity && activity.length === 0 && <p className="text-slate-600">No activities found.</p>}
        {activity && activity.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {activity.map((item) => (
              <Link key={item.key} href={item.href} className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-blue-600">
                <div className="flex justify-between gap-2">
                  <h3 className="font-bold">{item.label}</h3>
                  <span className="text-sm text-slate-500">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Station: {item.stationId}</p>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-sm text-slate-500">Date: {item.date}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </TechnicianAppLayout>
  );
}
