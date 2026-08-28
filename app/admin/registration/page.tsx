import Link from 'next/link';


export default function Registration() {
  return (
    <>
      <div className="flex flex-col m-10 justify-center items-center">
        <h1 className="text-3xl font-bold">Registration</h1>
        <div className="border-2 border-indigo-300 m-4 p-6 rounded-xl">

          <form action="">
            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold mr-4" htmlFor="name">Name </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="name" id="name" placeholder="Name" />
            </div>
            <br />

            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold mr-4" htmlFor="uname">Username </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="uname" id="uname" placeholder="User Name" />
            </div>
            <br />

            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold mr-4" htmlFor="email">Email</label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="email" name="email" id="email" placeholder="example@example.com" />
            </div>
            <br />

            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold mr-4" htmlFor="password">Password</label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="password" id="password" placeholder="Password" />
            </div>
            <br />

            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold mr-4" htmlFor="password">Confirm Password</label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="password" name="password" id="password" placeholder="Confirm Password" />
            </div>
            <br />

            <div className="flex justify-center">
              <button className="btn bg-indigo-500 text-white p-3 rounded-xl" type="submit">Register</button>
            </div>

            <div className='my-2 flex justify-center'>
              <p>Already Have an Account! <Link href="/admin/login" className='text-indigo-700 font-semibold'>Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}