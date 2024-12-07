import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Show loader
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data.data;
        setAvatar(userData.avatar || "");
        setUserName(userData.username || "");
        setBio(userData.bio || "");
        setPosts(userData.posts || []);
        setFollowers(userData.followers || []);
        setFollowing(userData.following || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    };
    fetchUserData();
  }, [token]);

  const handleClick = () => {
    navigate(`/user/Edit-profile`, {
      state: { user: { avatar, userName, bio, posts, followers, following } },
    });
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setShowOptions(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleOptions = (postId) => {
    setShowOptions((prev) => (prev === postId ? null : postId));
  };

  const toggleActiveList = (list) => {
    const blur = document.getElementById("user-profile");
    blur.classList.toggle("blur-active");
    setActiveList((prevState) => (prevState === list ? null : list));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingAvatar(true); // Show loader for avatar upload
      const formData = new FormData();
      formData.append("avatar", file);
      axios
        .patch(
          `${import.meta.env.VITE_BACKEND_BASEURL}/user/updateAvatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setAvatar(response.data.updatedAvatarUrl);
        })
        .catch((error) => {
          console.error("Error uploading avatar:", error);
          alert("Failed to update avatar. Please try again later.");
        })
        .finally(() => {
          setLoadingAvatar(false); // Hide loader
        });
    }
  };

  return (
    <>
      <div>
        {isLoading && (
          <div className="loader-container-userProf">
            <Loader />
          </div>
        )}
      </div>

      <div className="user-profile" id="user-profile">
        <div className="p-top">
          <div className="profile-header">
            <div className="avatar">
              <img src={avatar} alt="User Avatar" />
              <label htmlFor="avatar-upload" className="avatar-edit-label">
                <FaPen className="avatar-edit-pencil" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
            <div className="profile-info">
              <h2>{userName}</h2>
              <div className="stats">
                <span>
                  <strong>{posts.length}</strong> Posts
                </span>
                <span
                  onClick={() => toggleActiveList("followers")}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{followers.length}</strong> Followers
                </span>
                <span
                  onClick={() => toggleActiveList("following")}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{following.length}</strong> Following
                </span>
              </div>
              <p className="bio">{bio}</p>
            </div>
          </div>
        </div>

        <div className="post-in">
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
      </div>
    </>
  );
};

export default UserProfile;
