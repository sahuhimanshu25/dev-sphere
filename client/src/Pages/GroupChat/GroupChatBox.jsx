import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./GroupChatBox.css";
import userimg from "../../../public/userimg.jpg";
import { IoSend } from "react-icons/io5";

const GroupChatBox = ({ group }) => {
  const { userData } = useSelector((state) => state.user);
  const socket = useRef();
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Initialize socket connection
    socket.current = io("http://localhost:3000");

    // Join the group chat room
    socket.current.emit("join-group", group.data._id);

    // Listen for incoming messages for the group
    socket.current.on("receive-group-message", (data) => {
      if (data.groupId === group.data._id) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [group]);

  useEffect(() => {
    // Fetch initial messages for the group
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/message/${group.data._id}`);
        setMessages(res.data.message); // Initialize messages
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [group]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);  // Dependency on messages to trigger scrolling when they change

  const handleSendMessage = async () => {
    if (newMessage.trim()) {  // Ensure message is not empty
      const messageData = {
        text: newMessage,
        chatId: group.data._id,
        isGroup: true,
        senderId: userData._id, // Set current user as sender
      };

      try {
        // Save the message to the backend
        const res = await axios.post(`http://localhost:3000/message`, messageData);

        // Emit the message to the group chat via Socket.IO
        socket.current.emit("send-group-message", {
          groupId: group.data._id,
          message: res.data, // Emit the message returned from the server
        });

        // Optimistically update the messages list by adding the new message immediately
        setMessages((prev) => [...prev, res.data]); // Add the message from the server response
        setNewMessage(""); // Clear the input field after sending
      } catch (err) {
        console.log("Error sending message:", err);
      }
    } else {
      console.log("Message is empty or invalid");
    }
  };

  // Function to format the time like "5 days ago"
  const formatTimeAgo = (timestamp) => {
    const timeDifference = new Date().getTime() - new Date(timestamp).getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="group-chat-box">
      <div className="gb-chat-header">
        <img src={userimg} alt="" />
        <div className="name">{group.data.name}</div>
      </div>

      <div className="gb-messages">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={`${msg.createdAt}`} 
              className={`gb-message ${msg.senderId === userData._id ? "own" : ""}`}
            >
              <p>{msg.text}</p>
              <div className="message-info">
                <span className="message-sender">
                  {msg.senderId === userData._id ? "You" : msg.senderName} {/* Display sender name */}
                </span>
                <span className="message-time">
                  {formatTimeAgo(msg.createdAt)} {/* Display formatted time */}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No messages available</p>
        )}
      </div>

      <div ref={messagesEndRef} /> {/* To scroll to the bottom */}

      <div className="gb-message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
         
        />
        <button onClick={handleSendMessage}>{<IoSend/>}</button>
      </div>
    </div>
  );
};

export default GroupChatBox;
