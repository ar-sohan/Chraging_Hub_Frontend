import Link from "next/link";
export default function BookingNotFound() {
  return (
    <section data-theme="light" className="ev-green mx-auto my-12 max-w-md px-6 text-center">
      <div className="dui-card border border-base-300 bg-base-100 p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-widest text-primary">404</p>
        <h1 className="mt-3 text-2xl font-bold">Booking not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-base-content/65">This booking is unavailable or does not belong to your account.</p>
        <Link href="/user/bookings" className="dui-btn dui-btn-primary mt-6">My Bookings</Link>
      </div>
    </section>
  );
}
