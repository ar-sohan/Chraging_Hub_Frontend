export default function SummaryIllustration({ kind }: { kind: string }) {
  return <svg className="summary-illustration" viewBox="0 0 88 88" fill="none" aria-hidden="true">
    <circle cx="44" cy="44" r="39" fill="#edf6e6" />
    <ellipse cx="44" cy="72" rx="27" ry="4" fill="#c9ddbf" />
    <g stroke="#286346" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {kind === "Available Slots" ? <>
        <rect x="24" y="15" width="33" height="56" rx="7" fill="#fff" />
        <rect x="30" y="22" width="21" height="23" rx="4" fill="#205a3e" stroke="none" />
        <path d="m42 25-7 11h6l-2 7 9-12h-6l2-6Z" fill="#c4ee8c" stroke="none" />
        <path d="M57 36h5q8 0 8 9v15q0 7-6 7t-6-7V48" />
        <path d="M32 54h16M20 72h42" />
      </> : kind === "My Bookings" ? <>
        <rect x="18" y="23" width="52" height="46" rx="7" fill="#fff" />
        <path d="M19 37h50M31 18v12M57 18v12" />
        <rect x="27" y="44" width="10" height="9" rx="2" fill="#b6df9d" stroke="none" />
        <path d="M45 48h5M58 48h3M29 60h5M45 60h5M58 60h3" />
      </> : kind === "Pending Payments" ? <>
        <path d="M21 31v-7q0-5 6-5h35v19" fill="#badca6" />
        <rect x="18" y="30" width="52" height="37" rx="7" fill="#fff" />
        <path d="M57 42h17v15H57q-7-8 0-15Z" fill="#c6e6b3" />
        <circle cx="62" cy="49" r="2" fill="#286346" stroke="none" />
        <path d="M27 42h13" />
      </> : <>
        <rect x="23" y="18" width="39" height="53" rx="6" fill="#fff" />
        <path d="M32 29h21M32 38h13M32 48h10" />
        <circle cx="59" cy="58" r="16" fill="#b9e39d" />
        <path d="m51 58 5 5 10-11" strokeWidth="3" />
      </>}
    </g>
  </svg>;
}
