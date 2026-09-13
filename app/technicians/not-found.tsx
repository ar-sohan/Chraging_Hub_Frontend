import Link from 'next/link';

export default function TechnicianNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Not found</h1>
      <p className="text-slate-600">The technician page or report you are looking for does not exist.</p>
      <Link href="/technicians/dashboard" className="rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
        Back to dashboard
      </Link>
    </div>
  );
}
