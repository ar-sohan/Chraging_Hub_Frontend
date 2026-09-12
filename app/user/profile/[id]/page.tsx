"use client";

import ProtectedUserPage from "../../components/ProtectedUserPage";
import Link from "next/link";
import ProfileDetails from "../../components/ProfileDetails";

export default function Profile() {
  return (
    <ProtectedUserPage>
      {(user, updateUser, logout) => (
        <div data-theme="light" className="ev-green">
          <ProfileDetails user={user} onSaved={updateUser} onUnauthorized={logout} />
          <Link href="/user/change-password" className="dui-btn dui-btn-ghost mt-4 text-primary">Change Password</Link>
        </div>
      )}
    </ProtectedUserPage>
  );
}



