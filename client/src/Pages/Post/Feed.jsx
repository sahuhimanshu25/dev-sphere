import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import Post from "./Post";
import CodingTip from "./CodingTip";
import "./Feed.css";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";
import { logout } from "../../Slices/authSlice.js";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const { userData, loading: userLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await axios.get(`/post/posts/feed`, { withCredentials: true });
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        dispatch(logout());
        window.location.replace("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to fetch posts.");
      }
    } finally {
      setPostsLoading(false);
    }
  }, []);

  const fetchRecommendedUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`/user/recommended-users`, { withCredentials: true });
      setRecommendedUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching recommended users:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        dispatch(logout());
        window.location.replace("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to fetch recommended users.");
      }
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchRecommendedUsers();
  }, [fetchPosts, fetchRecommendedUsers]);

  const handlePostCreated = useCallback((createdPostResponse) => {
    console.log("New post created:", createdPostResponse);
    setPosts((prevPosts) => [createdPostResponse.post, ...prevPosts]);
  }, []);

  const handleLike = useCallback((postId, updatedLikes) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: updatedLikes } : post
      )
    );
  }, []);

  const handleFollow = useCallback(async (userId) => {
    try {
      await axios.put(`/follow/${userId}`, {}, { withCredentials: true });
      await axios.post(`/chat/create`, { receiverId: userId }, { withCredentials: true });
      toast.success("User followed successfully!");
    } catch (error) {
      console.error("Error following user:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        dispatch(logout());
        window.location.replace("/login");
      } else {
        toast.error(error.response?.data?.error || "Error following user");
      }
    }
  }, []);

  const memoizedPosts = useMemo(() => {
    return posts
      .filter((p) => p && p._id)
      .map((post) => <Post key={post._id} postData={post} onLike={handleLike} />);
  }, [posts, handleLike]);

  const memoizedRecommendedUsers = useMemo(() => {
    return recommendedUsers.length > 0 ? (
      <div className="recommended-users">
        {recommendedUsers.map((user) => (
          <div key={user._id} className="user-card">
            <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="user-avatar" />
            <div className="user-info">
              <span className="username">{user.username}</span>
            </div>
            <button className="follow-btn" onClick={() => handleFollow(user._id)}>
              <FaPlus />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="no-users">
        <p>No recommended users found.</p>
      </div>
    );
  }, [recommendedUsers, handleFollow]);

  if (userLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <p>Please log in to access this resource.</p>
      </div>
    );
  }

  if (postsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed">
        <div className="main-content">
          <CreatePost onPostCreated={handlePostCreated} />
          <div className="posts-grid">{memoizedPosts}</div>
        </div>

        <div className="feed-sidebar">
          <CodingTip />
          <div className="recommended-section">
            <div className="section-header">
              <FaUsers className="section-icon" />
              <h2>Discover People</h2>
            </div>
            <div className="recommended-users-container">{memoizedRecommendedUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;