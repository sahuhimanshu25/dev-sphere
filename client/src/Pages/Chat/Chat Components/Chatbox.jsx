import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import userimg from '../../../../public/userimg.jpg';
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { Controlled as CodeMirror } from 'react-codemirror2'; // Import CodeMirror
import 'codemirror/mode/javascript/javascript';  // For JavaScript syntax highlighting
import 'codemirror/mode/clike/clike';  // For C/C++ syntax highlighting
import 'codemirror/lib/codemirror.css';  // CodeMirror styles
import 'codemirror/theme/material.css';  // Make sure to import the theme CSS
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Import syntax highlighter style
const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage, onlineUsers }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [inputMode, setInputMode] = useState("text");  // State to track input mode (text or code)
  const [language, setLanguage] = useState("javascript");  // State to track language selection
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Fetch user data for the chat participant
  useEffect(() => {
    const getUserData = async () => {
      const userId = chat?.members?.find((id) => id !== currentUser);
      if (!userId) return;

      try {
        const { data } = await axios.get(`http://localhost:3000/user/${userId}`);
        setUserData(data.data);
        // Check if the user is online
        setIsOnline(onlineUsers.some(user => user.userId === userId));
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
          const { data } = await axios.get(`http://localhost:3000/message/${chat._id}`);
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
      const { data } = await axios.post('http://localhost:3000/message', message);

      // Add the message from the server response, if it's not already in the list
      setMessages((prevMessages) => {
        const isMessageExist = prevMessages.some((msg) => msg._id === data._id);
        if (!isMessageExist) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });

      setNewMessage("");  // Clear the input field after sending
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
    if (msg.text && inputMode === "code") {
      return (
        <SyntaxHighlighter language={language} style={docco}>
          {msg.text}
        </SyntaxHighlighter>
      );
    }
    return <span>{msg.text}</span>;
  };

  return (
    <div className="ChatBox-container">
      <div className="chat-header">
        <div>
          <div className={`online-dot ${isOnline ? "online" : "offline"}`}></div>
          <img src={userimg} alt="" className="followerImage" />
          <div className="name">
            <span>{userData?.userdata.username}</span>
          </div>
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.senderId === currentUser ? "message own" : "message"}>
            {renderMessage(msg)}
            <span>{format(msg.createdAt)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-sender">
        {/* Dropdown for selecting input mode */}
        <select onChange={(e) => setInputMode(e.target.value)} value={inputMode}>
          <option value="text">Text</option>
          <option value="code">Code</option>
        </select>

        {/* Dropdown for selecting programming language */}
        {inputMode === "code" && (
          <select onChange={(e) => setLanguage(e.target.value)} value={language}>
            <option value="javascript">JavaScript</option>
            <option value="clike">C/C++</option>
          </select>
        )}

        {/* Input Field */}
        {inputMode === "code" ? (
          <CodeMirror
          value={newMessage}
          options={{
            mode: language, // Dynamically set the mode
            lineNumbers: true,
            theme: 'material', // Ensure you are using a supported theme
          }}
          onBeforeChange={(editor, data, value) => setNewMessage(value)}
          style={{
            height: '300px',   // Adjust as needed
            width: '100%',
            border: '1px solid #ccc', // Optional border styling
            borderRadius: '5px',
            
          }}
        />
        
        ) : (
          <InputEmoji value={newMessage} onChange={setNewMessage} />
        )}

        {/* Send Button */}
        <div className="send-button button" onClick={handleSend}>Send</div>
      </div>
    </div>
  );
};

export default ChatBox;
