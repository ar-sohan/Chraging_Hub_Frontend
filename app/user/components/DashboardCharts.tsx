import ChargingStatus from "./ChargingStatus";

type Booking = { bookingTime: string };
type Slot = { available: boolean };

export default function DashboardCharts({ bookings, slots }: { bookings: Booking[]; slots: Slot[] }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index);
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      full: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: bookings.filter(booking => {
        const time = new Date(booking.bookingTime).getTime();
        return time >= date.getTime() && time < next.getTime();
      }).length,
    };
  });
  const maximum = Math.max(1, ...days.map(day => day.count));
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const available = slots.filter(slot => slot.available).length;
  const percent = slots.length ? Math.round(available / slots.length * 100) : 0;

  return (
    <div className="dashboard-charts">
      <section className="dui-card border border-base-300 bg-base-100 p-6 sm:p-7" aria-labelledby="activity-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="activity-title" className="text-lg font-semibold">Booking activity</h2>
            <p className="mt-1 text-sm text-base-content/55">Your bookings created over the last 7 days</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">Last 7 days</span>
        </div>
        <p className="mt-5 text-3xl font-semibold tracking-tight">{total}<span className="ml-2 text-sm font-normal text-base-content/55">bookings</span></p>
        <div className="dashboard-bars mt-6 grid h-44 grid-cols-7 items-end gap-2 border-b border-base-300 sm:gap-5" role="img"
          aria-label={days.map(day => day.full + ": " + day.count + " bookings").join(", ")}>
          {days.map((day, index) => (
            <div key={day.full} className="flex h-full flex-col justify-end items-center gap-2" title={day.full + ": " + day.count + " bookings"}>
              <span className="text-xs font-medium text-base-content/65">{day.count}</span>
              <div className={"w-full max-w-12 rounded-t-lg " + (index === 6 ? "bg-emerald-700" : "bg-emerald-200")}
                style={{ height: day.count ? (day.count / maximum * 125) + "px" : "2px" }} />
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-base-content/55 sm:gap-5" aria-hidden="true">
          {days.map(day => <span key={day.full}>{day.label}</span>)}
        </div>
        {total === 0 && <p className="mt-4 text-sm text-base-content/55">No bookings in the last 7 days.</p>}
      </section>
      <ChargingStatus />
    </div>
  );
}



