import "../styles/App.css";

import header from "../components/header";
import UserPanel from "../components/userPanel";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [contacts, setContacts] = useState();

  const [form, setForm] = useState({ newContact: "" });

  // let token = localStorage.getItem(token);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/app/messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setContacts(data);
        return data;
      });
  }, []);

  // ---- handle changes to form data  ----
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function submitForm() {
    // confirm that user to contact exists in database.
    fetch(`${import.meta.env.VITE_API_URL}/checkuser/${form.newContact}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("debug -- fetch result: ", data);

        // if user is not found, notify
        if (!data) {
          console.log("there is no data....");
        }
      });
    // redirect to appropriate route to contact user.
  }

  return (
    <>
      {header()}

      <div className="panel" id="contactsList">
        Contacts list 👀
        {/* error message if not logged in. */}
        {localStorage.getItem("token") ? (
          <></>
        ) : (
          <p>Dashboard (err: not logged in!)</p>
        )}
        {/* notify if there are no contacts */}
        {contacts && contacts.length > 0 ? (
          <p>temp: contacts list will render here.</p>
        ) : (
          <p>There are no contacts yet! 😬</p>
        )}
        <button popovertarget="newContactForm">
          Create a new message ...{" "}
        </button>
        {/* TODO: above button must render a new form where you enter the user you are contacting */}
      </div>

      {/* Form for contacting a new user and linking to message route -- */}
      <div>
        <form
          popover="true"
          id="newContactForm"
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <label htmlFor="contact">Enter new contact username: </label>
          <input
            type="text"
            name="newContact"
            id="newContact"
            onChange={handleChange}
            value={form.contacts}
          />
          <br />
          <input type="submit" value="Find User" />
        </form>
      </div>

      <div id="profile">
        <a href="/">Customize profile ⚙️ (Not yet implemented)</a>
      </div>

      {UserPanel()}
    </>
  );
}
