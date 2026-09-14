import { notFound } from 'next/navigation';

// Catches any /technicians/* path that doesn't match a real page and renders
// the nearest not-found.tsx. notFound() only works reliably when called
// synchronously during render (a Server Component, as here) — not from an
// async effect/event handler, which is why the report detail pages use plain
// error state for a missing record instead.
export default function TechniciansCatchAll() {
  notFound();
}
