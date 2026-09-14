'use client';

import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTitle from '../../../components/PageTitle';
import TechnicianAppLayout from '../../../components/TechnicianAppLayout';
import { deleteMaintenanceTask, getMaintenanceById, getMyProfile, updateMaintenanceTask } from '../../../lib/api';
import { MaintenanceTask } from '../../../lib/types';

export default function MaintenanceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<MaintenanceTask | null>(null);
  const [myTechnicianId, setMyTechnicianId] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function loadTask() {
    try {
      const [data, myProfile] = await Promise.all([getMaintenanceById(Number(params.id)), getMyProfile()]);
      setTask(data);
      setStatus(data.status);
      setNotes(data.notes ?? '');
      setMyTechnicianId(myProfile.id);
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not load this maintenance record'));
    }
  }

  useEffect(() => { loadTask(); }, [params.id]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!task) return;
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await updateMaintenanceTask(task.id, status, notes || undefined);
      setTask(updated);
      setMessage('Maintenance record updated successfully.');
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not update this maintenance record'));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!task) return;
    setIsSaving(true);
    setError('');
    try {
      await deleteMaintenanceTask(task.id);
      router.push('/technicians/logs');
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not delete this maintenance record'));
      setIsSaving(false);
    }
  }

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <PageTitle title="Maintenance report" description="Complete details of this maintenance record." />
        {error && <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {!task && !error && <p className="text-slate-600">Loading...</p>}
        {task && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-bold">{task.category} Maintenance</h2>
              <span className="text-sm font-semibold text-slate-500">{task.status}</span>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Device / Station ID" value={task.stationId} />
              <Info label="Location" value={task.stationLocation || 'Not provided'} />
              <Info label="Device ID" value={task.deviceId || 'Not provided'} />
              <Info label="Device type" value={task.deviceType || 'Not provided'} />
              <Info label="Maintenance date" value={task.maintenanceDate} />
              <Info label="Performed by" value={task.technician?.fullName || 'Unknown'} />
              <Info label="Created at" value={new Date(task.createdAt).toLocaleString()} />
            </dl>
            <div className="mt-5">
              <h3 className="font-semibold text-slate-700">Issue</h3>
              <p className="mt-1 text-slate-600">{task.issue}</p>
            </div>
            {task.action && (
              <div className="mt-5">
                <h3 className="font-semibold text-slate-700">Action taken</h3>
                <p className="mt-1 text-slate-600">{task.action}</p>
              </div>
            )}

            {task.technician?.id === myTechnicianId && (
              <form onSubmit={handleUpdate} className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="status" className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                  <select id="status" value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600">
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="notes" className="mb-1 block text-sm font-semibold text-slate-700">Notes</label>
                  <input id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
                </div>
                <div className="flex gap-3 sm:col-span-2">
                  <button disabled={isSaving} type="submit" className="rounded bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400">
                    {isSaving ? 'Saving...' : 'Update record'}
                  </button>
                  <button type="button" disabled={isSaving} onClick={handleDelete} className="rounded border border-red-300 bg-white px-5 py-2 font-semibold text-red-700 hover:bg-red-50">
                    Delete record
                  </button>
                </div>
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
