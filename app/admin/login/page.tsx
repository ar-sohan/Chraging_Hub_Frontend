import Link from 'next/link'

export default function Login() {
  return (
    <>
      <div className="flex flex-col m-10 justify-center items-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <div className="my-8">
          <form action="">

            <div className="flex justify-between items-center gap-5">
              <label className="text-xl font-semibold" htmlFor="uname">Username </label>
              <input className="my-4 border-2 border-indigo-400 p-2 rounded" type="text" name="uname" id="uname" placeholder="Name" />
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

            <div className='flex justify-center mt-3'>
              <p>Don't Have an Account! <Link href="/admin/registration" className='text-indigo-700 font-semibold'>Register</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}