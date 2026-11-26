"use client";
import { useParams } from "next/navigation";
import ProtectedUserPage from "../../components/ProtectedUserPage";
import BookingDetails from "../../components/BookingDetails";

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <ProtectedUserPage>
      {(_, __, logout) => <BookingDetails key={id} id={id} onUnauthorized={logout} />}
    </ProtectedUserPage>
  );
}
