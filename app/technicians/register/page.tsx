'use client';

import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '../components/PageTitle';
import TechnicianLayout from '../components/TechnicianLayout';
import { createTechnician } from '../lib/api';
import { registrationSchema } from '../lib/schemas';

const initialForm = {
  fullName: '', email: '', phone: '', location: '', country: '', experience: '',
  primarySpecialisation: '', certification: '', socialMediaLink: '', specialisations: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = registrationSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please check your input');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const technician = await createTechnician(result.data);
      router.push(`/technicians/profile/${technician.id}`);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError.response?.data?.message ?? 'Could not create the technician profile');
      } else {
        setError('Could not create the technician profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TechnicianLayout>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <PageTitle title="Technician registration" description="Create your profile. The admin approval status starts as Pending." />
        <form noValidate onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <Field label="Full name" name="fullName" value={form.fullName} onChange={updateField} />
          <Field label="Email" name="email" value={form.email} onChange={updateField} />
          <Field label="Phone" name="phone" value={form.phone} onChange={updateField} placeholder="01XXXXXXXXX" />
          <Field label="Location / city" name="location" value={form.location} onChange={updateField} />
          <Field label="Country" name="country" value={form.country} onChange={updateField} />
          <Field label="Years of experience" name="experience" value={form.experience} onChange={updateField} />
          <Field label="Primary specialisation" name="primarySpecialisation" value={form.primarySpecialisation} onChange={updateField} placeholder="Electrical" />
          <Field label="Other specialisations" name="specialisations" value={form.specialisations} onChange={updateField} placeholder="Battery Systems, Software" />
          <Field label="Certification (optional)" name="certification" value={form.certification} onChange={updateField} />
          <Field label="Social profile URL (optional)" name="socialMediaLink" value={form.socialMediaLink} onChange={updateField} />
          {error && <p className="md:col-span-2 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={isSubmitting} type="submit" className="md:col-span-2 rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400">
            {isSubmitting ? 'Creating profile...' : 'Register technician'}
          </button>
        </form>
      </section>
    </TechnicianLayout>
  );
}

type FieldProps = { label: string; name: string; value: string; placeholder?: string; onChange: (name: string, value: string) => void };

function Field({ label, name, value, placeholder, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <input id={name} name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
    </div>
  );
}
