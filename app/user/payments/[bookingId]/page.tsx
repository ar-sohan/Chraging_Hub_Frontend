"use client";
import { useParams } from "next/navigation";
import ProtectedUserPage from "../../components/ProtectedUserPage";
import Payments from "../../components/Payments";
export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  return <ProtectedUserPage>{(_, __, logout) => <Payments bookingId={bookingId} onUnauthorized={logout} />}</ProtectedUserPage>;
}
