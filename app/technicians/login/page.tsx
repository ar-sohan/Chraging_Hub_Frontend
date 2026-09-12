'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import PageTitle from '../components/PageTitle';
import TechnicianLayout from '../components/TechnicianLayout';
import { loginSchema } from '../lib/schemas';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setMessage('');
      setError(result.error.issues[0]?.message ?? 'Please check your input');
      return;
    }

    setError('');
    setMessage('Your login form is valid. A technician sign-in API is required before this form can authenticate an account.');
  }

  return (
    <TechnicianLayout>
      <section className="mx-auto max-w-md px-5 py-12">
        <PageTitle title="Technician login" description="Sign in using your registered email and password." />
        <form noValidate onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input id="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-blue-600" />
          </div>
          {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}
          <button type="submit" className="w-full rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Login</button>
          <p className="text-center text-sm text-slate-600">New technician? <Link className="font-semibold text-blue-700" href="/technicians/register">Register here</Link></p>
        </form>
      </section>
    </TechnicianLayout>
  );
}
