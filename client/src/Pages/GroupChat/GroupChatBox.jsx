import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./GroupChatBox.css";
import userimg from "../../../public/userimg.jpg";
import { IoSend } from "react-icons/io5";
import { format } from "timeago.js";
import { FaArrowLeft } from "react-icons/fa";

const GroupChatBox = ({ group, isMobileView, handleBackToConversation }) => {
  const { userData, token } = useSelector((state) => state.user);
  const socket = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const localMessageIds = useRef(new Set());

  useEffect(() => {
    socket.current = io(``);

    socket.current.emit("join-group", group.data._id);

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
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/message/${group.data._id}`,
          {
withCredentials:true
          }
        );
        setMessages(res.data.message);
      } catch (err) {
        // console.log("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [group, token]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const tempMessageId = Date.now();
      const messageData = {
        text: newMessage,
        chatId: group.data._id,
        isGroup: true,
        senderId: userData._id,
        _id: tempMessageId,
        createdAt: new Date().toISOString(),
      };

      try {
        setMessages((prev) => [...prev, messageData]);
        localMessageIds.current.add(tempMessageId);

        const res = await axios.post(
          `/message`,
          {
            text: newMessage,
            chatId: group.data._id,
            isGroup: true,
          },
          {
withCredentials:true
          }
        );

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempMessageId ? { ...msg, _id: res.data.data._id } : msg
          )
        );
        localMessageIds.current.delete(tempMessageId);

        socket.current.emit("send-group-message", {
          groupId: group.data._id,
          message: res.data.data,
        });

        setNewMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="group-chat-box">
      <div className="gb-chat-header">
        <div className="gb-chat-header-in">
        <img src={userimg} alt="" />
        <div className="name">{group.data.name}</div>
        </div>
        <div>
            {isMobileView && (
          <FaArrowLeft
            className="chatbox-back-button"
            onClick={handleBackToConversation}
          />
        )}
        </div>
      </div>
      <div className="gb-messages">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id || `${msg.createdAt}-${Math.random()}`}
              className={`gb-message ${
                msg.senderId === userData._id ? "own" : ""
              }`}
            >
              <p>{msg.text}</p>
              <div className="message-info">
                <span className="message-sender">
                  {msg.senderId === userData._id ? "You" : msg.senderName}
                </span>
                <span className="message-time">{format(msg.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No messages available</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="gb-message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          id="gb-chat-input"
        />
        <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;