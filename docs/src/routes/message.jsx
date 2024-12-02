import "../styles/App.css";

import header from "../components/header";
import UserPanel from "../components/userPanel";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  // the user you are contacting
  const [user2, setUser2] = useState();

  // URL paramater for user being contacted
  const params = useParams();

  // 1. conditions: must be logged in
  if (!token) {
    alert("not logged in -- redirecting...");
    window.location.href = "/login";
  }
  // 2. conditions: user being contacted must exist
  // if ()

  //TODO: how to pass user2's username to this function?

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/app/messages/user=${"PLACEHOLDER"}`,
      {
        headers: { Authorization: `bearer ${token}` },
      }
    );
  }, [token]);

  // 2. return all messages and provide simple form that can send post requests.

  return (
    <>
      {header()}
      <h1>Hi. Message page here.</h1>

      <span>debug: user2 = {JSON.stringify(params)}</span>
      {UserPanel()}
    </>
  );
}
