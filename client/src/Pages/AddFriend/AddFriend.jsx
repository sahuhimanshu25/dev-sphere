import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import "./AddFriend.css";
import toast from "react-hot-toast";

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [followersList, setFollowersList] = useState([]); // Followers list from user data
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchUserFollowers();
  }, []);

  const fetchUserFollowers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/user/me");
      const followerIds = data.data.followers;

      // Fetch details for each follower to get the usernames
      const followerDetails = await Promise.all(
        followerIds.map(async (id) => {
          const response = await axios.get(`http://localhost:3000/user/${id}`);
          return response.data.data;
        })
      );

      setFollowersList(followerDetails);
    } catch (error) {
      console.error("Error fetching followers list:", error);
      toast.error("Failed to fetch followers list.");
    }
  };

  // Handle user search
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/user/search-user?username=${searchTerm}`
        );
        setSearchResults(data.data); // Update user search results
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
  };

  // Handle group search
  const handleGroupSearch = async () => {
    if (groupSearchTerm) {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/group/search?query=${groupSearchTerm}`
        );
        setGroupSearchResults(data.data); // Update group search results
      } catch (error) {
        console.error("Error searching groups:", error);
        toast.error("Failed to search for groups.");
      }
    }
  };

  // Handle following a user
  const handleFollow = async (userId) => {
    try {
      await axios.put(`http://localhost:3000/follow/${userId}`);
      await axios.post(`http://localhost:3000/chat/create`, {
        receiverId: userId,
      });
      toast.success("User followed successfully!");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error(error.response?.data?.error || "Error following user");
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:3000/group/join`, { groupId });
      toast.success("Successfully joined the group!");
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error(error.response?.data?.message || "Error joining group");
    }
  };

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription || selectedMembers.length === 0) {
      toast.error("Please fill all fields and select at least one member.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/group/create", {
        name: groupName,
        description: groupDescription,
        members: selectedMembers,
      });
      toast.success("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Error creating group");
    }
  };

  // Handle selecting members
  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(memberId)
        ? prevMembers.filter((id) => id !== memberId)
        : [...prevMembers, memberId]
    );
  };

  return (
    <div className="Search-container">
      {/* User Search */}
      <div className="User-search">
        <input
          type="text"
          placeholder="Search users by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search Users</button>
        {searchResults.length > 0 && (
          <div className="Search-results">
            {searchResults.map((user) => (
              <div key={user._id} className="Search-result-item">
                {user.username}
                <FaPlus
                  onClick={() => handleFollow(user._id)}
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Search */}
      <div className="Group-search">
        <input
          type="text"
          placeholder="Search groups by name or description"
          value={groupSearchTerm}
          onChange={(e) => setGroupSearchTerm(e.target.value)}
        />
        <button onClick={handleGroupSearch}>Search Groups</button>
        {groupSearchResults.length > 0 && (
          <div className="Search-results">
            {groupSearchResults.map((group) => (
              <div key={group._id} className="Search-result-item">
                {group.name}
                <FaPlus
                  onClick={() => handleJoinGroup(group._id)}
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Creation */}
      <div className="Create-group">
        <h3>Create New Group</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <textarea
          placeholder="Group Description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
        />
        <div className="Followers-list">
          <h4>Select Members</h4>
          {followersList.map((follower) => (
            <div key={follower._id} className="Follower-item">
              <input
                type="checkbox"
                checked={selectedMembers.includes(follower._id)}
                onChange={() => handleMemberSelect(follower._id)}
              />
              <label>{follower.username}</label> {/* Display username */}
            </div>
          ))}
        </div>

        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
};

export default AddFriend;
