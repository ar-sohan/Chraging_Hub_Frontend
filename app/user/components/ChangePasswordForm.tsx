"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters").max(20, "Current password must be at most 20 characters"),
  password: z.string().min(6, "New password must be at least 6 characters").max(20, "New password must be at most 20 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine(values => values.password === values.confirmPassword, {
  message: "New passwords do not match", path: ["confirmPassword"],
}).refine(values => values.currentPassword !== values.password, {
  message: "New password must be different from your current password", path: ["password"],
});

export default function ChangePasswordForm({ userId, onUnauthorized }: {
  userId: number; onUnauthorized: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(""); setMessage("");
    const form = event.currentTarget;
    const result = passwordSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) { setError(result.error.issues[0].message); return; }
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return; }
    setBusy(true);
    try {
      await axios.patch(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") + "/user/" + userId + "/password",
        { currentPassword: result.data.currentPassword, password: result.data.password },
        { headers: { Authorization: "Bearer " + token } },
      );
      form.reset();
      setMessage("Password changed successfully. Use your new password next time you log in.");
    } catch (cause) {
      if (axios.isAxiosError(cause)) {
        const detail = cause.response?.data?.message;
        // The backend also returns 401 for an incorrect current password.
        if (cause.response?.status === 401 && detail !== "Current password is incorrect") {
          onUnauthorized();
          return;
        }
        setError(Array.isArray(detail) ? detail.join(" ") : typeof detail === "string" ? detail :
          cause.response ? "Unable to change password. Please try again." : "Cannot connect to the backend. Please try again.");
      } else setError("Unable to change password. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <section className="mt-6">

      <form noValidate onSubmit={submit} className="dui-card mt-4 border border-base-300 bg-base-100 p-6 shadow-sm">
        <fieldset disabled={busy} className="space-y-4">
          <label className="block" htmlFor="current-password">Current Password
            <input id="current-password" name="currentPassword" type="password" autoComplete="current-password"
              className="dui-input mt-2 w-full" />
          </label>
          <label className="block" htmlFor="new-password">New Password
            <input id="new-password" name="password" type="password" autoComplete="new-password"
              className="dui-input mt-2 w-full" />
          </label>
          <p className="text-sm text-base-content/65">Use 6–20 characters.</p>
          <label className="block" htmlFor="confirm-new-password">Confirm Password
            <input id="confirm-new-password" name="confirmPassword" type="password" autoComplete="new-password"
              className="dui-input mt-2 w-full" />
          </label>
          <button type="submit" className="dui-btn dui-btn-primary">
            {busy ? "Changing..." : "Change Password"}
          </button>
        </fieldset>
        {error && <p role="alert" className="dui-alert dui-alert-error dui-alert-soft mt-4 text-sm">{error}</p>}
        {message && <p role="status" className="dui-alert dui-alert-success dui-alert-soft mt-4 text-sm">{message}</p>}
      </form>
    </section>
  );
}


