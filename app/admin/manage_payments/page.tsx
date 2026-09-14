import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer';

export default function ManagePayments() {
  const users = [
    { id: 1, name: "John", status: "active" },
    { id: 2, name: "Alice", status: "active" },
    { id: 3, name: "Bob", status: "inactive" },
    { id: 4, name: "Sohan", status: "banned" },
  ];

  return (
    <>
      <div className='m-5'>
        <Header></Header>
      </div>

      <div className='m-5'>
        <div className="flex flex-col justify-center items-center my-10">
          <h1 className="text-2xl font-semibold">Welcome to Manage Payments</h1>
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
                        <Link href={`/admin/payments_details/${user.id}`}>
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