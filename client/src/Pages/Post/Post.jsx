// // components/Post.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaThumbsUp } from 'react-icons/fa'; // Import thumbs-up icon
// import './Post.css';

// function Post({ postData, onLike }) {
//     // Determine if the post is liked based on the user's likes
//     const [liked, setLiked] = useState(postData.likes.some(like => like.user === postData.user._id));

//     // Function to handle the like/unlike action
//     const handleLike = async () => {
//         try {
//             const { data } = await axios.put(`http://localhost:3000/post/post/like/${postData._id}`);
//             setLiked(!liked); // Toggle the liked state
//             onLike(postData._id, data.data.likes); // Update based on API response
//         } catch (error) {
//             console.error("Error liking post:", error);
//         }
//     };

//     useEffect(() => {
//         console.log(postData); // Check the structure of your data
//     }, [postData]);

//     const handlePostData=()=>{
//         const type=postData.content.type;
//         if(type==="text"){
//             return "text";
//         }else if(type==="image" || type==="video"){
//             return "iv"
//         }
//     }
//     return (
//         <div className="post">
//             <div className="post-header">{postData.user.username}</div>
//             <p className="post-content">{if(handlwPost===text){
                
//             }}</p>
//             <button onClick={handleLike} className={liked ? 'liked' : ''}>
//                 <FaThumbsUp className={liked ? 'thumbs-up' : 'thumbs-up liked'} />
//                 ({postData.likes.length})
//             </button>
//         </div>
//     );
// }

// export default Post;



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

    const handlePostData = () => {
        const { type, value } = postData.content;

        if (type === "text") {
            return <p>{value}</p>;
        } else if (type === "image") {
            return <img src={value} alt="Post content" className="post-image" />;
        } else if (type === "video") {
            return <video controls className="post-video"><source src={value} type="video/mp4" /></video>;
        }
        return null;
    };

    return (
        <div className="post">
            <div className="post-header">{postData.user.username}</div>
            <div className="post-content">
                {handlePostData()} {/* Display appropriate content based on post type */}
            </div>
            <button onClick={handleLike} className={liked ? 'liked' : ''}>
                <FaThumbsUp className={liked ? 'thumbs-up' : 'thumbs-up liked'} />
                ({postData.likes.length})
            </button>
        </div>
    );
}

export default Post;
