import "../styles/App.css";
import header from "../components/header";

function formSubmit(data) {
  console.log("debug -- Url: ", import.meta.env.VITE_API_URL);
  console.log("debug -- Data: ", false);
}

export default function SignUp() {
  return (
    <>
      {header()}
      <h1>Hi. Signup page here.</h1>

      <h2>Create New User here.</h2>
      <form action="">
        <label htmlFor="username">Username: </label>
        <input required="true" type="text" name="username" />
        <br />

        <label htmlFor="password">Enter Password: </label>
        <input required="true" type="password2" name="password" />
        <br />

        <label htmlFor="password2">Confirm Password: </label>
        <input required="true" type="password" name="password2" />
        <br />

        <input type="button" value="Create User" onClick={formSubmit} />
      </form>
    </>
  );
}
