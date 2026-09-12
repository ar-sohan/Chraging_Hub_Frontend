"use client";
import PageIntro from "./PageIntro";

import { FormEvent, useState } from "react";
import axios from "axios";
import { z } from "zod";
import type { CurrentUser } from "./ProtectedUserPage";

const schema = z.object({
  fullName: z.string().trim().min(3, "Name must have at least 3 characters").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().regex(/^01\d{9}$/, "Enter an 11-digit phone number starting with 01"),
  age: z.coerce.number().int().min(18).max(100),
  gender: z.enum(["male", "female"]),
});

export default function ProfileDetails({ user, onSaved, onUnauthorized }: {
  user: CurrentUser;
  onSaved: (user: CurrentUser) => void;
  onUnauthorized: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setMessage("");
    const parsed = schema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) { onUnauthorized(); return; }
    setSaving(true);
    try {
      const { data } = await axios.put<CurrentUser>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/user/${user.id}`,
        parsed.data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (localStorage.getItem("accessToken") !== token) return;
      onSaved(data);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        if (requestError.response?.status === 401) { onUnauthorized(); return; }
        const detail = requestError.response?.data?.message;
        setError(Array.isArray(detail) ? detail.join(" ") :
          typeof detail === "string" ? detail : "Unable to save profile. Please try again.");
      } else {
        setError("Unable to save profile. Please try again.");
      }
    } finally { setSaving(false); }
  }

  const inputClass = "dui-input mt-1 w-full";
  return (
    <section className="max-w-xl">
      <PageIntro title="Make it yours." description="Keep your driver profile up to date." eyebrow="MY PROFILE" />
      {editing ? (
        <form noValidate onSubmit={save} className="dui-card mt-6 border border-base-300 bg-base-100 shadow-sm">
          <fieldset disabled={saving} className="dui-card-body gap-4 p-6">
            <legend className="mb-4 text-xl font-semibold">Edit Profile</legend>
            <label className="block" htmlFor="profile-name">Name
              <input className={inputClass} id="profile-name" name="fullName" defaultValue={user.fullName} autoComplete="name" />
            </label>
            <label className="block" htmlFor="profile-email">Email
              <input className={inputClass} id="profile-email" name="email" type="email" defaultValue={user.email} autoComplete="email" />
            </label>
            <label className="block" htmlFor="profile-phone">Phone
              <input className={inputClass} id="profile-phone" name="phone" type="tel" defaultValue={user.phone || ""} autoComplete="tel" />
            </label>
            <label className="block" htmlFor="profile-age">Age
              <input className={inputClass} id="profile-age" name="age" type="number" defaultValue={user.age} />
            </label>
            <label className="block" htmlFor="profile-gender">Gender
              <select className="dui-select mt-1 w-full" id="profile-gender" name="gender" defaultValue={user.gender}>
                <option value="male">Male</option><option value="female">Female</option>
              </select>
            </label>
            <div className="dui-card-actions mt-2 gap-3">
              <button className="dui-btn dui-btn-primary" type="submit">{saving ? "Saving..." : "Save Changes"}</button>
              <button className="dui-btn dui-btn-ghost" type="button" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
            </div>
          </fieldset>
          {error && <p role="alert" className="px-6 pb-6 text-red-700">{error}</p>}
        </form>
      ) : (
        <div className="dui-card mt-6 border border-base-300 bg-base-100 shadow-sm"><div className="dui-card-body p-6">
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="font-semibold">Name</dt><dd className="break-words">{user.fullName}</dd>
            <dt className="font-semibold">Email</dt><dd className="break-all">{user.email}</dd>
            <dt className="font-semibold">Phone</dt><dd>{user.phone || "Not provided"}</dd>
            <dt className="font-semibold">Age</dt><dd>{user.age}</dd>
            <dt className="font-semibold">Gender</dt><dd className="capitalize">{user.gender}</dd>
          </dl>
          <div className="dui-card-actions mt-5"><button className="dui-btn dui-btn-primary" onClick={() => { setEditing(true); setMessage(""); setError(""); }}>Edit Profile</button></div>
        </div></div>
      )}
      {message && <p role="status" className="mt-4 text-green-700">{message}</p>}
    </section>
  );
}




