export default function Login() {
  return (
    <>
    <h1>Welcome to Login</h1>
    <form action="/admin/login" method="post">
      <input type="text" name="username" placeholder="Username" />
      <br />
      <input type="password" name="password" placeholder="Password" />
      <br />
      <button type="submit">Login</button>
    </form>
    </>
  );
}