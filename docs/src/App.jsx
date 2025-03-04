import "./styles/App.css";
import "./styles/Homepage.css";
import footer from "./components/footer";
import header from "./components/header";
import userPanel from "./components/userPanel.jsx";

import { useState, useEffect } from "react";

function App() {
  // effect for testing server status
  const [status, setStatus] = useState("error");
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL) // insert correct url
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // notify user about server status
        const status = data.server_status === "ok" ? "ok" : "error";
        setStatus(status);
      });
  }, []);
  // notify user about server status

  return (
    <>
      {header()}
      <article>
        <p>
          This project aims to use a combination of Node.js backend and React.js
          frontend development to create a functional message board, akin to
          Discord, Facebook messenger, etc. This project is part of{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.theodinproject.com/lessons/nodejs-messaging-app"
          >
            The Odin Project Curriculum
          </a>
          , an open-source online educational resource for web developers.
        </p>

        {/* SERVER STATUS TEST */}
        <p>
          Server status: <b>{status}</b>
        </p>

      

        {/* ROUTES */}
        <p>Main app routes: </p>
        <ul>
          <li>
            <a href="signup" rel="noopener noreferrer">
              Sign up page
            </a>
          </li>
          <li>
            <a href="login" rel="noopener noreferrer">
              Login page
            </a>
          </li>
          <li>
            <a href="dashboard">Dashboard</a>
          </li>
        </ul>
        {userPanel()}
      </article>
      {footer()}
    </>
  );
}

export default App;
