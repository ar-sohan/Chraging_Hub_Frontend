type Props = {
  params: Promise<{
    id: string;
    name : string;
    status : string;
  }>;
};

export default async function UserDetails({ params }: Props) {
  const { id, name, status } = await params;

  return (
    <div>
      <h1>User Details</h1>

      <p>User ID: {id}</p>
      <p>User Name: {name}</p>
      <p>Status: {status}</p>
    </div>
  );
}