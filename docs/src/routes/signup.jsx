import "../styles/App.css";
import header from "../components/header";
import { useState } from "react";

function formSubmit(data) {
  console.log("debug -- Url: ", import.meta.env.VITE_API_URL);
  console.log("debug -- Data: ", data);
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
  });

  //handle changes to form data while maintaining
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      {header()}
      <h1>Hi. Signup page here.</h1>

      <h2>Create New User here.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formSubmit(formData);
        }}
      >
        <label htmlFor="username">Username: </label>
        <input
          required="true"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
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
