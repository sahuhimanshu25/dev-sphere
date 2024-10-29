// components/Feed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import Post from './Post';
import './Feed.css';

function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/post/posts/feed');
                setPosts(data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts([newPost.data, ...posts]); // Use newPost.data to match the response structure
    };

    const handleLike = (postId, newLikeCount) => {
        setPosts(posts.map(post =>
            post._id === postId ? { ...post, likes: Array(newLikeCount).fill({}) } : post
        ));
    };

    return (
        <div className="feed">
            <CreatePost onPostCreated={handlePostCreated} />
            {posts.map((post) => (
                <Post key={post._id} postData={post} onLike={handleLike} />
            ))}
        </div>
    );
}

export default Feed;
