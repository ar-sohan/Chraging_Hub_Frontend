"use client";
import ProtectedUserPage from "../components/ProtectedUserPage";
import Payments from "../components/Payments";
export default function PaymentHistory() {
  return <ProtectedUserPage>{(_, __, logout) => <Payments onUnauthorized={logout} />}</ProtectedUserPage>;
}
