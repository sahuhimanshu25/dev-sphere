import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import Post from './Post';
import './Feed.css';
import { useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const { userData, loading: userLoading } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/post/posts/feed`);
                setPosts(data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setPostsLoading(false);
            }
        };

        const fetchRecommendedUsers = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/recommended-users`);
                setRecommendedUsers(data.data);
            } catch (error) {
                console.error("Error fetching recommended users:", error);
                toast.error("Failed to fetch recommended users.");
            }
        };

        fetchPosts();
        fetchRecommendedUsers();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts([newPost.data, ...posts]);
    };

    const handleLike = (postId, newLikeCount) => {
        setPosts(posts.map(post =>
            post._id === postId ? { ...post, likes: Array(newLikeCount).fill({}) } : post
        ));
    };

    const handleFollow = async (userId) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_BASEURL}/follow/${userId}`);
            await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/chat/create`, { receiverId: userId });
            toast.success("User followed successfully!");
        } catch (error) {
            console.error("Error following user:", error);
            toast.error(error.response?.data?.error || "Error following user");
        }
    };

    if (userLoading) {
        return <div>Loading user data...</div>;
    }

    if (!userData) {
        return <div>Please log in to access this resource.</div>;
    }

    if (postsLoading) {
        return <div>Loading posts...</div>;
    }

    return (
        <div className="feed">
            <div className='posts'>
                <CreatePost onPostCreated={handlePostCreated} />
                {posts.map((post) => (
                    <Post key={post._id} postData={post} onLike={handleLike} />
                ))}
            </div>
            <div className="separator"></div>
            <div className='Search-user'>
                <div className="rec-top">
                <h2> 
                    <span>Recommended</span>
                    <span>Users</span>
                </h2>
                </div>
                <div className="rec-users-list">
                {recommendedUsers.length > 0 ? (
                    <div className="recommended-users">
                        {recommendedUsers.map(user => (
                            <div key={user._id} className="recommended-user-item">
                                <img src={user.avatar} alt={user.username} className="user-avatar" />
                                <span>{user.username}</span>
                                <FaPlus
                                    onClick={() => handleFollow(user._id)}
                                    style={{ cursor: "pointer", marginLeft: "8px" ,color:'white'}}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recommended users found.</p>
                )}
                </div>
            </div>
        </div>
    );
}

export default Feed;
