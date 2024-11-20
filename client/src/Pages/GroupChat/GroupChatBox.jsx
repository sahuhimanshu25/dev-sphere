import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./GroupChatBox.css";
import userimg from "../../../public/userimg.jpg";
import { IoSend } from "react-icons/io5";
import { format } from "timeago.js";

const GroupChatBox = ({ group }) => {
  const { userData } = useSelector((state) => state.user);
  const socket = useRef();
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const localMessageIds = useRef(new Set()); // Track locally sent messages

  useEffect(() => {
    // Initialize socket connection
    socket.current = io("http://localhost:3000");

    // Join the group chat room
    socket.current.emit("join-group", group.data._id);

    // Listen for incoming messages for the group
    socket.current.on("receive-group-message", (data) => {
      if (data.groupId === group.data._id && !localMessageIds.current.has(data.message._id)) {
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
        const res = await axios.get(
          `http://localhost:3000/message/${group.data._id}`
        );
        setMessages(res.data.message); // Initialize messages
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [group]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const tempMessageId = Date.now(); // Temporary ID for the local message
      const messageData = {
        text: newMessage,
        chatId: group.data._id,
        isGroup: true,
        senderId: userData._id,
        _id: tempMessageId, // Add a temporary ID
        createdAt: new Date().toISOString(),
      };

      try {
        // Add the message to the local state immediately
        setMessages((prev) => [...prev, messageData]);
        localMessageIds.current.add(tempMessageId); // Track this local message

        // Save the message to the backend
        const res = await axios.post(`http://localhost:3000/message`, {
          text: newMessage,
          chatId: group.data._id,
          isGroup: true,
        });

        // Replace the temporary ID with the actual ID from the backend
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempMessageId ? { ...msg, _id: res.data.data._id } : msg
          )
        );
        localMessageIds.current.delete(tempMessageId); // Remove the temporary ID from tracking

        // Emit the message to the group chat via Socket.IO
        socket.current.emit("send-group-message", {
          groupId: group.data._id,
          message: res.data.data,
        });

        setNewMessage(""); // Clear the input field after sending
      } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              key={msg._id || `${msg.createdAt}-${Math.random()}`} // Fallback if _id is not available
              className={`gb-message ${
                msg.senderId === userData._id ? "own" : ""
              }`}
            >
              <p>{msg.text}</p>
              <div className="message-info">
                <span className="message-sender">
                  {msg.senderId === userData._id ? "You" : msg.senderName}{" "}
                </span>
                <span className="message-time">{format(msg.createdAt)}</span>
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
        <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
