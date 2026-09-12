"use client";
import PageIntro from "./PageIntro";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import LoadingState from "./LoadingState";
import StatusBadge from "./StatusBadge";
import axios from "axios";

type Booking = { id: number; slotNumber: string; status: string; bookingTime: string };
const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const labels: Record<string, string> = {
  pending_payment: "Pending payment", confirmed: "Confirmed", cancelled: "Cancelled", completed: "Completed",
};

export default function BookingDetails({ id, onUnauthorized }: {
  id: string; onUnauthorized: () => void;
}) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const validId = /^[1-9]d*$/.test(id) && Number.isSafeInteger(Number(id));

  useEffect(() => {
    if (!validId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return; }
    const controller = new AbortController();
    axios.get<Booking>(base + "/user/bookings/" + id, {
      headers: { Authorization: "Bearer " + token }, signal: controller.signal,
    }).then(({ data }) => {
      if (!controller.signal.aborted) setBooking(data);
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      if (axios.isAxiosError(cause)) {
        if (cause.response?.status === 401) { onUnauthorized(); return; }
        if (cause.response?.status === 404) { setMissing(true); return; }
      }
      setError("Unable to load booking details. Please try again.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, validId, attempt, onUnauthorized]);

  async function cancel() {
    if (busy || !booking) return;
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const { data } = await axios.patch<Booking>(base + "/user/bookings/" + id,
        { status: "cancelled" }, { headers: { Authorization: "Bearer " + token } });
      setBooking(data);
      setConfirmCancel(false);
      setMessage("Booking cancelled successfully.");
    } catch (cause) {
      if (axios.isAxiosError(cause)) {
        if (cause.response?.status === 401) { onUnauthorized(); return; }
        if (cause.response?.status === 404) { setMissing(true); return; }
        const detail = cause.response?.data?.message;
        setError(Array.isArray(detail) ? detail.join(" ") : typeof detail === "string" ? detail : "Unable to cancel booking. Please try again.");
      } else setError("Unable to cancel booking. Please try again.");
    } finally { setBusy(false); }
  }

  if (!validId || missing) notFound();
  return (
    <section className="max-w-xl">
      <PageIntro title="Your charging plan." description="Everything you need to know about this booking." />
      <Link href="/user/bookings" className="mt-3 inline-block text-primary underline">Back to My Bookings</Link>
      {loading ? <LoadingState text="Loading booking details..." /> : booking && (
        <div className="dui-card mt-6 border border-base-300 bg-base-100 p-6 shadow-sm">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <dt className="font-semibold">Booking ID</dt><dd>#{booking.id}</dd>
            <dt className="font-semibold">Slot</dt><dd>{booking.slotNumber}</dd>
            <dt className="font-semibold">Booked at</dt><dd>{new Date(booking.bookingTime).toLocaleString()}</dd>
            <dt className="font-semibold">Status</dt><dd><StatusBadge status={booking.status} /></dd>
          </dl>
          {booking.status === "pending_payment" && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!busy && <Link href={"/user/payments/" + booking.id} className="dui-btn dui-btn-primary">Pay Now</Link>}
              {confirmCancel ? <>
                <p>Cancel this booking?</p>
                <button disabled={busy} onClick={cancel} className="text-red-700 underline">{busy ? "Cancelling..." : "Yes, cancel"}</button>
                <button disabled={busy} onClick={() => setConfirmCancel(false)} className="underline">Keep booking</button>
              </> : <button onClick={() => setConfirmCancel(true)} className="text-red-700 underline">Cancel Booking</button>}
            </div>
          )}
        </div>
      )}
      {message && <p role="status" className="dui-alert dui-alert-success dui-alert-soft mt-4 text-sm">{message}</p>}
      {error && <div className="mt-4">
        <p role="alert" className="text-red-700">{error}</p>
        <button disabled={busy || loading} className="mt-3 underline" onClick={() => {
          setError(""); setLoading(true); setAttempt(value => value + 1);
        }}>Try again</button>
      </div>}
    </section>
  );
}



