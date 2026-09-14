'use client';

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer';
import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';

type ManagedUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isApproved: boolean;
};

export default function ManageTechnician() {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');

    const fetchTechnicians = () => {
      const adminId = localStorage.getItem('adminId');
      const token = localStorage.getItem('adminToken');
      setLoading(true);
      axios.get(`http://localhost:3000/admin/${adminId}/users`, {
        params: { role: 'technician' },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setUsers(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTechnicians(); }, []);

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError('');
      const adminId = localStorage.getItem('adminId');
      const token = localStorage.getItem('adminToken');

      try {
        await axios.post(`http://localhost:3000/admin/${adminId}/user`,
          { name, email, role: 'technician' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setName('');
        setEmail('');
        fetchTechnicians();
      } catch (err) {
        setFormError('Could not create technician — check the email is unique.');
      }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className='m-5'>
                <Header></Header>
            </div>

            <div className='m-5'>
                <div className="flex flex-col justify-center items-center my-10">
                    <h1 className="text-2xl font-semibold">Welcome to Manage Technician</h1>

                    <form onSubmit={handleCreate} className="flex gap-3 items-center justify-center my-5">
                      <input
                        className="input input-bordered"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <input
                        className="input input-bordered"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button className="btn bg-indigo-500 text-white" type="submit">
                        Add Technician
                      </button>
                    </form>
                    {formError && <p className="text-red-500 text-center">{formError}</p>}

                    <div className="w-3/4 mt-10 rounded-lg border border-gray-200 shadow-sm">
                        <h1 className='text-center text-2xl font-semibold text-gray-700 my-3'>Users</h1>
                        <table className="w-full table-auto border-separate bg-white text-sm text-gray-500 text-center">
                            <thead className="bg-gray-50 font-semibold uppercase text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Id</th>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                                            <td className="px-6 py-4">{user.name}</td>
                                            <td className="px-6 py-4">
                                                <span>{user.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/technician_details/${user.id}`}>
                                                    <span className='px-3 py-2 bg-blue-200 text-blue-700 rounded-full border border-blue-600'>Details</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <Footer></Footer>
            </div>
        </>
    );
}
