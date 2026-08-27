import Link from 'next/link'
import Header from '../components/Header'

export default function ManageUsers() {


  return (
    <>
      <div>
        <Header></Header>
        <div>
          <h1>Manage User</h1>
          <div>
            <p>User - 1</p>
            <Link href='admin/user_details'><button>Details</button></Link>
          </div>
          <div>
            <p>User - 2</p>
            <button>Details</button>
          </div>
          <div>
            <p>User - 3</p>
            <button>Details</button>
          </div>
          <div>
            <p>User - 4</p>
            <button>Details</button>
          </div>
        </div>
      </div>
    </>
  );
}