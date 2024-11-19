import "../App.css";

export default function Login() {
  return (
    <>
      <h1>Hi. Login Page here.</h1>

      <form action="">
        <label htmlFor="username">Username: </label>
        <input required="true" type="text" name="username" />
        <br />

        <label htmlFor="password">Enter Password: </label>
        <input required="true" type="password2" name="password" />
        <br />

        <input type="submit" value="Login" />
      </form>
    </>
  );
}
