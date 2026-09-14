'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    isApproved: boolean;
};

export default function PaymentDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<ManagedUser | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

    const fetchUser = () => {
        axios.get(`http://localhost:3000/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => setUser(res.data));
    };

    useEffect(() => { fetchUser(); }, [id]);

    const handleApprove = async () => {
        await axios.patch(`http://localhost:3000/admin/user/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchUser();
    };

    const handleStatus = async (value: string) => {
        await axios.patch(`http://localhost:3000/admin/user/${id}/status`, {}, {
            params: { value },
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchUser();
    };

    const handleDelete = async () => {
        await axios.delete(`http://localhost:3000/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        router.push('/admin/manage_payments');
    };

    if (!user) return <p>Loading...</p>;

    return (
        <>
            <Nav></Nav>
            <div className="m-10">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Status: {user.status}</p>
                <p>Approved: {user.isApproved ? 'Yes' : 'No'}</p>

                <div className="flex gap-3 mt-5">
                    <button onClick={handleApprove} className="bg-green-500 text-white px-3 py-2 rounded">Approve</button>
                    <button onClick={() => handleStatus('suspended')} className="bg-yellow-500 text-white px-3 py-2 rounded">Suspend</button>
                    <button onClick={() => handleStatus('active')} className="bg-blue-500 text-white px-3 py-2 rounded">Reactivate</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-2 rounded">Delete</button>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}
