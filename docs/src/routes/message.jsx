import "../styles/App.css";

import header from "../components/header";
import UserPanel from "../components/userPanel";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
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
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages(["err"]);
        }
        setLoading(false);
      });
  }, [token, params]);

  // ---- handle changes to form data  ----
  function handleChange(e) {
    const value = e.target.value;

    setNewMessage(value);
  }

  // managing state with loads

  //debug
  function logMessages() {
    console.log(messages);
  }

  return (
    <>
      {header()}
      <span>debug: user2 = {JSON.stringify(params)}</span>

      <div>
        <span>debug: data = {JSON.stringify(messages)}</span>
      </div>

      {loading ? (
        <span> Loading... </span>
      ) : (
        <>
          {Array.isArray(messages) && messages.length <= 0 ? (
            <p>This is the start of your message history with {params.user}.</p>
          ) : (
            <div id="messageList">
              <ul>
                {messages.map((message, index) => {
                  return (
                    <li key={"message_" + index}>
                      {message.text} --{" "}
                      {new Date(message.date).toLocaleString()}
                    </li>
                  );
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
                  body: JSON.stringify({
                    message: newMessage,
                    reciever: params.user,
                  }),
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
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
        </>
      )}

      {UserPanel()}
    </>
  );
}
