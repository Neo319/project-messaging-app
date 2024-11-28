import "../styles/App.css";
import { useState, useEffect } from "react";

export default function UserPanel() {
  const [user, setUser] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("useEffect triggered");
    if (token) {
      //fetch user detail
      fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("debug -- user data = ", data);
          setUser(data);
        });
    } else {
      setUser(null);
    }
  }, []);

  return (
    <>
      <div id="userPanel">
        hello
        <br />
        <span>User data: {JSON.stringify(user)}</span>
      </div>
    </>
  );
}
