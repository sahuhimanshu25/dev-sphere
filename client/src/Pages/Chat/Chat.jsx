import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "./Chat Components/Chatbox";
import Conversation from "./Chat Components/Conversation";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate=useNavigate()
  const socket = useRef();
  const { userData } = useSelector((state) => state.user);

  // Initialize socket connection and setup listeners
  useEffect(() => {
    if (userData && userData._id) {
      socket.current = io("http://localhost:3000");
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
  const handleConversationClick = (chat) => {
    setCurrentChat(chat);
  };

  // Emit message when sendMessage is updated
  useEffect(() => {
    if (sendMessage && socket.current) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Handle search for people you follow
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/following/search?username=${searchTerm}`
        );
        setSearchResults(data.data); // Assuming data.data contains the list of followed users
      } catch (error) {
        console.error("Error searching followed users:", error);
      }
    }
  };

  // Initiate a new chat with the selected user
  const handleNewChat = async (user) => {
    try {
      const { data: chat } = await axios.post(`http://localhost:3000/chat/create`, {
        receiverId: user._id
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
              <HiUserGroup onClick={()=>navigate('/community')} color="black" cursor={'pointer'} />

              {/* User Search Input */}
              <div className="User-search">
                <input
                  type="text"
                  placeholder="Search people you follow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>
                  Search
                </button>
                <FaPlus onClick={()=>navigate('/addChat')} color="black" /> 
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
                      {user.username} <FaPlus className="Add-icon" />
                    </div>
                  ))}
                </div>
              )}

              {/* Chat List */}
              <div className="Chat-list">
                {chats.map((chat) => (
                  <div key={chat._id} style={{ backgroundColor: "red" }}>
                    <Conversation
                      data={chat}
                      currentUserId={userData._id}
                      onlineUsers={onlineUsers}
                      onClick={() => handleConversationClick(chat)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="Right-side-chat">
            {currentChat?<ChatBox
              chat={currentChat}
              currentUser={userData?._id}
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
              onlineUsers={onlineUsers}
            />:<div className="No-group-selected">
            Select a group to start chatting
          </div>}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Chat;
