'use client';

import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import TechnicianAppLayout from '../components/TechnicianAppLayout';
import { createSafetyCheck, getMyProfile } from '../lib/api';
import { safetyCheckSchema } from '../lib/schemas';

const initialForm = { stationId: '', stationLocation: '', checkType: '', result: 'Passed', remarks: '', reportDate: '' };

export default function SafetyCheckPage() {
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadTechnicianId() {
      try {
        const technician = await getMyProfile();
        setTechnicianId(technician.id);
      } catch (requestError) {
        setError(getMessage(requestError, 'Could not load your technician profile'));
      }
    }
    loadTechnicianId();
  }, []);

  function updateField(name: keyof typeof initialForm, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!technicianId) return;

    const result = safetyCheckSchema.safeParse(form);
    if (!result.success) {
      setMessage('');
      setError(result.error.issues[0]?.message ?? 'Please check your input');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');
    try {
      await createSafetyCheck(technicianId, result.data);
      setMessage('Safety check submitted successfully.');
      setForm(initialForm);
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not submit the safety check'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <PageTitle title="Perform a safety check" description="Record the outcome of a safety inspection for a device or station." />
        <form noValidate onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <TextField label="Device / Station ID" name="stationId" value={form.stationId} onChange={updateField} placeholder="ST-005" />
          <TextField label="Device / Station location" name="stationLocation" value={form.stationLocation} onChange={updateField} placeholder="Banani, Dhaka" />
          <TextField label="Check type" name="checkType" value={form.checkType} onChange={updateField} placeholder="Electrical safety inspection" />
          <SelectField label="Result" name="result" value={form.result} onChange={updateField} />
          <TextField label="Report date" name="reportDate" value={form.reportDate} onChange={updateField} placeholder="YYYY-MM-DD" />
          <TextField label="Remarks" name="remarks" value={form.remarks} onChange={updateField} placeholder="Notes from the inspection" />
          {error && <p className="md:col-span-2 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p className="md:col-span-2 rounded bg-green-50 p-3 text-sm text-green-700">{message}</p>}
          <button disabled={isSubmitting || !technicianId} type="submit" className="md:col-span-2 rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400">
            {isSubmitting ? 'Submitting...' : 'Submit safety check'}
          </button>
        </form>
      </section>
    </TechnicianAppLayout>
  );
}

function getMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error) ? error.response?.data?.message ?? fallback : fallback;
}

function TextField({ label, name, value, placeholder, onChange }: { label: string; name: keyof typeof initialForm; value: string; placeholder?: string; onChange: (name: keyof typeof initialForm, value: string) => void }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <input id={name} name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
    </div>
  );
}

function SelectField({ label, name, value, onChange }: { label: string; name: keyof typeof initialForm; value: string; onChange: (name: keyof typeof initialForm, value: string) => void }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <select id={name} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600">
        <option value="Passed">Passed</option>
        <option value="Failed">Failed</option>
        <option value="Needs Follow-up">Needs Follow-up</option>
      </select>
    </div>
  );
}
