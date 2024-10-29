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
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results

  const socket = useRef();
  const { userData } = useSelector((state) => state.user);

  // Initialize socket connection and setup listeners
  useEffect(() => {
    if (userData && userData._id) {
      socket.current = io("http://localhost:8800");
      socket.current.emit("new-user-add", userData._id);

      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });

      socket.current.on("receive-message", (data) => {
        setReceiveMessage(data);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userData]);

  // Fetch chats for the current user
  useEffect(() => {
    const getChats = async () => {
      if (userData && userData._id) {
        try {
          const { data } = await axios.get(`http://localhost:3000/chat/chats`);
          setChats(data);
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
  };

  // Emit message when sendMessage is updated
  useEffect(() => {
    if (sendMessage && socket.current) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Handle user search
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(`http://localhost:3000/user/search-user?username=${searchTerm}`);

        setSearchResults(data.data); // Update search results based on the API response structure
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
  };

  // Initiate a new chat with the selected user
  const handleNewChat = async (user) => {
    try {
      const { data: chat } = await axios.post(`http://localhost:3000/chat/new`, { 
        userId: user._id, 
        currentUserId: userData._id 
      });
      setChats((prevChats) => [...prevChats, chat]); // Add new chat to the chat list
      setCurrentChat(chat); // Set as the current chat
      setSearchResults([]); // Clear search results after selection
      setSearchTerm(""); // Clear search input
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  return (
    <div className="Chat">
      {userData ? (
        <>
          <div className="Left-side-chat">
            <div className="Chat-container">
              <h2>Chats</h2>

              {/* User Search Input */}
              <div className="User-search">
                <input
                  type="text"
                  placeholder="Search users by username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
              </div>

              {/* Display Search Results */}
              {searchResults.length > 0 && (
                <div className="Search-results">
                  {searchResults.map((user) => (
                    <div 
                      key={user._id} 
                      className="Search-result-item"
                      onClick={() => handleNewChat(user)}
                    >
                      {user.username}
                    </div>
                  ))}
                </div>
              )}

              <div className="Chat-list">
                {chats.map((chat) => (
                  <div key={chat._id} style={{ backgroundColor: "red" }}>
                    <Conversation
                      data={chat}
                      currentUserId={userData._id}
                      onlineUsers={onlineUsers}
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
              currentUser={userData?._id}
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
