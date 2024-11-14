import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import "./profile.css";
import { useSelector } from "react-redux";
const Profile = ({}) => {
  const userId = useSelector((state) => state.post.userId);
  console.log("User ID:", userId);

  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState(
    "This is a detailed description about the user."
  );
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}`);
        const userData = response.data.data.userdata;
        console.log(userData)
        if (userData) {
          setAvatar(userData.avatar || "");
          setUserName(userData.username || "No Name");
          setBio(userData.bio || "No bio available");
          setPosts(userData.posts || []);
          setFollowers(userData.followers || []);
          setFollowing(userData.following || []);
        } else {
          console.error("User data is missing.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }
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
          <p className="description">{description}</p>
        </div>
      </div>
      <div className="edit-profile">
        <button>Message {userName}</button>
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
export default Profile;