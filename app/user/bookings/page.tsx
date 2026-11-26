"use client";
import ProtectedUserPage from "../components/ProtectedUserPage";
import Bookings from "../components/Bookings";

export default function BookingsPage() {
  return <ProtectedUserPage>{(_, __, logout) => <Bookings onUnauthorized={logout} />}</ProtectedUserPage>;
}
