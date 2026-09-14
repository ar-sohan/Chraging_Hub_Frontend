'use client';

import Link from 'next/link';
import { SetStateAction, useState, FormEvent } from 'react';
import { z } from "zod";
import { useRouter } from 'next/navigation';
import axios from 'axios';


const loginAdminSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email")
    .regex(/aiub\.edu$/i, "Email must be an aiub.edu address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginAdminData = z.infer<typeof loginAdminSchema>;

async function loginAdmin(data: LoginAdminData) {
  try {
    const response = await axios.post(
      "http://localhost:3000/admin/login",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e:
    {
      target: { value: SetStateAction<string>; };
    }) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginAdminSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input");
      return;
    }

    try {
      const data = await loginAdmin(result.data);

      console.log("Login successful:", data);

      setEmail("");
      setPassword("");
      setError("");

      router.push("/admin/dashboard");

    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <div className="flex flex-col m-10 justify-center items-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <div className="my-8">
          <form action="" onSubmit={handleSubmit}>

            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="email">Email </label>
              <input value={email} onChange={handleEmailChange} className="my-4 border-2 border-indigo-400 p-2 rounded" type="email" name="email" id="email" placeholder="Email" />
            </div>
            <br />

            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="password">Password</label>
              <input value={password} onChange={handlePasswordChange} className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="password" id="password" placeholder="Password" />
            </div>
            <br />

            <div className="flex justify-center">
              <button className="btn bg-indigo-500 text-white p-3 rounded-xl" type="submit">Login</button>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <div className='flex justify-center mt-3'>
              <p>Don't Have an Account! <Link href="/admin/createAdmin" className='text-indigo-700 font-semibold'>Register</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}