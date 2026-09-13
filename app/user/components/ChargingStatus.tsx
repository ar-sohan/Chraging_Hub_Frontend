"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import BatteryIndicator from "./BatteryIndicator";

type Session = { bookingId: number; slotNumber: string; status: string; percentage: number };
type Booking = { id: number; slotNumber: string; status: string };

export default function ChargingStatus() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmStop, setConfirmStop] = useState<number | null>(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  function handleError(cause: unknown) {
    if (axios.isAxiosError(cause) && cause.response?.status === 401) {
      localStorage.removeItem("accessToken"); window.location.replace("/user/login"); return;
    }
    setError("Unable to update charging. Please try again.");
  }

  useEffect(() => {
    const controller = new AbortController();
    const headers = { Authorization: "Bearer " + localStorage.getItem("accessToken") };
    Promise.all([
      axios.get<Session[]>(base + "/user/charging", { headers, signal: controller.signal }),
      axios.get<Booking[]>(base + "/user/bookings", { headers, signal: controller.signal }),
    ]).then(([charging, bookings]) => {
      if (controller.signal.aborted) return;
      setSessions(charging.data); setBookings(bookings.data); setError("");
    }).catch(cause => { if (!controller.signal.aborted) handleError(cause); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });


  return () => controller.abort();
  }, [attempt, base]);

  useEffect(() => {
    const refresh = () => setAttempt(value => value + 1);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 5000);
    window.addEventListener("focus", refresh);
    window.addEventListener("chargehub:notification", refresh);


  return () => {
      window.clearInterval(timer); window.removeEventListener("focus", refresh);
      window.removeEventListener("chargehub:notification", refresh);
    };
  }, []);

  const eligible = bookings.filter(booking => booking.status === "confirmed" && !sessions.some(session => session.bookingId === booking.id));
  const active = sessions.filter(session => session.status === "charging");
  const shown = active.length ? active : sessions.slice(0, 1);

  async function start() {
    if (!selected || !eligible.some(booking => String(booking.id) === selected)) {
      setError("Select a confirmed booking to start charging."); return;
    }
    setBusy(true); setError("");
    try {
      const { data } = await axios.post<Session>(base + "/user/charging/" + selected + "/start", {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
      });
      setSessions(items => [data, ...items.filter(item => item.bookingId !== data.bookingId)]);
      setSelected(""); setAttempt(value => value + 1);
    } catch (cause) { handleError(cause); }
    finally { setBusy(false); }
  }

  async function stop(id: number) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const { data } = await axios.post<Session>(base + "/user/charging/" + id + "/stop", {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
      });
      setSessions(items => items.map(item => item.bookingId === id ? data : item));
      setConfirmStop(null); setAttempt(value => value + 1);
      window.dispatchEvent(new Event("chargehub:notification"));
    } catch (cause) { handleError(cause); }
    finally { setBusy(false); }
  }

  return (
    <section className="dui-card border border-base-300 bg-base-100 p-6" aria-labelledby="charging-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="charging-title" className="text-lg font-semibold">Charging status</h2>
      </div>
      {loading ? <p role="status" className="my-6">Loading charging status...</p> : <>
        {!shown.length && <BatteryIndicator percentage={0} label="Charging not started" />}
        {shown.map(session => (
          <div key={session.bookingId} className="my-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">Slot {session.slotNumber}</span>
            </div>
            <BatteryIndicator percentage={session.percentage} label={"Charge for slot " + session.slotNumber} />
            <p className="mt-2 text-sm text-base-content/60">{session.status === "completed" ? "Fully charged · Session complete" : session.status === "stopped" ? "Stopped · Session ended" : "Charging in progress"}</p>
          </div>
        ))}
        {eligible.length > 0 && <div className="mt-auto pt-4">
          <label htmlFor="charging-booking" className="mb-2 block text-sm">Confirmed booking</label>
          <select id="charging-booking" className="dui-select w-full" value={selected} disabled={busy} onChange={event => setSelected(event.target.value)}>
            <option value="">Select a booking</option>
            {eligible.map(booking => <option value={booking.id} key={booking.id}>Slot {booking.slotNumber} · Booking #{booking.id}</option>)}
          </select>

        </div>}
        {active.length > 1 && <label className="mt-3 block text-sm">Session to stop
          <select className="dui-select mt-2 w-full" value={confirmStop ?? ""} disabled={busy} onChange={event => setConfirmStop(Number(event.target.value) || null)}>
            <option value="">Select active session</option>
            {active.map(session => <option key={session.bookingId} value={session.bookingId}>Slot {session.slotNumber}</option>)}
          </select>
        </label>}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" disabled={busy || !active.length} onClick={() => setConfirmStop(confirmStop ?? active[0].bookingId)} className="dui-btn charging-stop-button w-full">Stop charging</button>
          <button type="button" disabled={busy || !eligible.length} onClick={start} className="dui-btn dui-btn-primary w-full">Start charging</button>
        </div>
        {confirmStop !== null && active.some(session => session.bookingId === confirmStop) && <div className="mt-4 rounded-xl border border-base-300 p-3">
          <p className="text-sm">Stop charging for slot {active.find(session => session.bookingId === confirmStop)?.slotNumber}? This ends the session and releases the slot.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => stop(confirmStop)} className="dui-btn dui-btn-sm charging-stop-button">{busy ? "Stopping..." : "Yes, stop"}</button>
            <button type="button" disabled={busy} onClick={() => setConfirmStop(null)} className="dui-btn dui-btn-sm dui-btn-ghost">Keep charging</button>
          </div>
        </div>}
        {!eligible.length && !active.length && <Link className="dui-btn dui-btn-ghost mt-4" href="/user/bookings/new">Book a charging slot ↗</Link>}
      </>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}




