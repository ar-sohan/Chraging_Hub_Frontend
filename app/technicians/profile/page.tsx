'use client';

import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import StatusBadge from '../components/StatusBadge';
import TechnicianAppLayout from '../components/TechnicianAppLayout';
import { addSpecialisation, getMyProfile, updateMyProfile } from '../lib/api';
import { profileUpdateSchema } from '../lib/schemas';
import { TechnicianProfile } from '../lib/types';

type EditableForm = {
  fullName: string;
  phone: string;
  location: string;
  country: string;
  experience: string;
  primarySpecialisation: string;
  certification: string;
  socialMediaLink: string;
};

function toForm(technician: TechnicianProfile): EditableForm {
  return {
    fullName: technician.fullName,
    phone: technician.phone,
    location: technician.location,
    country: technician.country,
    experience: String(technician.experience),
    primarySpecialisation: technician.primarySpecialisation,
    certification: technician.certification ?? '',
    socialMediaLink: technician.socialMediaLink ?? '',
  };
}

export default function MyTechnicianProfilePage() {
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [form, setForm] = useState<EditableForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newSpecialisation, setNewSpecialisation] = useState('');
  const [isAddingSpecialisation, setIsAddingSpecialisation] = useState(false);

  async function loadProfile() {
    try {
      const data = await getMyProfile();
      setTechnician(data);
      setForm(toForm(data));
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not load your profile'));
    }
  }

  useEffect(() => { loadProfile(); }, []);

  function updateField(name: keyof EditableForm, value: string) {
    if (!form) return;
    setForm({ ...form, [name]: value });
  }

  async function handleAddSpecialisation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!technician || !newSpecialisation.trim()) return;
    setIsAddingSpecialisation(true);
    setError('');
    setMessage('');
    try {
      const updated = await addSpecialisation(technician.id, newSpecialisation.trim());
      setTechnician(updated);
      setNewSpecialisation('');
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not add this specialisation'));
    } finally {
      setIsAddingSpecialisation(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!technician || !form) return;

    const result = profileUpdateSchema.safeParse(form);
    if (!result.success) {
      setMessage('');
      setError(result.error.issues[0]?.message ?? 'Please check your input');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await updateMyProfile(technician.id, {
        ...result.data,
        certification: result.data.certification || undefined,
        socialMediaLink: result.data.socialMediaLink || undefined,
      });
      setTechnician(updated);
      setForm(toForm(updated));
      setIsEditing(false);
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(getMessage(requestError, 'Could not update your profile'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <TechnicianAppLayout>
      <section className="mx-auto max-w-4xl px-5 py-12">
        <PageTitle title="My profile" description="View and update the information you provided during registration." />
        {error && <p className="mb-6 rounded bg-red-50 p-4 text-red-700">{error}</p>}
        {message && <p className="mb-6 rounded bg-green-50 p-4 text-green-700">{message}</p>}
        {!technician && !error && <p className="text-slate-600">Loading profile...</p>}

        {technician && form && !isEditing && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{technician.fullName}</h2>
                <p className="text-slate-600">{technician.primarySpecialisation}</p>
              </div>
              <StatusBadge status={technician.approvalStatus} />
            </div>
            <dl className="mt-7 grid gap-5 sm:grid-cols-2">
              <Info label="Email" value={technician.email} />
              <Info label="Phone" value={technician.phone} />
              <Info label="Location" value={technician.location} />
              <Info label="Country" value={technician.country} />
              <Info label="Experience" value={`${technician.experience} year(s)`} />
              <Info label="Certification" value={technician.certification || 'Not provided'} />
              <Info label="Social media link" value={technician.socialMediaLink || 'Not provided'} />
              <Info label="Joined" value={new Date(technician.joiningDate).toLocaleDateString()} />
            </dl>
            <div className="mt-7">
              <h3 className="font-bold">Specialisations</h3>
              <p className="mt-2 text-slate-600">{technician.specialisations.map((item) => item.name).join(', ') || technician.primarySpecialisation}</p>
              <form onSubmit={handleAddSpecialisation} className="mt-3 flex gap-2">
                <input
                  value={newSpecialisation}
                  onChange={(event) => setNewSpecialisation(event.target.value)}
                  placeholder="Add a specialisation, e.g. Battery Systems"
                  className="w-full max-w-xs rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-600"
                />
                <button disabled={isAddingSpecialisation || !newSpecialisation.trim()} type="submit" className="rounded bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:bg-slate-400">
                  {isAddingSpecialisation ? 'Adding...' : 'Add'}
                </button>
              </form>
            </div>
            <button onClick={() => setIsEditing(true)} className="mt-7 rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
              Edit profile
            </button>
          </div>
        )}

        {technician && form && isEditing && (
          <form noValidate onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
            <Field label="Full name" name="fullName" value={form.fullName} onChange={updateField} />
            <Field label="Phone" name="phone" value={form.phone} onChange={updateField} placeholder="01XXXXXXXXX" />
            <Field label="Location / city" name="location" value={form.location} onChange={updateField} />
            <Field label="Country" name="country" value={form.country} onChange={updateField} />
            <Field label="Years of experience" name="experience" value={form.experience} onChange={updateField} />
            <Field label="Primary specialisation" name="primarySpecialisation" value={form.primarySpecialisation} onChange={updateField} />
            <Field label="Certification (optional)" name="certification" value={form.certification} onChange={updateField} />
            <Field label="Social profile URL (optional)" name="socialMediaLink" value={form.socialMediaLink} onChange={updateField} />
            <div className="flex gap-3 md:col-span-2">
              <button disabled={isSaving} type="submit" className="rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400">
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => { setForm(toForm(technician)); setIsEditing(false); setError(''); }}
                className="rounded border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
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

function Field({ label, name, value, placeholder, onChange }: { label: string; name: keyof EditableForm; value: string; placeholder?: string; onChange: (name: keyof EditableForm, value: string) => void }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <input id={name} name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
    </div>
  );
}
