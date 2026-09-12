import Link from 'next/link';
import TechnicianLayout from './components/TechnicianLayout';

export default function TechnicianHomePage() {
  return (
    <TechnicianLayout>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-3 font-semibold text-blue-700">Technician workspace</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Maintain ChargeHub stations with one technician profile.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Register your technician profile, wait for approval, and keep maintenance work records organised.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/technicians/register" className="rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
            Create profile
          </Link>
          <Link href="/technicians/login" className="rounded border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-100">
            Login
          </Link>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold">1. Register</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Enter professional details using the technician registration form.</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold">2. Approval status</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">A new profile is saved with Pending status for the admin review process.</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold">3. Work records</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Add and review charging or hardware maintenance tasks for a profile.</p>
          </article>
        </div>
      </section>
    </TechnicianLayout>
  );
}
