import "../styles/App.css";
import header from "../components/header";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // ---- handle changes to form data  ----
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  //  ---- sending the login request ----
  function formSubmit(data) {
    fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => {
        return result.json();
      })
      .then((response) => {
        console.log(response);

        if (response.success === true) {
          alert(`Login success (tokens not implemented.)`);
          window.location.href = "/dashboard";
          // redirect to login on success
        }
        // notify if there is an error
      });
  }

  return (
    <>
      {header()}
      <h1>Hi. Login Page here.</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          formSubmit(formData);
        }}
      >
        <label htmlFor="username">Username: </label>
        <input
          required={true}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="password">Enter Password: </label>
        <input
          required={true}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />

        <input type="submit" value="Login" />
      </form>
    </>
  );
}
