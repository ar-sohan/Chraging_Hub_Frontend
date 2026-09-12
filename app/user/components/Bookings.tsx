"use client";
import PageIntro from "./PageIntro";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import LoadingState from "./LoadingState";
import StatusBadge from "./StatusBadge";
import { z } from "zod";

type Booking = { id: number; slotNumber: string; status: string; bookingTime: string };
const slotSchema = z.string().trim().toUpperCase().regex(
  /^A-([1-9]|[12][0-9]|30)$/,
  "Please select an available slot"
);
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const statusLabels: Record<string, string> = {
  pending_payment: "Pending payment", confirmed: "Confirmed",
  cancelled: "Cancelled", completed: "Completed",
};

export default function Bookings({ createMode = false, onUnauthorized }: {
  createMode?: boolean; onUnauthorized: () => void;
}) {
  const [slots, setSlots] = useState<{ slotNumber: string; available: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [slotAttempt, setSlotAttempt] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(!createMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [cancelId, setCancelId] = useState<number | null>(null);

  function auth() {
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return null; }
    return { Authorization: `Bearer ${token}` };
  }

  function showError(cause: unknown) {
    if (axios.isAxiosError(cause)) {
      if (cause.response?.status === 401) { onUnauthorized(); return; }
      const detail = cause.response?.data?.message;
      setError(Array.isArray(detail) ? detail.join(" ") :
        typeof detail === "string" ? detail : "Request failed. Please try again.");
    } else setError("Request failed. Please try again.");
  }

  useEffect(() => {
    if (createMode) return;
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    axios.get<Booking[]>(`${apiUrl}/user/bookings`, {
      headers: { Authorization: `Bearer ${token}` }, signal: controller.signal,
    }).then(({ data }) => {
      if (!controller.signal.aborted) setBookings(data);
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      if (axios.isAxiosError(cause) && cause.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.replace("/user/login");
        return;
      }
      setError("Unable to load bookings. Please try again.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [createMode, attempt]);

  useEffect(() => {
    if (!createMode) return;
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    axios.get<{ slotNumber: string; available: boolean }[]>(apiUrl + "/user/slots", {
      headers: { Authorization: "Bearer " + token }, signal: controller.signal,
    }).then(({ data }) => {
      if (controller.signal.aborted) return;
      setSlots(data);
      setSlotsError("");
      setSelectedSlot((selected) => data.some((slot) => slot.slotNumber === selected && slot.available) ? selected : "");
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      if (axios.isAxiosError(cause) && cause.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.replace("/user/login");
        return;
      }
      setSlotsError("Unable to load available slots. Please refresh.");
    }).finally(() => {
      if (!controller.signal.aborted) setSlotsLoading(false);
    });
    return () => controller.abort();
  }, [createMode, slotAttempt]);

  useEffect(() => {
    if (!createMode) return;
    const refresh = () => { setSlotsLoading(true); setSlotAttempt((value) => value + 1); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [createMode]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError(""); setMessage("");
    const result = slotSchema.safeParse(selectedSlot);
    if (!result.success) { setError(result.error.issues[0].message); return; }
    const headers = auth();
    if (!headers) return;
    setBusy(true);
    try {
      const { data } = await axios.post<Booking>(`${apiUrl}/user/bookings`,
        { slotNumber: result.data }, { headers });
      setMessage(`Booking #${data.id} created for slot ${data.slotNumber}. Payment is pending.`);
      setSelectedSlot("");
      setSlots((items) => items.map((slot) => slot.slotNumber === data.slotNumber ? { ...slot, available: false } : slot));
    } catch (cause) { showError(cause); }
    finally { setBusy(false); setSlotsLoading(true); setSlotAttempt((value) => value + 1); }
  }

  async function cancel(id: number) {
    if (busy) return;
    const headers = auth();
    if (!headers) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const { data } = await axios.patch<Booking>(`${apiUrl}/user/bookings/${id}`,
        { status: "cancelled" }, { headers });
      setBookings((items) => items.map((item) => item.id === id ? data : item));
      setCancelId(null);
      setMessage(`Booking #${id} cancelled.`);
    } catch (cause) { showError(cause); }
    finally { setBusy(false); setSlotsLoading(true); setSlotAttempt((value) => value + 1); }
  }

  return (
    <section>
      <PageIntro title={createMode ? "Find your next spot." : "Your bookings, together."} description={createMode ? "Choose an available charging slot and make it yours." : "Keep track of your charging plans and manage upcoming bookings."} />
      <Link className="mt-3 inline-block text-primary underline"
        href={createMode ? "/user/bookings" : "/user/bookings/new"}>
        {createMode ? "View my bookings" : "Book a slot"}
      </Link>
      {createMode ? (
        <form noValidate onSubmit={create} className="dui-card mt-6 max-w-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
          <h2 className="font-semibold">Select a slot</h2>
          <p className="mt-2 text-sm text-base-content/65">Light green: available · Gray: booked · Solid green: selected</p>
          <button type="button" className="mt-3 text-primary underline" disabled={busy || slotsLoading}
            onClick={() => { setSlotsLoading(true); setSlotAttempt((value) => value + 1); }}>Refresh availability</button>
          {slotsLoading && <p role="status" className="mt-3">Loading availability...</p>}
          {!slotsLoading && !slotsError && (
            <p className="mt-3">{slots.filter((slot) => slot.available).length} of 30 slots available</p>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5" aria-label="Charging slots">
            {slots.map((slot) => (
              <button key={slot.slotNumber} type="button"
                disabled={!slot.available || busy || slotsLoading || !!slotsError}
                aria-pressed={selectedSlot === slot.slotNumber}
                onClick={() => { setSelectedSlot(slot.slotNumber); setError(""); setMessage(""); }}
                className={"dui-btn h-auto min-h-20 flex-col gap-1 rounded-xl p-3 text-center shadow-none disabled:cursor-not-allowed " +
                  (!slot.available ? "border-gray-300 bg-gray-100 text-gray-500" :
                   selectedSlot === slot.slotNumber ? "border-primary bg-primary text-white" :
                   "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-primary hover:bg-emerald-100")}>
                <span className="block font-semibold">{slot.slotNumber}</span>
                <span className="text-xs">{!slot.available ? "Booked" : selectedSlot === slot.slotNumber ? "Selected" : "Available"}</span>
              </button>
            ))}
          </div>
          <p className="mt-4">{selectedSlot ? "Selected slot: " + selectedSlot : "Choose an available slot above."}</p>
          <button disabled={busy || slotsLoading || !!slotsError || !slots.some((slot) => slot.available)}
            className="dui-btn dui-btn-primary mt-5">
            {busy ? "Booking..." : "Book Slot"}
          </button>
          {slotsError && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{slotsError}</p>}
          {error && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{error}</p>}
          {message && <p role="status" className="dui-alert dui-alert-success dui-alert-soft mt-4 text-sm">{message}</p>}
        </form>
      ) : (
        <>
          {loading ? <LoadingState text="Loading bookings..." /> : (
            bookings.length ? <div className="mt-6 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
              <table className="dui-table w-full">
                <thead><tr className="bg-gray-100">
                  {["Booking", "Slot", "Status", "Booked at", "Action"].map((title) => <th className="p-4" key={title}>{title}</th>)}
                </tr></thead>
                <tbody>{bookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="p-4">#{booking.id}</td><td className="p-4">{booking.slotNumber}</td>
                    <td className="p-4"><StatusBadge status={booking.status} /></td>
                    <td className="p-4">{new Date(booking.bookingTime).toLocaleString()}</td>
                    <td className="p-4">
                      <Link href={"/user/bookings/" + booking.id} className="dui-btn dui-btn-ghost dui-btn-sm mr-2 text-primary">Details</Link>
                      {booking.status === "pending_payment" && <Link href={"/user/payments/" + booking.id} className="dui-btn dui-btn-ghost dui-btn-sm mr-2 text-primary">Pay Now</Link>}
                      {booking.status === "pending_payment" && (
                        cancelId === booking.id ? <div className="flex flex-wrap items-center gap-2">
                          <span>Cancel this booking?</span>
                          <button disabled={busy} onClick={() => cancel(booking.id)} className="text-red-700 underline disabled:opacity-50">{busy ? "Cancelling..." : "Yes, cancel"}</button>
                          <button disabled={busy} onClick={() => setCancelId(null)} className="underline">Keep booking</button>
                        </div> : <button disabled={busy} onClick={() => setCancelId(booking.id)} className="text-red-700 underline">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div> : !error && <p className="mt-6">You have no bookings yet.</p>
          )}
          {error && <div className="mt-4"><p role="alert" className="text-red-700">{error}</p>
            <button className="mt-2 underline" disabled={busy || loading} onClick={() => { setError(""); setLoading(true); setAttempt((value) => value + 1); }}>Refresh bookings</button>
          </div>}
          {message && <p role="status" className="dui-alert dui-alert-success dui-alert-soft mt-4 text-sm">{message}</p>}
        </>
      )}
    </section>
  );
}








