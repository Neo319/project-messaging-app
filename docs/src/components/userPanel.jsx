import "../styles/App.css";
import { useState, useEffect } from "react";

import userIcon from "../assets/168221779_b22643d9-ea6a-4b5e-bdaa-c670d185681d copy.jpeg";

export default function UserPanel() {
  const [user, setUser] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("useEffect triggered");
    if (token) {
      //fetch user detail
      fetch(`${import.meta.env.VITE_API_URL}/user`, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
        });
    } else {
      setUser(null);
    }
  }, []);

  // username to be rendered
  const username = user && user.username ? user.username : null;

  return (
    <>
      <div id="userPanel">
        <br />
        <div id="userIcon">
          <img
            src={user === null ? "" : userIcon}
            style={{
              width: "90px",
              height: "90px",
            }}
          />
        </div>
        <span>{user === null ? "Not Logged In." : username}</span>
      </div>
    </>
  );
}
