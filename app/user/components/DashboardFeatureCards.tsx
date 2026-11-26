import Link from "next/link";
import StatusBadge from "./StatusBadge";

type Booking = { id: number; slotNumber: string; status: string; bookingTime: string };

export default function DashboardFeatureCards({ latest }: { latest?: Booking }) {
  return (
    <article className="dui-card mt-6 flex flex-col gap-5 border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="4" width="18" height="17" rx="3" /><path d="M7 2v4M17 2v4M3 10h18m-13 5 3 3 5-5" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-base-content/50">Latest booking</p>
          <h2 className="mt-1 text-lg font-semibold">{latest ? "Slot " + latest.slotNumber : "Your first charge starts here"}</h2>
          <p className="mt-1 text-xs text-base-content/55">{latest ? "Booking #" + latest.id + " · " + new Date(latest.bookingTime).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Choose a slot whenever you’re ready."}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        {latest && <StatusBadge status={latest.status} />}
        <Link href={latest ? "/user/bookings/" + latest.id : "/user/bookings/new"} className="dui-btn dui-btn-ghost dui-btn-sm text-primary">
          {latest ? "View booking" : "Find a slot"} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
