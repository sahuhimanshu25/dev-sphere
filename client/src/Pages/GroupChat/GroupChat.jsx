import React, { useEffect, useState } from "react";
import "./GroupChat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import GroupChatBox from "./GroupChatBox";
import GroupChatConversation from "./GroupChatConversation";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiChatSmile3Line } from "react-icons/ri";
const GroupChat = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { userData, token } = useSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/group/getUserGroups`,
          {
            withCredentials:true
          }
        );
        setGroups(response.data.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    if (userData) {
      fetchGroups();
    }
  }, [userData, token]);

  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/group/search?query=${searchTerm}`,
          {
withCredentials:true
          }
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching groups:", error);
      }
    }
  };

  return (
    <div className="GCB-chat">
      <div className="GCB-GroupChat">
        {userData ? (
          <>
            <div
              className={`GCB-LeftSideChat ${
                isMobileView && currentGroup ? "group-left-notsel" : "group-left"
              }`}
            >
              <div className="GCB-Container">
                <div className="GCB-LeftSideChat-top">
                  <h2>
                    <span>G</span>
                    <span>r</span>
                    <span>o</span>
                    <span>u</span>
                    <span>p</span>
                    <span>s</span>
                  </h2>

                  <div className="GCB-Search">
                    <input
                      type="text"
                      placeholder="Search for groups"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                  </div>
                </div>
                <div className="GCB-GroupList">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      className={`GCB-GroupList-in ${
                        currentGroup?._id === group._id ? "active-group" : ""
                      }`}
                    >
                      <GroupChatConversation
                        group={group}
                        onSelect={handleGroupSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="GCB-tleft-side-chat-footer">
                <div
                  onClick={() => navigate("/chat")}
                  className="GCB-community group"
                >
                  <div className="GCB-icon-container">
                    <RiChatSmile3Line className="icon" style={{ fontSize: "30px" }} />
                  </div>
                  <div className="GCB-hover-label">Chats</div>
                </div>
                <div className="GCB-add-chat group">
                  <div
                    className="GCB-icon-container"
                    onClick={() => navigate("/addChat")}
                  >
                    <FaPlus className="icon" />
                  </div>
                  <div className="GCB-hover-label">Add Chat</div>
                </div>
              </div>
            </div>

            <div
              className={`GCB-RightSideChat ${
                isMobileView && !currentGroup ? "group-right-notsel" : "group-right"
              }`}
            >
              {currentGroup ? (
                <GroupChatBox
                  group={currentGroup}
                  isMobileView={isMobileView}
                  handleBackToConversation={() => setCurrentGroup(null)}
                />
              ) : (
                <div className="GCB-NoGroupSelected">
                  <p>Select a group to start chatting</p>
                  {!isMobileView && (
                    <button
                      className="add-chat-button"
                      onClick={() => navigate("/addChat")}
                    >
                      Start a New Chat
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GroupChat;