import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Chat from "../pages/Chat/Chat";

const ChatButton = () => {
  const { currentUser } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        className="chat-button"
      >
        <img
          src="https://img.icons8.com/?size=100&id=42407&format=png&color=000000"
          alt="Chat"
        />
      </button>
      {isChatOpen && currentUser && (
        <div className="chat-box-container">
          <Chat />
        </div>
      )}
    </div>
  );
};

export default ChatButton;
