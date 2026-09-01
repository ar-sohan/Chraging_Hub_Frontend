"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import FormMessage from "./FormMessage";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (!result.success) {
      setIsError(true);
      setMessage(result.error.issues[0].message);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/user/login`,
        result.data
      );
      const data = response.data;
      localStorage.setItem("accessToken", data.access_token);
      setIsError(false);
      setMessage("Login successful");
      router.push("/user/dashboard");
    } catch (error) {
      setIsError(true);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        setMessage(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage || "Login failed");
      } else {
        setMessage("Login failed");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center gap-5">
        <label className="text-xl font-semibold" htmlFor="email">Email</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="email" name="email" id="email" placeholder="example@example.com" />
      </div>
      <br />
      <div className="flex justify-between items-center gap-5">
        <label className="text-xl font-semibold" htmlFor="password">Password</label>
        <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="password" id="password" placeholder="Password" />
      </div>
      <br />
      <div className="flex justify-center">
        <button className="btn bg-indigo-500 text-white p-3 rounded-xl" type="submit">Login</button>
      </div>
      <FormMessage message={message} isError={isError} />
    </form>
  );
}
