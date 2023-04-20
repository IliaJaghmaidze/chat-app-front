import React, { useState, useEffect } from "react";
import "./index.css";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("https://chat-app-btj2.onrender.com/");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    const newMessage = { name, message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit("message", newMessage);

    fetch("https://chat-app-btj2.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

    setName("");
    setMessage("");
  };

  console.log("Current messages:", messages);

  return (
    <div className="app">
      <div className="message-container">
        <h1>Send messages</h1>
        <input
          id="name"
          className="input-field border"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <textarea
          id="message"
          className="form-control border"
          placeholder="Your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="btn" onClick={handleSend}>
          Send
        </button>
      </div>
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="second-color border">
            <h3 className="padding">
              {message.name ? message.name : "Anonymous"} Says:
            </h3>
            <p className="padding">{message.message}</p>
          </div>
        ))
      ) : (
        <p>No new messages to display</p>
      )}
    </div>
  );
}

export default App;
