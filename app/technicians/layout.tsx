import { ReactNode } from 'react';

// A route segment boundary is required for Next.js to apply this folder's
// loading.tsx and not-found.tsx to unmatched child routes automatically.
// The actual visual header/nav is still applied per-page via
// TechnicianLayout (public pages) or TechnicianAppLayout (authenticated pages).
export default function TechniciansSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
