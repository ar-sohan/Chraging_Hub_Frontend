"use client";
import ProtectedUserPage from "../../components/ProtectedUserPage";
import Bookings from "../../components/Bookings";

export default function NewBookingPage() {
  return <ProtectedUserPage>{(_, __, logout) => <Bookings createMode onUnauthorized={logout} />}</ProtectedUserPage>;
}
