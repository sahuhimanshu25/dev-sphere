import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "./Chat Components/Chatbox";
import Conversation from "./Chat Components/Conversation";
import { io } from "socket.io-client";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useRef();
  
  // Get user data from Redux store
  const { userData } = useSelector((state) => state.user);

  // Initialize socket connection and setup listeners
  useEffect(() => {
    if (userData && userData._id) { // Only connect if userData and userData._id exist
      socket.current = io("http://localhost:8800");

      // Emit the new user to the server
      socket.current.emit("new-user-add", userData._id);

      // Listen for the updated list of online users
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });

      // Listen for incoming messages
      socket.current.on("receive-message", (data) => {
        setReceiveMessage(data);
      });

      // Clean up the socket connection on component unmount
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userData]); // Ensure this runs only when userData changes

  // Fetch chats for the current user on component mount
  useEffect(() => {
    const getChats = async () => {
      if (userData && userData._id) { // Check if userData and userData._id exist
        try {
          const { data } = await axios.get(`http://localhost:3000/chat/chats`);
          setChats(data);
          console.log("Chats data:", data);
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }  
    };
    getChats();
  }, [userData]);

  // Handle conversation click
  const handleConversationClick = (chat, user) => {
    setCurrentChat(chat);
    console.log("Selected user:", user);
  };

  // Emit message when sendMessage is updated
  useEffect(() => {
    if (sendMessage && socket.current) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

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
              currentUser={userData?._id} // Conditional access of userData._id
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
