"use client";
import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

type Booking = { id: number; slotNumber: string; status: string; bookingTime: string };
export default function BookingList({ bookings, busy, cancelId, onCancel, onConfirm }: {
  bookings: Booking[]; busy: boolean; cancelId: number | null;
  onCancel: (id: number) => void; onConfirm: (id: number | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const query = search.trim().toLowerCase();
  const filtered = [...bookings].filter(item =>
    (!status || item.status === status) &&
    (!query || ("#" + item.id).includes(query) || item.slotNumber.toLowerCase().includes(query))
  ).sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime() || b.id - a.id);
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * 5, current * 5);
  function reset() { setSearch(""); setStatus(""); setPage(1); onConfirm(null); }
  function actions(item: Booking) {
    return <div className="flex flex-wrap items-center gap-2">
      <Link href={"/user/bookings/" + item.id} className="dui-btn dui-btn-ghost dui-btn-sm">View details</Link>
      {item.status === "pending_payment" && <>
        <Link href={"/user/payments/" + item.id} className="dui-btn dui-btn-primary dui-btn-sm">Pay now</Link>
        {cancelId === item.id ? <div className="w-full rounded-lg bg-red-50 p-3 text-sm">
          <p>Cancel booking #{item.id}?</p>
          <button type="button" disabled={busy} onClick={() => onCancel(item.id)} className="mr-3 mt-2 text-red-700 underline">{busy ? "Cancelling..." : "Yes, cancel"}</button>
          <button type="button" disabled={busy} onClick={() => onConfirm(null)} className="underline">Keep booking</button>
        </div> : <button type="button" disabled={busy} onClick={() => onConfirm(item.id)} className="dui-btn dui-btn-ghost dui-btn-sm text-red-700">Cancel</button>}
      </>}
    </div>;
  }
  function date(item: Booking) {
    const value = new Date(item.bookingTime);
    return <time dateTime={item.bookingTime}><span className="block">{value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span><span className="mt-1 block text-xs text-base-content/50">{value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></time>;
  }
  return <div className="mt-6">
    <div className="mb-4 flex flex-wrap gap-3">
      <label className="flex-1 min-w-48"><span className="sr-only">Search booking ID or slot</span>
        <input className="dui-input w-full" value={search} placeholder="Search booking ID or slot…" onChange={event => { setSearch(event.target.value); setPage(1); onConfirm(null); }} />
      </label>
      <label><span className="sr-only">Filter by status</span><select className="dui-select w-full" value={status} onChange={event => { setStatus(event.target.value); setPage(1); onConfirm(null); }}>
        <option value="">All statuses</option>
        {["confirmed", "pending_payment", "completed", "stopped", "cancelled"].map(value => <option key={value} value={value}>{value.replaceAll("_", " ").replace(/^./, letter => letter.toUpperCase())}</option>)}
      </select></label>
      {(search || status) && <button type="button" className="dui-btn dui-btn-ghost" onClick={reset}>Clear</button>}
    </div>
    {rows.length ? <>
      <div className="booking-desktop-table overflow-x-auto rounded-2xl border border-base-300 bg-white">
        <table className="dui-table w-full">
          <thead><tr>{["Booking", "Slot", "Status", "Booked at", "Actions"].map(text => <th key={text}>{text}</th>)}</tr></thead>
          <tbody>{rows.map(item => <tr key={item.id}><td>#{item.id}</td><td>{item.slotNumber}</td><td><StatusBadge status={item.status} /></td><td>{date(item)}</td><td>{actions(item)}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="booking-mobile-cards">
        {rows.map(item => <article key={item.id} className="dui-card border border-base-300 bg-white p-5">
          <div className="flex items-center justify-between gap-2"><h2 className="font-semibold">Slot {item.slotNumber}</h2><StatusBadge status={item.status} /></div>
          <div className="my-4 flex justify-between gap-3 text-sm"><span className="text-base-content/60">Booking #{item.id}</span>{date(item)}</div>
          {actions(item)}
        </article>)}
      </div>
    </> : <div className="portal-empty"><h2>No matching bookings</h2><p>Try a different booking ID, slot or status.</p><button type="button" className="dui-btn dui-btn-ghost" onClick={reset}>Clear filters</button></div>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-base-content/60" role="status">{filtered.length ? (current - 1) * 5 + 1 : 0}–{Math.min(current * 5, filtered.length)} of {filtered.length} bookings</p>
      <nav aria-label="Booking pages" className="flex items-center gap-3">
        <button type="button" disabled={current === 1} className="dui-btn dui-btn-ghost dui-btn-sm" onClick={() => { setPage(current - 1); onConfirm(null); }}>Previous</button>
        <span className="text-sm">Page {current} of {pages}</span>
        <button type="button" disabled={current === pages} className="dui-btn dui-btn-ghost dui-btn-sm" onClick={() => { setPage(current + 1); onConfirm(null); }}>Next</button>
      </nav>
    </div>
  </div>;
}
