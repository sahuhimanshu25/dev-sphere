// components/Post.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp } from 'react-icons/fa'; // Import thumbs-up icon
import './Post.css';

function Post({ postData, onLike }) {
    // Determine if the post is liked based on the user's likes
    const [liked, setLiked] = useState(postData.likes.some(like => like.user === postData.user._id));

    // Function to handle the like/unlike action
    const handleLike = async () => {
        try {
            const { data } = await axios.put(`http://localhost:3000/post/post/like/${postData._id}`);
            setLiked(!liked); // Toggle the liked state
            onLike(postData._id, data.data.likes); // Update based on API response
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    useEffect(() => {
        console.log(postData); // Check the structure of your data
    }, [postData]);

    return (
        <div className="post">
            <div className="post-header">{postData.user.username}</div>
            <p className="post-content">{postData.content}</p>
            <button onClick={handleLike} className={liked ? 'liked' : ''}>
                <FaThumbsUp className={liked ? 'thumbs-up' : 'thumbs-up liked'} />
                ({postData.likes.length})
            </button>
        </div>
    );
}

export default Post;
