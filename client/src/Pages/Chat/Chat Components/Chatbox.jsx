import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import userimg from "../../../../public/userimg.jpg";
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { IoSend } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../../../components/Loader/Loader";
import { useSelector } from "react-redux";

const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receiveMessage,
  onlineUsers,
  isMobileView,
  handleBackToConversation,
}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { token } = useSelector((state) => state.user);

  // Fetch user data for the chat participant
  useEffect(() => {
    const getUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      if (!userId) return;

      try {
        setLoading(true);
        const { data } = await axios.get(
          `/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUserData(data.data);
        setIsOnline(onlineUsers.some((user) => user.userId === userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (chat) getUserData();
  }, [chat, currentUser, onlineUsers, token]);

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
        setLoading(true);
        if (chat?._id) {
          const { data } = await axios.get(
            `/message/${chat._id}`,
            {
              withCredentials: true,
            }
          );
          setMessages(data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chat, token]);

  // Handle sending a new message
  const handleSend = async (e) => {
    e.preventDefault();

    if (sending || newMessage.trim() === "") return;

    setSending(true);
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    setMessages((prevMessages) => [...prevMessages, message]);

    try {
      const { data } = await axios.post(
        `/message`,
        message,
        {
          withCredentials: true,
        }
      );
      setMessages((prevMessages) => {
        const isMessageExist = prevMessages.some((msg) => msg._id === data._id);
        if (!isMessageExist) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
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
    return <span>{msg.text || "Message content unavailable"}</span>;
  };

  if (loading) {
    return (
      <div className="ChatBox-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="ChatBox-container">
      <div className="chat-header">
        <div className="chat-header-in">
          <div className="chat-header-in-in">
            <div className="image-container">
              <img
                src={userData?.userdata.avatar || userimg}
                alt="User"
                className="followerImage"
              />
              <div
                className={`online-dot ${isOnline ? "online" : "offline"}`}
              ></div>
            </div>
            <div className="name">
              <span>{userData?.userdata.username || "Unknown User"}</span>
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
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
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.senderId === currentUser ? "message own" : "message"}
          >
            {renderMessage(msg)}
            <span>{format(msg.createdAt || new Date())}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-sender">
        <InputEmoji
          value={newMessage}
          onChange={setNewMessage}
          placeholder="Type a message"
          onEnter={() => {
            if (newMessage.trim()) {
              handleSend(new Event("send"));
            }
          }}
        />
        <button
          className="send-button button"
          onClick={handleSend}
          disabled={newMessage.trim().length === 0 || sending}
          style={{
            background: "none",
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          <IoSend
            style={{
              color: sending ? "#ccc" : "#7c78eb8e",
              fontSize: "20px",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;