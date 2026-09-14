'use client';
import Link from 'next/link'
import Nav from './Nav'
import Carousal from './carousal'
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';


export default function Header() {

    const [toast, setToast] = useState('');

    useEffect(() => {
        const pusher = new Pusher('YOUR_KEY', { cluster: 'YOUR_CLUSTER' });
        const channel = pusher.subscribe('admin-channel');

        channel.bind('user-created', (data: { message: string }) => {
            setToast(data.message);
            setTimeout(() => setToast(''), 5000);         
        });

        return () => {
            pusher.unsubscribe('admin-channel');
        };
    }, []);



    return (
        <>
            {
                toast && (
                    <div className="toast toast-top toast-end z-50">
                        <div className="alert alert-info">
                            <span>{toast}</span>
                        </div>
                    </div>
                )
            }
            <h1 className="text-3xl text-center font-bold">About Us</h1>
            {/* <Carousal></Carousal> */}
        </>
    )
}
