'use client';

import axios from 'axios';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageTitle from '../../../components/PageTitle';
import TechnicianLayout from '../../../components/TechnicianLayout';
import { createMaintenanceTask, getMaintenanceTasks } from '../../../lib/api';
import { maintenanceSchema } from '../../../lib/schemas';
import { MaintenanceTask } from '../../../lib/types';

const initialForm = { category: 'Charging', stationId: '', deviceId: '', deviceType: '', issue: '', action: '', notes: '', maintenanceDate: '' };

export default function MaintenancePage() {
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState(initialForm);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadTasks() {
    try {
      setTasks(await getMaintenanceTasks(params.id));
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not load maintenance tasks'));
    }
  }

  useEffect(() => { loadTasks(); }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = maintenanceSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please check your input');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await createMaintenanceTask(params.id, result.data);
      setForm(initialForm);
      await loadTasks();
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not create maintenance task'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TechnicianLayout>
      <section className="mx-auto max-w-5xl px-5 py-12">
        <PageTitle title="Maintenance tasks" description="Create and view charging or hardware maintenance records for this technician." />
        <Link href={`/technicians/profile/${params.id}`} className="mb-6 inline-block text-sm font-semibold text-blue-700 hover:underline">Back to profile</Link>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <SelectField label="Category" name="category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
          <TextField label="Station ID" name="stationId" value={form.stationId} onChange={(value) => setForm({ ...form, stationId: value })} />
          <TextField label="Device ID (optional)" name="deviceId" value={form.deviceId} onChange={(value) => setForm({ ...form, deviceId: value })} />
          <TextField label="Device type (optional)" name="deviceType" value={form.deviceType} onChange={(value) => setForm({ ...form, deviceType: value })} />
          <TextField label="Issue" name="issue" value={form.issue} onChange={(value) => setForm({ ...form, issue: value })} />
          <TextField label="Maintenance date" name="maintenanceDate" value={form.maintenanceDate} onChange={(value) => setForm({ ...form, maintenanceDate: value })} placeholder="YYYY-MM-DD" />
          <TextField label="Action (optional)" name="action" value={form.action} onChange={(value) => setForm({ ...form, action: value })} />
          <TextField label="Notes (optional)" name="notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} />
          {error && <p className="md:col-span-2 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={isSubmitting} type="submit" className="md:col-span-2 rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400">{isSubmitting ? 'Saving...' : 'Save maintenance task'}</button>
        </form>
        <div className="mt-10"><h2 className="text-xl font-bold">Saved tasks</h2>
          {tasks.length === 0 ? <p className="mt-3 text-slate-600">No maintenance task has been recorded yet.</p> : <div className="mt-4 grid gap-4 md:grid-cols-2">{tasks.map((task) => <article key={task.id} className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex justify-between gap-2"><h3 className="font-bold">{task.stationId}</h3><span className="text-sm text-slate-500">{task.status}</span></div><p className="mt-2 text-sm text-slate-600">{task.category} - {task.issue}</p><p className="mt-2 text-sm text-slate-500">Date: {task.maintenanceDate}</p></article>)}</div>}
        </div>
      </section>
    </TechnicianLayout>
  );
}

function getMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error) ? error.response?.data?.message ?? fallback : fallback;
}

function TextField({ label, name, value, placeholder, onChange }: { label: string; name: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <div><label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label><input id={name} name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" /></div>;
}

function SelectField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (value: 'Charging' | 'Hardware') => void }) {
  return <div><label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label><select id={name} name={name} value={value} onChange={(event) => onChange(event.target.value as 'Charging' | 'Hardware')} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"><option value="Charging">Charging</option><option value="Hardware">Hardware</option></select></div>;
}
