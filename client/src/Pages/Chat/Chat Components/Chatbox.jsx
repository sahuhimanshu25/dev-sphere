// ChatBox.jsx
import React, { useEffect, useState } from "react";
import "./ChatBox.css";
import userimg from '../../../../public/userimg.jpg';
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch user data for the chat
  useEffect(() => {
    const getUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      if (!userId) return;

      try {
        const { data } = await axios.get(`http://localhost:3000/user/${userId}`);
        setUserData(data.data);
        console.log("User data:", data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (chat) getUserData();
  }, [chat, currentUser]);

  // Update messages when a new message is received
  useEffect(() => {
    if (receiveMessage && receiveMessage.chatId === chat?._id) {
      setMessages((prev) => [...prev, receiveMessage]);
    }
  }, [receiveMessage, chat]);

  // Fetch all messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (chat?._id) {
          const { data } = await axios.get(`http://localhost:3000/message/${chat._id}`);
          setMessages(data.message);
          
          
          console.log("Fetched messages:", data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chat]);

  // Handle sending a new message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    try {
      const { data } = await axios.post('http://localhost:3000/message', message);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }

    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  
  return (
    <div className="ChatBox-container">
      <div className="chat-header">
        <div>
          <div className="online-dot"></div>
          <img src={userimg} alt="" className="followerImage" />
          <div className="name">
            <span>{userData?.firstname} {userData?.lastname}</span>
          </div>
          <span>Online</span>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.senderId === currentUser ? "message own" : "message"}>
            <span>{msg.text}</span>
            <span>{format(msg.createdAt)}</span>
          </div>
        ))}
      </div>

      <div className="chat-sender">
        <div>+</div>
        <InputEmoji value={newMessage} onChange={setNewMessage} />
        <div className="send-button button" onClick={handleSend}>Send</div>
      </div>
    </div>
  );
};

export default ChatBox;
