"use client";
import BookingList from "./BookingList";
import SummaryIllustration from "./SummaryIllustration";

import PageIntro from "./PageIntro";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import LoadingState from "./LoadingState";
import StatusBadge from "./StatusBadge";
import { z } from "zod";

type Station = { id: string; name: string; area: string; block: string; road: string; house: string };
type Slot = { slotNumber: string; available: boolean; station: Station };
type Booking = { id: number; slotNumber: string; status: string; bookingTime: string; notification?: { id: number; bookingId: number; title: string; message: string; read: boolean; createdAt: string } };
const slotSchema = z.string().trim().toUpperCase().regex(
  /^A-[1-9][0-9]*$/,
  "Invalid slot identifier. Select a slot from the list."
);
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const statusLabels: Record<string, string> = {
  pending_payment: "Pending payment", confirmed: "Confirmed",
  cancelled: "Cancelled", completed: "Completed",
};

export default function Bookings({ createMode = false, onUnauthorized }: {
  createMode?: boolean; onUnauthorized: () => void;
}) {

  const [slots, setSlots] = useState<Slot[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [stationError, setStationError] = useState("");
  const [block, setBlock] = useState("");
  const [road, setRoad] = useState("");
  const [stationId, setStationId] = useState("");
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
    axios.get<Slot[]>(apiUrl + "/user/slots", {
      params: { block: block || undefined, road: road || undefined, stationId: stationId || undefined },
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
  }, [createMode, slotAttempt, block, road, stationId]);

  useEffect(() => {
    if (!createMode) return;
    const refresh = () => { setSlotsLoading(true); setSlotAttempt((value) => value + 1); };
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setSlotAttempt(value => value + 1);
    }, 30000);
    window.addEventListener("chargehub:notification", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("chargehub:notification", refresh);
    };
  }, [createMode]);

  useEffect(() => {
    if (!createMode) return;
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");
    axios.get<Station[]>(apiUrl + "/user/stations", {
      headers: { Authorization: "Bearer " + token }, signal: controller.signal,
    }).then(({ data }) => {
      if (!controller.signal.aborted) { setStations(data); setStationError(""); }
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      if (axios.isAxiosError(cause) && cause.response?.status === 401) { onUnauthorized(); return; }
      setStationError("Unable to load locations. Reconnecting automatically.");
    });
    return () => controller.abort();
  }, [createMode, onUnauthorized, slotAttempt]);

  function changeLocation(nextBlock: string, nextRoad: string, nextStation: string) {
    setBlock(nextBlock); setRoad(nextRoad); setStationId(nextStation);
    setSelectedSlot(""); setSlots([]); setSlotsLoading(true);
    setError(""); setMessage("");
  }

  const roads = [...new Set(stations.filter(station => !block || station.block === block).map(station => station.road))];
  const visibleStations = stations.filter(station => (!block || station.block === block) && (!road || station.road === road) && (!stationId || station.id === stationId));

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError(""); setMessage("");
    if (!selectedSlot) { setError("Choose a slot before booking."); return; }
    if (slotsLoading || slotsError || !slots.some(slot => slot.slotNumber === selectedSlot && slot.available)) {
      setError("Please select an available slot from the current location."); return;
    }
    const result = slotSchema.safeParse(selectedSlot);
    if (!result.success) { setError(result.error.issues[0].message); return; }
    const headers = auth();
    if (!headers) return;
    setBusy(true);
    try {
      sessionStorage.setItem("chargehub:action", "booking");
      const { data } = await axios.post<Booking>(`${apiUrl}/user/bookings`,
        { slotNumber: result.data }, { headers });
      setSelectedSlot("");
      if (data.notification) sessionStorage.setItem("chargehub:pending-toast", JSON.stringify(data.notification));
      sessionStorage.removeItem("chargehub:action");
      window.location.assign("/user/payments/" + encodeURIComponent(String(data.id)));
    } catch (cause) {
      sessionStorage.removeItem("chargehub:action");
      showError(cause);
      setBusy(false);
      setSlotsLoading(true);
      setSlotAttempt((value) => value + 1);
    }
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
    <section className="portal-page bookings-page">
      <PageIntro title={createMode ? "Find your next spot." : "My bookings"} description={createMode ? "Choose an available charging slot and make it yours." : "Keep track of your charging plans and manage upcoming bookings."} />
      <Link className="mt-3 inline-block text-primary underline"
        href={createMode ? "/user/bookings" : "/user/bookings/new"}>
        {createMode ? "View my bookings" : "Book a slot"}
      </Link>
      {!createMode && !loading && !error && <div className="portal-summary booking-summary-art">
        <div><div><span>All bookings</span><strong>{bookings.length}</strong></div><SummaryIllustration kind="My Bookings" /></div>
        <div><div><span>Awaiting payment</span><strong>{bookings.filter(item => item.status === "pending_payment").length}</strong></div><SummaryIllustration kind="Pending Payments" /></div>
        <div><div><span>Completed sessions</span><strong>{bookings.filter(item => item.status === "completed").length}</strong></div><SummaryIllustration kind="Confirmed Bookings" /></div>
      </div>}
      {createMode ? (
        <form noValidate onSubmit={create} className="dui-card mt-6 max-w-5xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold">Find a charging location</h2>
          <p className="mt-2 text-sm text-base-content/65">Choose a garage location in Dhaka</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="dui-fieldset">
              <span className="dui-fieldset-legend">Location</span>
              <select className="dui-select w-full" value={block} disabled={busy || !stations.length}
                onChange={event => changeLocation(event.target.value, "", "")}>
                <option value="">All locations</option>
                {[...new Set(stations.map(station => station.block))].map(value => <option key={value} value={value}>{stations.find(station => station.block === value)?.area}</option>)}
              </select>
            </label>
            <label className="dui-fieldset">
              <span className="dui-fieldset-legend">Road</span>
              <select className="dui-select w-full" value={road} disabled={busy || !block}
                onChange={event => changeLocation(block, event.target.value, "")}>
                <option value="">All roads</option>
                {roads.map(value => <option key={value} value={value}>Road {value}</option>)}
              </select>
            </label>
            <label className="dui-fieldset">
              <span className="dui-fieldset-legend">Station</span>
              <select className="dui-select w-full" value={stationId} disabled={busy || !block}
                onChange={event => changeLocation(block, road, event.target.value)}>
                <option value="">All stations</option>
                {stations.filter(station => (!block || station.block === block) && (!road || station.road === road)).map(station =>
                  <option key={station.id} value={station.id}>{station.name} · House {station.house}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-5 text-xs text-base-content/60">Light green: available · Gray: booked · Solid green: selected</p>
          {slotsLoading && <p role="status" className="mt-3">Loading availability...</p>}
          {!slotsLoading && !slotsError && <p className="mt-3 text-sm">{slots.filter(slot => slot.available).length} of {slots.length} slots available in this selection</p>}
          {!slotsLoading && !slotsError && visibleStations.map(station => {
            const stationSlots = slots.filter(slot => slot.station.id === station.id);
            return (
              <section key={station.id} className="mt-5 rounded-2xl border border-base-300 p-4 sm:p-5" aria-label={station.name}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{station.name}</h3>
                    <p className="mt-1 text-sm text-base-content/60">{station.area} · Road {station.road} · House {station.house}</p>
                  </div>
                  <span className="dui-badge dui-badge-soft dui-badge-success">{stationSlots.filter(slot => slot.available).length} available</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {stationSlots.map(slot => (
                    <button key={slot.slotNumber} type="button"
                      disabled={!slot.available || busy}
                      aria-pressed={selectedSlot === slot.slotNumber}
                      onClick={() => { setSelectedSlot(slot.slotNumber); setError(""); setMessage(""); }}
                      className={"dui-btn h-auto min-h-20 flex-col gap-1 rounded-xl p-3 text-center shadow-none disabled:cursor-not-allowed " +
                        (!slot.available ? "border-gray-300 bg-gray-100 text-gray-500" :
                        selectedSlot === slot.slotNumber ? "border-primary bg-primary text-white" :
                        "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-primary hover:bg-emerald-100")}>
                      <span className="font-semibold">{slot.slotNumber}</span>
                      <span className="text-xs">{!slot.available ? "Booked" : selectedSlot === slot.slotNumber ? "Selected" : "Available"}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
          {!slotsLoading && !slotsError && !visibleStations.length && <p className="mt-4">No stations found for this location.</p>}
          <p className="mt-4">{selectedSlot ? "Selected slot: " + selectedSlot : "Choose an available slot above."}</p>
          <button disabled={busy || slotsLoading || !!slotsError || !slots.some((slot) => slot.available)}
            className="dui-btn dui-btn-primary mt-5">
            {busy ? "Booking..." : "Book Slot"}
          </button>
          {stationError && <p role="alert" className="mt-4 text-sm text-red-700">{stationError}</p>}
          {slotsError && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{slotsError}</p>}
          {error && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{error}</p>}
          {message && <p role="status" className="dui-alert dui-alert-success dui-alert-soft mt-4 text-sm">{message}</p>}
        </form>
      ) : (
        <>
          {loading ? <LoadingState text="Loading bookings..." /> : (
            bookings.length ? <BookingList bookings={bookings} busy={busy} cancelId={cancelId} onCancel={cancel} onConfirm={setCancelId} /> : !error && <div className="portal-empty"><h2>Your next journey starts here</h2><p>Choose a location and reserve your first charging slot.</p><Link href="/user/bookings/new" className="dui-btn dui-btn-primary">Find a slot</Link></div>
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



















