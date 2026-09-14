"use client";
import Link from 'next/link';
import { z } from "zod";
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const createAdminSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),

  email: z
    .string()
    .email("Enter a valid email")
    .regex(/aiub\.edu$/i, "Email must be an aiub.edu address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter"),

  gender: z.enum(["male", "female"], {
    message: "Gender must be male or female",
  }),

  phone: z
    .string()
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
});

type CreateAdminData = z.infer<typeof createAdminSchema>;

async function createAdmin(data: CreateAdminData) {
  try {
    const response = await axios.post(
      "http://localhost:3000/admin/create",
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}

export default function Registration() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();

  const result = createAdminSchema.safeParse({
    fullName: fullName,
    email: email,
    password: password,
    gender: gender,
    phone: phone,
  });

  if (!result.success) {
    setError(result.error.issues[0]?.message || "Invalid input");
    return;
  }

  try {
    await createAdmin(result.data);
    console.log("Admin created successfully");

    setFullName("");
    setEmail("");
    setPassword("");
    setGender("");
    setPhone("");
    setError("");

    router.push("/admin/login");

  } catch (error) {
    setError("Failed to create admin");
  }
};

  return (
    <>
      <div className="flex flex-col m-10 justify-center items-center">
        <h1 className="text-3xl font-bold">Registration</h1>
        <div className="border-2 border-indigo-300 m-4 p-6 rounded-xl">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form action="" method="post" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="fullName">Username </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="fullName" id="fullName" placeholder="Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="email">Email </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="password">Password </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="gender">Gender </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="gender" id="gender" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="phone">Phone </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="phone" id="phone" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex justify-center items-center gap-5">
              <button className="btn btn-active btn-primary" type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}