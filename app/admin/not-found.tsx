import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-indigo-500">404</h1>
          <p className="py-6 text-lg text-gray-600">
            Oops, this page doesn't exist.
          </p>
          <Link href="/admin/dashboard" className="btn bg-indigo-500 text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}