import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import userimg from "../../../../public/userimg.jpg";
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { IoSend } from "react-icons/io5";

const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receiveMessage,
  onlineUsers,
}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Fetch user data for the chat participant
  useEffect(() => {
    const getUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      if (!userId) return;

      try {
        const { data } = await axios.get(
          `http://localhost:3000/user/${userId}`
        );
        setUserData(data.data);
        // Check if the user is online
        setIsOnline(onlineUsers.some((user) => user.userId === userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (chat) getUserData();
  }, [chat, currentUser, onlineUsers]);

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
          const { data } = await axios.get(
            `http://localhost:3000/message/${chat._id}`
          );
          setMessages(data.message);
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

    // Create a new message object
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    // Optimistically update the messages list by adding the new message immediately
    setMessages((prevMessages) => [...prevMessages, message]);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/message",
        message
      );

      // Add the message from the server response, if it's not already in the list
      setMessages((prevMessages) => {
        const isMessageExist = prevMessages.some((msg) => msg._id === data._id);
        if (!isMessageExist) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });

      setNewMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, you can remove the optimistically added message if the request fails.
    }

    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  // Scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderMessage = (msg) => {
    return <span>{msg.text}</span>;
  };

  return (
    <div className="ChatBox-container">
      <div className="chat-header">
        <div className="chat-header-in">
          <div className="image-container">
            <img src={userimg} alt="" className="followerImage" />
            <div
              className={`online-dot ${isOnline ? "online" : "offline"}`}
            ></div>
          </div>
          <div className="name">
            <span>{userData?.userdata.username}</span>
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.senderId === currentUser ? "message own" : "message"}
          >
            {renderMessage(msg)}
            <span>{format(msg.createdAt)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-sender">
        <InputEmoji value={newMessage} onChange={setNewMessage}/>
        <button
          className="send-button button"
          onClick={handleSend}
          disabled={newMessage.trim().length === 0} // Disable if the message is empty or only spaces
          style={{ background: "none", cursor: "pointer" }}
        >
          <IoSend style={{ color: "#7c78eb8e", fontSize: "20px" }} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
