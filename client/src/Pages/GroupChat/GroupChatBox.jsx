import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./GroupChatBox.css";

const GroupChatBox = ({ group }) => {
  const { userData } = useSelector((state) => state.user);
  const socket = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.emit("join-group", group.data._id);

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
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/message/${group.data._id}`);
        setMessages(res.data.message);
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [group]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        chatId: group.data._id,
        isGroup: true,
        senderId: userData._id,
      };

      socket.current.emit("send-group-message", {
        groupId: group.data._id,
        message: messageData,
      });

      try {
        const res = await axios.post(`http://localhost:3000/message`, messageData);
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log("Error sending message:", err);
      }
    } else {
      console.log("Message is empty or invalid");
    }
  };

  return (
    <div className="gb-chat-box">
      <div className="gb-messages">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id || `${msg.senderId}-${msg.createdAt}`}
              className={`gb-message ${msg.senderId === userData._id ? "gb-own" : ""}`}
            >
              <p>{msg.text}</p>
              <span>{msg.senderId}</span>
            </div>
          ))
        ) : (
          <p>No messages available</p>
        )}
      </div>
      <div ref={messagesEndRef} />
      <div className="gb-message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupChatBox;
