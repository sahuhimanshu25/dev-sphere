// components/CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:3000/post/post', { content });
            onPostCreated(data); // Pass the full response to the Feed component
            setContent('');
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="create-post">
            <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="post-textarea"
            />
            <button 
                onClick={handleSubmit}
                className="post-button"
            >
                Post
            </button>
        </div>
    );
}

export default CreatePost;
