"use client";
import EVIllustration from "./EVIllustration";
import DashboardCharts from "./DashboardCharts";
import DashboardFeatureCards from "./DashboardFeatureCards";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import LoadingState from "./LoadingState";
import StatusBadge from "./StatusBadge";

type Booking = { id: number; slotNumber: string; status: string; bookingTime: string };
type Slot = { slotNumber: string; available: boolean };
type Summary = { bookings: Booking[]; slots: Slot[] };
const labels: Record<string, string> = {
  pending_payment: "Pending payment", confirmed: "Confirmed",
  cancelled: "Cancelled", completed: "Completed",
};

export default function DashboardSummary({ name, onUnauthorized }: {
  name: string; onUnauthorized: () => void;
}) {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return; }
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const config = { headers: { Authorization: "Bearer " + token }, signal: controller.signal };
    Promise.all([
      axios.get<Booking[]>(base + "/user/bookings", config),
      axios.get<Slot[]>(base + "/user/slots", config),
    ]).then(([bookings, slots]) => {
      if (!controller.signal.aborted) { setData({ bookings: bookings.data, slots: slots.data }); setError(""); }
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      if (axios.isAxiosError(cause) && cause.response?.status === 401) {
        onUnauthorized();
        return;
      }
      setError("Unable to update dashboard data. Reconnecting automatically.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [attempt, onUnauthorized]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") setAttempt(value => value + 1);
    };
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    window.addEventListener("chargehub:notification", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      window.removeEventListener("chargehub:notification", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const pending = data?.bookings.filter(item => item.status === "pending_payment") ?? [];
  const recent = data ? [...data.bookings].sort((a, b) =>
    new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime() || b.id - a.id
  ).slice(0, 5) : [];

  return (
    <section className="driver-dashboard">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {name}.</h1>
        </div>
        <span className="hidden text-sm text-base-content/50 sm:block">Your personal charging space</span>
      </div>
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#bce4ab]">CHARGE SMART. TRAVEL EASY.</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Your next journey,<br />fully charged.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">Find your charging spot, keep track of bookings, and get on with your day.</p>
          <Link href="/user/bookings/new" className="dashboard-book-button">Book a charging slot <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="dashboard-welcome-art"><EVIllustration /></div>
      </div>
      {loading && <LoadingState text="Loading your dashboard..." />}
      {data && (
        <>
          <div className="dashboard-metrics">
            {[
              { label: "Available Slots", value: data.slots.filter(slot => slot.available).length + " / " + data.slots.length, href: "/user/bookings/new" },
              { label: "My Bookings", value: data.bookings.length, href: "/user/bookings" },
              { label: "Pending Payments", value: pending.length, href: "/user/bookings" },
              { label: "Confirmed Bookings", value: data.bookings.filter(item => item.status === "confirmed").length, href: "/user/bookings" },
            ].map(card => <Link href={card.href} key={card.label} className="dui-stat rounded-2xl border border-base-300 bg-base-100 p-6 transition-colors hover:border-emerald-300">
              <div className="flex items-center justify-between gap-3"><p className="dui-stat-title text-sm">{card.label}</p><span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">↗</span></div>
              <p className="dui-stat-value mt-3 text-3xl font-semibold tracking-tight text-base-content">{card.value}</p>
            </Link>)}
          </div>



          {pending.length > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50 p-5">
            <p>{pending.length} booking{pending.length === 1 ? "" : "s"} awaiting payment.</p>
            <Link href={"/user/payments/" + pending[0].id} className="dui-btn dui-btn-primary">Pay Now</Link>
          </div>}

          <DashboardCharts bookings={data.bookings} slots={data.slots} />
          <DashboardFeatureCards latest={recent[0]} />
          <div className="mt-8 flex items-center justify-between gap-3">
            <div><h2 className="text-lg font-semibold">Recent bookings</h2><p className="mt-1 text-sm text-base-content/50">Your latest charging plans, at a glance.</p></div>
            <Link className="dui-btn dui-btn-ghost dui-btn-sm text-primary" href="/user/bookings">View all</Link>
          </div>
          {recent.length ? <div className="mt-4 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <table className="dui-table w-full">
              <thead className="bg-[#f1f5ef] text-base-content/60"><tr>
                {["Booking", "Slot", "Status", "Booked at", "Action"].map(label => <th key={label} className="p-4">{label}</th>)}
              </tr></thead>
              <tbody>{recent.map(booking => <tr key={booking.id} className="border-t border-base-300/60 hover:bg-base-200/50">
                <td className="p-4">#{booking.id}</td><td className="p-4">{booking.slotNumber}</td>
                <td className="p-4"><StatusBadge status={booking.status} /></td>
                <td className="p-4">{new Date(booking.bookingTime).toLocaleString()}</td>
                <td className="p-4">{booking.status === "pending_payment"
                  ? <Link className="text-primary underline" href={"/user/payments/" + booking.id}>Pay Now</Link>
                  : <Link className="dui-btn dui-btn-ghost dui-btn-sm text-primary" href={"/user/bookings/" + booking.id}>Details</Link>}</td>
              </tr>)}</tbody>
            </table>
          </div> : <p className="dui-card mt-4 border border-base-300 bg-base-100 p-6 shadow-sm">No bookings yet. Select Book Slot to get started.</p>}
        </>
      )}
      {error && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{error}</p>}
    </section>
  );
}











