// components/LandingLogin.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LandingLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.access_token);
      const adminRes = await axios.get('http://localhost:3000/admin', {
        params: { email },
        headers: { Authorization: `Bearer ${res.data.access_token}` },
      });
      const adminId = Array.isArray(adminRes.data) ? adminRes.data[0].id : adminRes.data.id;
      localStorage.setItem('adminId', adminId);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleLogin} className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </div>
    </div>
  );
}