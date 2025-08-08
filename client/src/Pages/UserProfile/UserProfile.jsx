"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaPen } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { BiGridAlt } from "react-icons/bi";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useSelector } from "react-redux";
import UserModal from "./UserModal";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState("This is a detailed description about the user.");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userData, loading: authLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData || authLoading) {
        setIsLoading(true);
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/me`, {
          withCredentials: true,
        });
        // console.log("UserProfile data:", response.data);
        const userData = response.data.data;
        setAvatar(userData.avatar || "");
        setUserName(userData.username || "");
        setBio(userData.bio || "");
        setPosts(userData.posts || []);
        setFollowers(userData.followers || []);
        setFollowing(userData.following || []);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error);
        if (error.response?.status === 401 || error.response?.status === 404) {
          toast.error("Session expired, please log in");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userData, authLoading, navigate]);

  const handleClick = () => {
    navigate(`/user/Edit-profile`, {
      state: { user: { avatar, userName, bio, posts, followers, following } },
    });
  };

  const handleDelete = async (postId) => {
    if (!userData || authLoading) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASEURL}/post/post/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setShowOptions(null);
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        toast.error("Session expired, please log in");
        navigate("/login");
      }
    }
  };

  const toggleOptions = (postId) => {
    setShowOptions((prev) => (prev === postId ? null : postId));
  };

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  const handleAvatarChange = (e) => {
    if (!userData || authLoading) return;
    const file = e.target.files[0];
    if (file) {
      setLoadingAvatar(true);
      setAvatarFile(file);
      const formData = new FormData();
      formData.append("avatar", file);

      axios
        .patch(`${import.meta.env.VITE_BACKEND_BASEURL}/user/updateAvatar`, formData, {
          withCredentials: true,
        })
        .then((response) => {
          // console.log("Avatar updated:", response.data);
          setAvatar(response.data.updatedAvatarUrl);
          setLoadingAvatar(false);
        })
        .catch((error) => {
          console.error("Error uploading avatar:", error.response?.data || error);
          setLoadingAvatar(false);
          toast.error("Failed to update avatar. Please try again later.");
          if (error.response?.status === 401 || error.response?.status === 404) {
            navigate("/login");
          }
        });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="modern-profile-loader">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="modern-user-profile">
        <div className="modern-profile-header">
          <div className="modern-profile-cover">
            <div className="modern-avatar-container">
              <div className="modern-avatar-wrapper">
                <img src={avatar || "/placeholder.svg"} alt="User Avatar" className="modern-avatar" />
                {loadingAvatar && (
                  <div className="modern-avatar-loading">
                    <div className="modern-spinner"></div>
                  </div>
                )}
                <label htmlFor="avatar-upload" className="modern-avatar-edit">
                  <FaPen />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>

          <div className="modern-profile-info">
            <div className="modern-profile-details">
              <h1 className="modern-username">{userName}</h1>
              <p className="modern-bio">{bio}</p>
            </div>

            <div className="modern-stats-container">
              <div className="modern-stat-item">
                <span className="modern-stat-number">{posts.length}</span>
                <span className="modern-stat-label">Posts</span>
              </div>
              <div className="modern-stat-item modern-clickable" onClick={() => openModal("followers")}>
                <span className="modern-stat-number">{followers.length}</span>
                <span className="modern-stat-label">Followers</span>
              </div>
              <div className="modern-stat-item modern-clickable" onClick={() => openModal("following")}>
                <span className="modern-stat-number">{following.length}</span>
                <span className="modern-stat-label">Following</span>
              </div>
            </div>

            <div className="modern-actions">
              <button className="modern-edit-btn" onClick={handleClick}>
                <FaPen />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="modern-posts-section">
          <div className="modern-posts-header">
            <div className="modern-posts-title">
              <BiGridAlt />
              <span>Posts</span>
            </div>
          </div>

          <div className="modern-posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="modern-post-item">
                  <div className="modern-post-content">
                    {post.content.type === "image" ? (
                      <img src={post.content.value || "/placeholder.svg"} alt="Post" />
                    ) : post.content.type === "video" ? (
                      <video src={post.content.value} />
                    ) : (
                      <div className="modern-text-post">
                        <p>{post.content.value}</p>
                      </div>
                    )}
                  </div>

                  <div className="modern-post-overlay">
                    <div className="modern-post-stats">
                      <span className="modern-likes">
                        <FaHeart />
                        {post.likes.length}
                      </span>
                    </div>
                  </div>

                  <div className="modern-post-options">
                    <button
                      className="modern-options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOptions(post._id);
                      }}
                    >
                      <SlOptionsVertical />
                    </button>
                    {showOptions === post._id && (
                      <div className="modern-options-menu">
                        <button className="modern-delete-btn" onClick={() => handleDelete(post._id)}>
                          <RiDeleteBin3Fill />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="modern-no-posts">
                <BiGridAlt />
                <p>No posts yet</p>
                <span>Share your first post to get started!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalType && (
        <UserModal
          type={modalType}
          users={modalType === "followers" ? followers : following}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default UserProfile;