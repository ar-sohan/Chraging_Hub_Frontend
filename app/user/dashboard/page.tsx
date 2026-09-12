"use client";

import ProtectedUserPage from "../components/ProtectedUserPage";
import DashboardSummary from "../components/DashboardSummary";

export default function Dashboard() {
  return (
    <ProtectedUserPage>
      {(user, _, logout) => <DashboardSummary name={user.fullName} onUnauthorized={logout} />}
    </ProtectedUserPage>
  );
}
