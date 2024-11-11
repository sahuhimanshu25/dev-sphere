import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import './AddFriend.css'
import toast from "react-hot-toast";
const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results

  // Handle search
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/user/search-user?username=${searchTerm}`
        );

        setSearchResults(data.data); // Update search results based on the API response structure
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
  };

  // Handle follow
  const handleFollow = async (userId) => {
    try {
      await axios.put(`http://localhost:3000/follow/${userId}`);
      toast.success("User followed successfully!")
      // Optionally, update the UI to reflect that the user is followed
    } catch (error) {
      console.error("Error following user:", error);
      toast.error(error.response.data.error)
    }
  };

  return (
    <div className="User-search">
      <input
        type="text"
        placeholder="Search users by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 && (
        <div className="Search-results">
          {searchResults.map((user) => (
            <div key={user._id} className="Search-result-item">
              {user.username}
              <FaPlus
                onClick={() => handleFollow(user._id)} // Attach handleFollow to the icon
                style={{ cursor: "pointer", marginLeft: "8px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
