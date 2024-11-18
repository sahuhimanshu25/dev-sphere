import React, { useEffect, useState } from "react";
import "./GroupChat.css";
import { useSelector } from "react-redux";
import axios from "axios";
import GroupChatBox from "./GroupChatBox";
import GroupChatConversation from "./GroupChatConversation";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GroupChat = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/group/getUserGroups"
        );
        setGroups(response.data.data);
        console.log(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    if (userData) {
      fetchGroups();
    }
  }, [userData]);

  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/group/search?query=${searchTerm}`
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching groups:", error);
      }
    }
  };

  return (
    <div className="GCB-GroupChat">
      {userData ? (
        <>
          <div className="GCB-LeftSideChat">
            <div className="GCB-Container">
              <h2>Groups</h2>

              <div className="GCB-Search">
                <input
                  type="text"
                  placeholder="Search for groups"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <FaPlus onClick={() => navigate("/addGroup")} />
              </div>

              <div className="GCB-GroupList">
                {groups.map((group) => (
                  <div key={group._id}>
                    <GroupChatConversation
                      group={group}
                      onSelect={handleGroupSelect}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="GCB-RightSideChat">
            {currentGroup ? (
              <GroupChatBox group={currentGroup} />
            ) : (
              <div className="GCB-NoGroupSelected">
                Select a group to start chatting
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default GroupChat;
