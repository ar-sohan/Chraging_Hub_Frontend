"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import Link from "next/link";

type Notice = { id: number; bookingId: number; title: string; message: string; read: boolean; createdAt: string };
const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function NotificationBell({ userId, onUnauthorized }: {
  userId: number; onUnauthorized?: () => void;
}) {
  const [toast, setToast] = useState<Notice | null>(null);
  const received = useRef(new Set<number>());
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    function show(event: Event) {
      const notice = (event as CustomEvent<Notice>).detail;
      if (!notice || !Number.isSafeInteger(notice.id) || received.current.has(notice.id)) return;
      received.current.add(notice.id);
      setToast(notice);
      setItems(items => [notice, ...items.filter(item => item.id !== notice.id)]);
    }
    window.addEventListener("chargehub:toast", show);
    const pending = sessionStorage.getItem("chargehub:pending-toast");
    if (pending) {
      sessionStorage.removeItem("chargehub:pending-toast");
      try { show(new CustomEvent("chargehub:toast", { detail: JSON.parse(pending) })); } catch {}
    }
    return () => window.removeEventListener("chargehub:toast", show);
  }, []);
  const [items, setItems] = useState<Notice[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const headers = { Authorization: "Bearer " + token };
    const load = () => {
      axios.get<Notice[]>(base + "/user/notifications", { headers, signal: controller.signal })
        .then(({ data }) => {
          if (controller.signal.aborted) return;
          setItems(current => {
            const merged = new Map(current.map(item => [item.id, item]));
            data.forEach(item => merged.set(item.id, item));
            return [...merged.values()].sort((a, b) => b.id - a.id).slice(0, 50);
          });
          setError("");
        }).catch((cause: unknown) => {
          if (controller.signal.aborted) return;
          if (axios.isAxiosError(cause) && cause.response?.status === 401) { onUnauthorized?.(); return; }
          setError("Unable to load notifications.");
        });
    };
    load();
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) {
      setError("Notifications are not configured.");
      return () => controller.abort();
    }
    const pusher = new Pusher(key, {
      cluster,
      forceTLS: true,
      channelAuthorization: {
        endpoint: base + "/user/notifications/auth",
        transport: "ajax",
        customHandler: ({ socketId, channelName }, callback) => {
          axios.post(base + "/user/notifications/auth",
            { socket_id: socketId, channel_name: channelName },
            { headers, signal: controller.signal })
            .then(({ data }) => { if (!controller.signal.aborted) callback(null, data); })
            .catch((cause: unknown) => {
              if (controller.signal.aborted) return;
              if (axios.isAxiosError(cause) && cause.response?.status === 401) onUnauthorized?.();
              callback(new Error("Notification authorization failed"), null);
            });
        },
      },
    });
    const channelName = "private-user-" + userId;
    const channel = pusher.subscribe(channelName);
    channel.bind("pusher:subscription_succeeded", () => { setReady(true); load(); });
    channel.bind("pusher:subscription_error", () => { setReady(false); setError("Notification connection failed. Reload to reconnect."); });
    channel.bind("notification", (notice: Notice) => {
      if (!Number.isSafeInteger(notice.id) || !Number.isSafeInteger(notice.bookingId)) return;
      const waiting = sessionStorage.getItem("chargehub:action");
      const defer = (waiting === "booking" && notice.title === "Booking successful") || (waiting === "payment" && notice.title === "Payment successful");
      if (!defer && !received.current.has(notice.id)) {
        received.current.add(notice.id);
        setToast(notice);
      }
      setItems(current => [notice, ...current.filter(item => item.id !== notice.id)].sort((a, b) => b.id - a.id).slice(0, 50));
      window.dispatchEvent(new Event("chargehub:notification"));
    });
    pusher.connection.bind("state_change", ({ current }: { current: string }) => {
      if (current !== "connected") setReady(false);
    });
    window.addEventListener("focus", load);
    return () => {
      controller.abort();
      window.removeEventListener("focus", load);
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.connection.unbind_all();
      pusher.disconnect();
    };
  }, [userId, onUnauthorized]);

  async function markRead(id: number) {
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized?.(); return; }
    try {
      await axios.patch(base + "/user/notifications/" + id + "/read", {},
        { headers: { Authorization: "Bearer " + token } });
      setItems(current => current.map(item => item.id === id ? { ...item, read: true } : item));
    } catch (cause) {
      if (axios.isAxiosError(cause) && cause.response?.status === 401) { onUnauthorized?.(); return; }
      setError("Unable to mark notification as read.");
    }
  }

  const unread = items.filter(item => !item.read).length;
  return (
    <>
    <details className="relative">
      <summary aria-label={"Notifications, " + unread + " unread"}
        className="notification-nav relative flex size-12 cursor-pointer list-none items-center justify-center rounded-lg text-base-content/60 hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
        <svg className="size-6 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
        {unread > 0 && <span className="dui-badge dui-badge-primary dui-badge-sm absolute -right-1 top-0">{unread}</span>}
        <span className="notification-nav-label">Notifications</span>
      </summary>
      <div className="absolute right-0 z-50 mt-3 max-h-[70vh] w-80 max-w-[85vw] overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-1 text-xs text-gray-500">{ready ? "Connected" : "Connecting..."}</p>
        {!items.length && <p className="py-5 text-sm text-gray-500">No notifications yet.</p>}
        <ul className="mt-3 space-y-3">
          {items.map(item => <li key={item.id} className={"rounded-lg p-3 " + (item.read ? "bg-gray-50" : "bg-emerald-50")}>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-base-content/65">{item.message}</p>
            <time className="mt-2 block text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</time>
            <div className="mt-2 flex gap-3 text-xs">
              <Link href={"/user/bookings/" + item.bookingId} className="text-primary underline">View booking</Link>
              {!item.read && <button onClick={() => markRead(item.id)} className="dui-btn dui-btn-ghost dui-btn-xs text-primary">Mark read</button>}
            </div>
          </li>)}
        </ul>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </div>
      <span role="status" className="sr-only">{unread} unread notifications</span>
    </details>
    {toast && <div className="notification-popup" role="status" aria-live="polite" aria-atomic="true">
      <div className="notification-popup-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{toast.title}</p>
        <p className="mt-1 text-sm leading-6 text-base-content/70">{toast.message}</p>
        <Link className="mt-2 inline-block text-sm font-semibold text-primary underline" href={"/user/bookings/" + toast.bookingId} onClick={() => setToast(null)}>View booking</Link>
      </div>
      <button type="button" className="dui-btn dui-btn-ghost dui-btn-sm" aria-label="Dismiss notification" onClick={() => setToast(null)}>×</button>
    </div>}
    </>
  );
}






