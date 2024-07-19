import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config"; // Import your auth instance

import { db } from "../../firebase/config";
import "./Chat.css";

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("timestamp")
      );
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      });

      return unsubscribe;
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        timestamp: new Date(),
        sender: user.uid,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

  return (
    <div className="chat-container">
      {showChatBox && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Real-Time Chat Support</h3>
            <button
              onClick={toggleChatBox}
              className="close-button"
            >
              X
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === "itscVkxiuYPv3mM8Nobewbjp3Ri1" ? "admin" : "user"}`}
              >
                <span className="message-id">
                  {message.sender === "itscVkxiuYPv3mM8Nobewbjp3Ri1"
                    ? "Admin"
                    : message.sender}
                </span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="chat-form"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="chat-input"
            />
            <button
              type="submit"
              className="send-button"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <button
        className="chat-button"
        onClick={toggleChatBox}
      >
        <img
          src="https://img.icons8.com/?size=100&id=42407&format=png&color=000000"
          alt="Chat Icon"
          className="chat-icon"
        />
      </button>
    </div>
  );
};

export default Chat;
