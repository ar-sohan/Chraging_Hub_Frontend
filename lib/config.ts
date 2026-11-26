// Base URL of the NestJS backend. Set NEXT_PUBLIC_API_URL in .env.local (dev)
// or in the hosting dashboard (e.g. Vercel) to point at the deployed API.
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  'http://localhost:3000'
).replace(/\/$/, '');
