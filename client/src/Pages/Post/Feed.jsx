import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import Post from './Post';
import './Feed.css';
import { useSelector } from 'react-redux';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true); // Separate loading for posts
    const { userData, loading: userLoading } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/post/posts/feed');
                setPosts(data.posts); // Correctly sets the posts
                console.log("posts",data.posts);
                
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setPostsLoading(false);
            }
        };
        
        fetchPosts();
        
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts([newPost.data, ...posts]);
    };

    const handleLike = (postId, newLikeCount) => {
        setPosts(posts.map(post =>
            post._id === postId ? { ...post, likes: Array(newLikeCount).fill({}) } : post
        ));
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
            <div className='Seacrh-user'>
                <h2>This is for Search User</h2>
            </div>
        </div>
    );
}

export default Feed;
