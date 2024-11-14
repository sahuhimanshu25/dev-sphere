import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  
import { useDispatch } from "react-redux";
import { setUserId } from "../../Slices/postSlice.js"; 
import "./Post.css";
function Post({ postData, onLike }) {
  const [liked, setLiked] = useState(
    postData.likes.some((like) => like.user === postData.user._id)
  );
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/post/post/${postData._id}/comments`
      );
      setComments(data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

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

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      const { data } = await axios.post(
        `http://localhost:3000/post/post/${postData._id}/comment`,
        {
          content: newComment,
        }
      );
      setComments([...comments, data.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/post/post/${postData._id}/comment/${commentId}`
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
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
        <video controls className="post-video" autoPlay={true} muted={false}>
          <source src={value} type="video/mp4" />
        </video>
      );
    }
    return null;
  };

  const handleHeaderClick = () => {
    dispatch(setUserId(postData.user._id));
    navigate(`/user/user-details`, { state: { user: postData.user } });
  };

  return (
    <div className="post">
      <div className="post-header">
        <div onClick={handleHeaderClick}>  {/* Add onClick here */}
          <img src={`${postData.user.avatar}`} alt="" className="post-avatar" />
          <div className="post-username">{postData.user.username}</div>
        </div>
      </div>
      <div className="post-content">{handlePostData()}</div>
      <button onClick={handleLike} className={liked ? "liked" : ""}>
        <FaThumbsUp className={liked ? "thumbs-up" : "thumbs-up liked"} />( 
        {postData.likes.length})
      </button>
      <button
        onClick={() => setShowComments(!showComments)}
        className="show-comments-btn"
      >
        {showComments ? <FaChevronUp /> : <FaChevronDown />} Comments
      </button>

      {showComments && (
        <div className="comments-modal">
          <div className="comments-section">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <span className="comment-owner">{comment.owner.username}:</span>{" "}
                {comment.content}
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="delete-comment-btn"
                >
                  Delete
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            <button onClick={handleAddComment} className="add-comment-btn">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;