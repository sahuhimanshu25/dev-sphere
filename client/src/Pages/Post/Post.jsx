import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa"; // Import thumbs-up icon
import "./Post.css";

function Post({ postData, onLike }) {
  const [liked, setLiked] = useState(
    postData.likes.some((like) => like.user === postData.user._id)
  );

  const handleLike = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/post/post/like/${postData._id}`
      );
      setLiked(!liked);
      onLike(postData._id, data.data.likes);
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
      return (
        <video
          controls
          className="post-video"
          autoPlay={true}
          muted={false} // Ensure autoplay works with sound adjustment
        >
          <source src={value} type="video/mp4" />
        </video>
      );
    }
    return null;
  };

  return (
    <div className="post">
      <div className="post-header">{postData.user.username}</div>
      <div className="post-content">
        {handlePostData()} {}
      </div>
      <button onClick={handleLike} className={liked ? "liked" : ""}>
        <FaThumbsUp className={liked ? "thumbs-up" : "thumbs-up liked"} />(
        {postData.likes.length})
      </button>
    </div>
  );
}

export default Post;
