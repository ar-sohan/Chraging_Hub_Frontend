"use client";
import PageIntro from "../components/PageIntro";

import Link from "next/link";
import ProtectedUserPage from "../components/ProtectedUserPage";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <ProtectedUserPage>
      {(user, _, logout) => (
        <div className="mx-auto my-8 w-full max-w-md">
          <PageIntro title="Keep it secure." description="Choose a new password to protect your account." eyebrow="CHANGE PASSWORD" />
          <ChangePasswordForm userId={user.id} onUnauthorized={logout} />
          <div className="mt-5 text-center">
            <Link href={"/user/profile/" + user.id} className="font-medium text-primary hover:underline">Back to Profile</Link>
          </div>
        </div>
      )}
    </ProtectedUserPage>
  );
}


