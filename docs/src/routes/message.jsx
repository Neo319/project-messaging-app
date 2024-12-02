import "../styles/App.css";

import header from "../components/header";
import UserPanel from "../components/userPanel";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  // the user you are contacting
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // URL paramater for user being contacted
  const params = useParams();

  // 1. conditions: must be logged in
  if (!token) {
    alert("not logged in -- redirecting...");
    window.location.href = "/login";
  }
  // 2. conditions: user being contacted must exist
  if (!params.user) {
    alert("no user to contact -- redirecting...");
    window.location.href = "/login";
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/app/messages/user=${params.user}`, {
      headers: { Authorization: `bearer ${token}` },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMessages(data);
      });
  }, [token, params]);

  // 2. return all messages and provide simple form that can send post requests.

  // ---- handle changes to form data  ----
  function handleChange(e) {
    const value = e.target.value;

    setNewMessage(value);
  }

  return (
    <>
      {header()}
      <span>debug: user2 = {JSON.stringify(params)}</span>

      <div>
        <span>debug: data = {JSON.stringify(messages)}</span>
      </div>

      {!messages.length ? (
        <p>This is the start of your message history with {params.user}.</p>
      ) : (
        <div id="messageList">
          <ul>
            {messages.map((message) => {
              <li>
                {message.text} -- {message.date}
              </li>;
            })}
          </ul>
        </div>
      )}

      <div id="MessageInput">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("here!");
            //SENDING THE POST REQUEST
            fetch(`${import.meta.env.VITE_API_URL}/app/messages`, {
              method: "POST",
              body: {
                message: newMessage,
                reciever: params.user,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                console.log(data);
              });
          }}
        >
          <input
            required
            type="text"
            onChange={handleChange}
            value={newMessage}
          />
          <input type="submit" value="Send" />
        </form>
      </div>

      {UserPanel()}
    </>
  );
}
