import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config"; // Ensure db points to your Firestore instance
import "./Chat.css"; // Import CSS file for custom styling

const AdminChatDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(db, "chats"));
      const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
      });

      return unsubscribe;
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const messagesQuery = query(
        collection(db, `chats/${selectedUser.id}/messages`),
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
    }
  }, [selectedUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, `chats/${selectedUser.id}/messages`), {
        text: newMessage,
        timestamp: new Date(),
        sender: "admin", // or any identifier for the admin
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="admin-chat-dashboard">
      <div className="user-list">
        <h3>Users</h3>
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${selectedUser && selectedUser.id === user.id ? "selected" : ""}`}
            onClick={() => handleUserClick(user)}
          >
            {user.id}
          </div>
        ))}
      </div>
      <div className="chat-box">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h3>Chat with {selectedUser.id}</h3>
            </div>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === "admin" ? "admin-message" : "user-message"}`}
                >
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
          </>
        ) : (
          <div className="no-user-selected">Select a user to view messages</div>
        )}
      </div>
    </div>
  );
};

export default AdminChatDashboard;
