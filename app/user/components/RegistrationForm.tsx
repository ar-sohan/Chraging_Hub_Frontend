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
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="fullName">Name</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="fullName" id="fullName" placeholder="Name" />
      </div>
      <br />

      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="email">Email</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="email" name="email" id="email" placeholder="example@example.com" />
      </div>
      <br />

      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="phone">Phone</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="phone" id="phone" placeholder="01XXXXXXXXX" />
      </div>
      <br />

      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="age">Age</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="number" name="age" id="age" placeholder="Age" />
      </div>
      <br />

      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="gender">Gender</label>
        <select className="my-4 border-2 border-indigo-400 p-2 rounded" name="gender" id="gender" defaultValue="">
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <br />

      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="password">Password</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="password" id="password" placeholder="Password" />
      </div>
      <br />

      <div className="flex justify-between items-center">
        <label className="text-xl font-semibold mr-4" htmlFor="confirmPassword">Confirm Password</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
      </div>
      <br />

      <div className="flex justify-center">
        <button className="btn bg-indigo-500 text-white p-3 rounded-xl" type="submit">Register</button>
      </div>
      <FormMessage message={message} isError={isError} />
    </form>
  );
}
