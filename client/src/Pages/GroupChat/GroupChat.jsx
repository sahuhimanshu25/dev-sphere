// GroupChat.jsx
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

  // Fetch user's groups on mount
  // Fetch user's groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/group/getUserGroups"
        );
        setGroups(response.data.data); // Access the `data` array within the response
        console.log(groups);
        
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    if (userData) {
      fetchGroups();
    }
  }, [userData]);

  // Handle group selection
  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
  };

  // Search for groups
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

  // Join new group and initiate chat
  //   const handleJoinGroup = async (group) => {
  //     try {
  //       const { data: newGroup } = await axios.post(`http://localhost:3000/group/join`, {
  //         groupId: group._id
  //       });
  //       setGroups((prevGroups) => [...prevGroups, newGroup]);
  //       setCurrentGroup(newGroup);
  //       setSearchResults([]);
  //       setSearchTerm("");
  //     } catch (error) {
  //       console.error("Error joining group:", error);
  //     }
  //   };

  return (
    <div className="GroupChat">
      {userData ? (
        <>
          <div className="Left-side-chat">
            <div className="GroupChat-container">
              <h2>Groups</h2>

              {/* Group Search Input */}
              <div className="Group-search">
                <input
                  type="text"
                  placeholder="Search for groups"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <FaPlus onClick={() => navigate("/addGroup")} />
              </div>

              {/* Display Search Results */}
              {/* {searchResults.length > 0 && (
                <div className="Search-results">
                  {searchResults.map((group) => (
                    <div
                      key={group._id}
                      className="Search-result-item"
                      onClick={() => handleJoinGroup(group)}
                    >
                      {group.name} <FaPlus className="Add-icon" />
                    </div>
                  ))}
                </div>
              )} */}

              {/* Group List */}
              {/* Group List */}
              <div className="Group-list">
                {groups.map((group) => (
                  <div key={group._id}>
                    <GroupChatConversation
                      group={group}
                      onSelect={handleGroupSelect} // Pass `handleGroupSelect` here as `onSelect`
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="Right-side-chat">
            {currentGroup ? (
              <GroupChatBox group={currentGroup}/>
            ) : (
              <div className="No-group-selected">
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
