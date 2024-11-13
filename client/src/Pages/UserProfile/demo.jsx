import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState("This is a detailed description about the user."); // Example description
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me");
        const userData = response.data.data;
        console.log(response);
        
        // Ensure avatar URL is correctly handled
        setAvatar(userData.avatar ? userData.avatar : ""); // Handling potential missing URL

        setUserName(userData.username || "");
        setBio(userData.bio || "");
        setPosts(userData.posts || []);
        setFollowers(userData.followers ? userData.followers.length : 0); // Count number of followers
        setFollowing(userData.following ? userData.following.length : 0); // Count number of following
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar">
          {/* Ensure the avatar image is correctly displayed */}
          <img src={avatar} alt="User Avatar" />
        </div>
        <div className="profile-info">
          <h2>{userName}</h2>
          <div className="stats">
            <span><strong>{posts.length}</strong> Posts</span>
            <span><strong>{followers}</strong> Followers</span>
            <span><strong>{following}</strong> Following</span>
          </div>
          <p className="bio">{bio}</p>
          <p className="description">{description}</p>
        </div>
      </div>
      <div className="posts-grid">
        {posts.map((post, index) => (
          <div key={index} className="post-item">
            {/* Handle content based on type: image, video, or text */}
            {post.content.type === "image" ? (
              <img src={post.content.value} alt="Post Image" />
            ) : post.content.type === "video" ? (
              <video controls src={post.content.value}></video>
            ) : (
              <p>{post.content.value}</p>
            )}
            <div className="overlay">
              <div className="overlay-info">
                <span><FaHeart /> {post.likes.length}</span> {/* Display number of likes */}
                <span><FaComment /> {post.comments.length}</span> {/* Display number of comments */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export {UserProfile};
response.data.data.username