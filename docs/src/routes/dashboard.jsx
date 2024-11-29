import "../styles/App.css";

import header from "../components/header";
import UserPanel from "../components/userPanel";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [contacts, setContacts] = useState();

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
        <button>Add new Contact ... </button>
      </div>

      <div id="profile">
        <a href="/">Customize profile ⚙️ (Not yet implemented)</a>
      </div>

      {UserPanel()}
    </>
  );
}
