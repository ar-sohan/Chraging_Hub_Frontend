"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import FormMessage from "./FormMessage";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^01\d{9}$/, "Enter an 11-digit Bangladesh phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  age: z.coerce.number().int().min(18, "Age must be at least 18").max(100),
  gender: z.enum(["male", "female"], { message: "Select a gender" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegistrationForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const result = registrationSchema.safeParse(Object.fromEntries(form));

    if (!result.success) {
      setIsError(true);
      setMessage(result.error.issues[0].message);
      return;
    }

    const { confirmPassword, ...user } = result.data;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/user/register`,
        user
      );
      setIsError(false);
      formElement.reset();
      router.push("/user/login");
    } catch (error) {
      setIsError(true);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        setMessage(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage || "Registration failed");
      } else {
        setMessage("Registration failed");
      }
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <fieldset className="dui-fieldset w-full rounded-box border border-base-300 bg-base-200 p-4 sm:p-5">
        <legend className="dui-fieldset-legend">Personal details</legend>
        <label className="dui-label" htmlFor="fullName">Full name</label>
        <input className="dui-input w-full" type="text" name="fullName" id="fullName" placeholder="Your full name" autoComplete="name" />

        <label className="dui-label mt-3" htmlFor="email">Email</label>
        <input className="dui-input w-full" type="email" name="email" id="email" placeholder="example@example.com" autoComplete="email" />

        <label className="dui-label mt-3" htmlFor="phone">Phone</label>
        <input className="dui-input w-full" type="tel" name="phone" id="phone" placeholder="01XXXXXXXXX" autoComplete="tel" />

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="dui-label" htmlFor="age">Age</label>
            <input className="dui-input w-full" type="number" name="age" id="age" placeholder="Your age" />
          </div>
          <div className="grid gap-2">
            <label className="dui-label" htmlFor="gender">Gender</label>
            <select className="dui-select w-full" name="gender" id="gender" defaultValue="">
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <label className="dui-label mt-3" htmlFor="password">Password</label>
        <input className="dui-input w-full" type="password" name="password" id="password" placeholder="Create a password" autoComplete="new-password" />

        <label className="dui-label mt-3" htmlFor="confirmPassword">Confirm password</label>
        <input className="dui-input w-full" type="password" name="confirmPassword" id="confirmPassword" placeholder="Re-enter your password" autoComplete="new-password" />

        <div className="dui-card-actions mt-5">
          <button className="dui-btn dui-btn-primary w-full" type="submit">Create account</button>
        </div>
        <FormMessage message={message} isError={isError} />
      </fieldset>
    </form>
  );
}
