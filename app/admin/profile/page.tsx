'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';

type Admin = {
    id: number;
    name: string;
    email: string;
};

export default function Profile() {
    const [admin, setAdmin] = useState<Admin | null>(null);

    useEffect(() => {
        const adminId = localStorage.getItem('adminId');
        const token = localStorage.getItem('adminToken');

        axios.get(`http://localhost:3000/admin/${adminId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setAdmin(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!admin) return <p>Loading...</p>;

    return (
        <>
            <div className='m-5'><Header /></div>
            <div className="flex flex-col justify-center items-center my-10">
                <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>
                <div className="card w-96 bg-base-100 shadow-md p-6">
                    <p><span className="font-semibold">Name:</span> {admin.name}</p>
                    <p><span className="font-semibold">Email:</span> {admin.email}</p>
                    <p><span className="font-semibold">Admin ID:</span> {admin.id}</p>
                </div>
            </div>
            <div><Footer /></div>
        </>
    );
}