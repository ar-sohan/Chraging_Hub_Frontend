"use client";
import PageIntro from "./PageIntro";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import LoadingState from "./LoadingState";
import StatusBadge from "./StatusBadge";

type Booking = { id: number; slotNumber: string; status: string };
type Quote = { booking: Booking; amount: number; currency: string; demo: boolean };
type Payment = { id: number; amount: number | string; status: string; paymentMethod: string;
  transactionId: string; paidAt?: string; paymentDate: string; booking: Booking; emailStatus?: string };
const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Payments({ bookingId, onUnauthorized }: {
  bookingId?: string; onUnauthorized: () => void;
}) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const url = bookingId ? base + "/user/payments/quote/" + encodeURIComponent(bookingId) : base + "/user/payments";
    axios.get(url, { headers: { Authorization: "Bearer " + token }, signal: controller.signal })
      .then(({data}) => {
        if (controller.signal.aborted) return;
        if (bookingId) setQuote(data); else setHistory(data);
      }).catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        if (axios.isAxiosError(cause) && cause.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.replace("/user/login");
          return;
        }
        setError("Unable to load payment details. Please try again.");
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [bookingId, attempt]);

  async function pay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !quote || quote.booking.status !== "pending_payment") return;
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return; }
    setBusy(true); setError("");
    try {
      const {data} = await axios.post<Payment>(base + "/user/payments/demo",
        { bookingId: quote.booking.id }, { headers: { Authorization: "Bearer " + token } });
      setReceipt(data);
      setQuote({...quote, booking: data.booking});
    } catch (cause) {
      if (axios.isAxiosError(cause)) {
        if (cause.response?.status === 401) { onUnauthorized(); return; }
        if (!cause.response) {
          setError("Cannot connect to the backend. Make sure the server is running, then retry.");
          return;
        }
        const detail = cause.response.data?.message;
        setError(Array.isArray(detail) ? detail.join(" ") : typeof detail === "string" ? detail : "Payment request failed. You can safely retry.");
      } else setError("Payment request failed. You can safely retry.");
    } finally { setBusy(false); }
  }

  return <section>
    <PageIntro title={bookingId ? "One step closer." : "Your payment history."} description={bookingId ? "Review your booking details before confirming your payment." : "A clear record of your booking payments, all in one place."} />
    <div className="mt-3 flex gap-4">
      <Link className="text-primary underline" href="/user/bookings">My bookings</Link>
      {bookingId && <Link className="text-primary underline" href="/user/payments">Payment history</Link>}
    </div>
    {loading ? <LoadingState text="Loading payment details..." /> : bookingId ? quote && (
      <form noValidate onSubmit={pay} className="dui-card mt-6 max-w-xl space-y-4 border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <p>Booking: #{quote.booking.id}</p><p>Slot: {quote.booking.slotNumber}</p>
        <p className="text-xl font-semibold">Total amount: {quote.currency} {Number(quote.amount).toFixed(2)}</p>
        <p className="flex items-center gap-3">Status <StatusBadge status={quote.booking.status} /></p>
        {quote.booking.status === "pending_payment" &&
          <button disabled={busy} className="dui-btn dui-btn-primary">
            {busy ? "Processing..." : "Confirm Payment"}
          </button>}
        {receipt && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
          <p>Payment process completed. Booking confirmed.</p>
          <p>Reference: {receipt.transactionId}</p>
          <p>{receipt.emailStatus === "sent" ? "Confirmation email sent." :
            receipt.emailStatus === "failed" ? "Booking saved, but the confirmation email could not be sent." :
            "This payment was already processed."}</p>
        </div>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
      </form>
    ) : history.length ? (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm"><table className="dui-table w-full">
        <thead><tr className="bg-gray-100">{["Booking / Slot", "Amount (BDT)", "Method", "Status", "Reference", "Date"].map(label => <th className="p-4" key={label}>{label}</th>)}</tr></thead>
        <tbody>{history.map(item => <tr className="border-t" key={item.id}>
          <td className="p-4">#{item.booking.id} / {item.booking.slotNumber}</td>
          <td className="p-4">{Number(item.amount).toFixed(2)}</td><td className="p-4">{item.paymentMethod === "demo" ? "Test payment" : item.paymentMethod || "—"}</td>
          <td className="p-4"><StatusBadge status={item.status} /></td><td className="p-4">{item.transactionId || "—"}</td>
          <td className="p-4">{new Date(item.paidAt || item.paymentDate).toLocaleString()}</td>
        </tr>)}</tbody>
      </table></div>
    ) : !error && <p className="mt-6">No payments yet.</p>}
    {error && (!bookingId || !quote) && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{error}</p>}
    {error && <button disabled={busy || loading} className="mt-3 underline" onClick={() => { setError(""); setLoading(true); setAttempt(value => value + 1); }}>Refresh details</button>}
  </section>;
}






