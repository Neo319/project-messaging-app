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

  if (!localStorage.getItem("token")) {
    return <>Dashboard (err:not logged in!)</>;
  }

  return (
    <>
      {header()}

      <div className="panel" id="contactsList">
        Contacts list 👀
        <p>contacts: {JSON.stringify(contacts)}</p>
      </div>

      <div id="profile">Customize profile ⚙️</div>

      {UserPanel()}
    </>
  );
}
