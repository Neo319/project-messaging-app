import "../App.css";
import icon from "../assets/messageIcon2.jpg";

export default function SignUp() {
  return (
    <>
      <img src={icon} alt="Messager Icon" className="icon message" />
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

        <input type="submit" value="Create User" />
      </form>
    </>
  );
}
