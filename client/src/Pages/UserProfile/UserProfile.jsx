import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { RiDeleteBin3Fill } from "react-icons/ri";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState(
    "This is a detailed description about the user."
  );
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showOptions, setShowOptions] = useState(null);  // State to track which post has options shown

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me");
        const userData = response.data.data;
        setAvatar(userData.avatar || "");
        setUserName(userData.username || "");
        setBio(userData.bio || "");
        setPosts(userData.posts || []);
        setFollowers(userData.followers || []);
        setFollowing(userData.following || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleClick = () => {
    navigate(`/user/Edit-profile`, {
      state: { user: { avatar, userName, bio, posts, followers, following } },
    });
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/post/post/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setShowOptions(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleOptions = (postId) => {
    setShowOptions((prev) => (prev === postId ? null : postId)); 
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar">
          <img src={avatar} alt="User Avatar" />
        </div>
        <div className="profile-info">
          <h2>{userName}</h2>
          <div className="stats">
            <span>
              <strong>{posts.length}</strong> Posts
            </span>
            <span>
              <strong>{followers.length}</strong> Followers
            </span>
            <span>
              <strong>{following.length}</strong> Following
            </span>
          </div>
          <p className="bio">{bio}</p>
        </div>
      </div>

      <div className="edit-profile">
        <button onClick={handleClick}>Edit Profile</button>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            {post.content.type === "image" ? (
              <img src={post.content.value} alt="Post Image" />
            ) : post.content.type === "video" ? (
              <video controls src={post.content.value}></video>
            ) : (
              <p>{post.content.value}</p>
            )}
            <div
              className="options-icon"
              onClick={(e) => {
                e.stopPropagation(); 
                toggleOptions(post._id);
              }}
            >
              <SlOptionsVertical size={24} />
            </div>
            {showOptions === post._id && (
              <div className="delete-option">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(post._id)}
                >
                  <RiDeleteBin3Fill size={20} />
                  Delete
                </button>
              </div>
            )}

            <div className="overlay">
              <div className="overlay-info">
                <span>
                  <FaHeart /> {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;