// Chat.jsx
import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "./Chat Components/Chatbox";
import Conversation from "./Chat Components/Conversation";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);

  // Get user data from Redux store
  const { userData } = useSelector((state) => state.user);

  // Fetch chats for the current user on component mount
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/chat/chats`);
        setChats(data);
        console.log("Chats data:", data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    if (userData) getChats();
  }, [userData]);

  // Handle conversation click
  const handleConversationClick = (chat, user) => {
    setCurrentChat(chat);
    console.log("Selected user:", user);
  };

  return (
    <div className="Chat">
      {userData ? (
        <>
          <div className="Left-side-chat">
            <div className="Chat-container">
              <h2>Chats</h2>
              <div className="Chat-list">
                {chats.map((chat) => (
                  <div key={chat._id} style={{ backgroundColor: "red" }}>
                    <Conversation
                      data={chat}
                      currentUserId={userData._id}
                      onClick={(user) => handleConversationClick(chat, user)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="Right-side-chat">
            <ChatBox
              chat={currentChat}
              currentUser={userData._id}
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Chat;
