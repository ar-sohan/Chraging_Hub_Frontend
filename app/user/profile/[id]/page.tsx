"use client";

import ProtectedUserPage from "../../components/ProtectedUserPage";

import ProfileDetails from "../../components/ProfileDetails";

export default function Profile() {
  return (
    <ProtectedUserPage>
      {(user, updateUser, logout) => (
        <div data-theme="light" className="ev-green">
          <ProfileDetails user={user} onSaved={updateUser} onUnauthorized={logout} />
        </div>
      )}
    </ProtectedUserPage>
  );
}




