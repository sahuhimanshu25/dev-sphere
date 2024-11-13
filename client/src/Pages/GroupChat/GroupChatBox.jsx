// GroupChatBox.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GroupChatBox.css";
import { useSelector } from "react-redux";

const GroupChatBox = ({ group }) => {
  const { userData } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages for the selected group

    // single message
    //     chatId
    // :
    // "67322c3995c97a6454834d97"
    // createdAt
    // :
    // "2024-11-13T11:26:16.464Z"
    // isGroup
    // :
    // true
    // senderId
    // :
    // "6719d55ad5c87f747cd3548e"
    // text
    // :
    // "first message on a group"
    // updatedAt
    // :
    // "2024-11-13T11:26:16.464Z"
    // __v
    // :
    // 0
    // _id
    // :
    // "67348cd889e5ae7a5308e0ed
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/message/${group.data._id}`
        );
        setMessages(res.data.message); // Set `messages` to the `message` array
        console.log("res.data groupchatbox", res.data.message);

        console.log(
          "group mess. grpchatbox.js group id",
          res.data.message,
          group.data._id
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [group]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const message = {
          text: newMessage,
          chatId: group.data._id,
          isGroup: true,
        };
        const res = await axios.post(`http://localhost:3000/message`, message);
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="group-chat-box">
      <div className="messages">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg._id || index}  // Fallback to index if _id is missing
              className={`message ${msg.senderId === userData._id ? "own" : ""}`}
            >
              <p>{msg.text}</p>
              <span>{msg.senderId}</span>
            </div>
          ))
        ) : (
          <p>No messages available</p> // Optional fallback if no messages are available
        )}
      </div>

      <div className="message-input">
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
