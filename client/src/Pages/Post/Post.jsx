 

import { useState, useEffect, useCallback, useMemo } from "react"
import axios from "axios"
import { FaRegComment, FaShareAlt, FaHeart, FaRegHeart } from "react-icons/fa"
import { BiDotsVerticalRounded, BiDownload } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUserId } from "../../Slices/postSlice.js"
import { formatDistanceToNow } from "date-fns";
import "./Post.css"

function Post({ postData, onLike }) {
  const { token, userData } = useSelector((state) => state.user)
  const [liked, setLiked] = useState(postData.likes.some((like) => like.user === userData?._id))
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

    const formatTimestamp = useCallback(() => {
    const postDate = new Date(postData.createdAt);
    const now = new Date();

    // Using date-fns (if installed)
    // return formatDistanceToNow(postDate, { addSuffix: true });

    // Manual implementation without date-fns
    const diffInMs = now - postDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else {
      // For dates older than 30 days, you can show a formatted date
      return postDate.toLocaleDateString();
    }
  }, [postData.createdAt]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axios.get(`/post/post/${postData._id}/comments`, {
withCredentials:true
      })
      setComments(data.data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }, [postData._id, token])

  useEffect(() => {
    if (showComments) {
      fetchComments()
      // console.log(postData.user.avatar)
    }
  }, [showComments, fetchComments])

  const handleLike = useCallback(async () => {
    const previousLiked = liked
    const newLiked = !liked
    setLiked(newLiked) // Optimistic update

    try {
      const { data } = await axios.put(
        `/post/post/like/${postData._id}`,
        {},
        {
withCredentials:true
        }
      )
      // Confirm the server response
      setLiked(data.data.liked) // Sync with server
      onLike(postData._id, data.data.likes)
    } catch (error) {
      console.error("Error liking post:", error)
      setLiked(previousLiked) // Revert on error
    }
  }, [postData._id, token, onLike, liked])

  const handleAddComment = useCallback(async () => {
    if (!newComment) return
    try {
      const { data } = await axios.post(
        `/post/post/${postData._id}/comment`,
        {
          content: newComment,
        },
        {
withCredentials:true
        }
      )
      setComments((prev) => [...prev, data.data])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }, [newComment, postData._id, token])

  const handleHeaderClick = useCallback(() => {
    dispatch(setUserId(postData.user._id))
    navigate(`/user/user-details`, { state: { user: postData.user } })
  }, [dispatch, navigate, postData.user])

  const handlePostData = useCallback(() => {
    const { type, value } = postData.content

    if (type === "text") {
      return <p className="post-text-content">{value}</p>
    } else if (type === "image") {
      return <img src={value || "/placeholder.svg"} alt="Post content" className="post-image" />
    } else if (type === "video") {
      return (
        <video controls className="post-video" autoPlay muted loop>
          <source src={value} type="video/mp4" />
        </video>
      )
    }
    return null
  }, [postData.content])

  const handleDownload = useCallback(async () => {
    // console.log(postData)
  }, [postData])

  const handleShare = useCallback(async () => {
    const { type, value } = postData.content
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this post!",
          url: window.location.href,
          text: type === "text" ? value : "Check out this media!",
        })
      } else {
        alert("Sharing is not supported on your browser.")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }, [postData.content])

  const memoizedPostContent = useMemo(() => handlePostData(), [handlePostData])

  const memoizedComments = useMemo(() => {
    return comments.map((comment) => (
      <div key={comment._id} className="comment-item">
        <img src={comment.owner.avatar || "/placeholder.svg"} alt="avatar" className="comment-avatar" />
        <div className="comment-content">
          <span className="comment-owner">{comment.owner.username}</span>
          <p className="comment-text">{comment.content}</p>
        </div>
      </div>
    ))
  }, [comments])

  if (!postData || !postData.user || !postData.user.avatar) {
    return (
      <div className="post-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info" onClick={handleHeaderClick}>
          <img src={`${postData.user.avatar}`} alt="" className="post-avatar" />
          <div className="user-details">
            <div className="post-username">{postData.user.username}</div>
            <div className="post-timestamp">{formatTimestamp()}</div>
          </div>
        </div>

      </div>

      <div className="post-content">{memoizedPostContent}</div>

      <div className="post-actions">
        <button onClick={handleLike} className={`action-btn like-btn ${liked ? "liked" : ""}`}>
          <div className="icon-with-text">
            {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            <span>{postData.likes.length}</span>
          </div>
        </button>

        <button onClick={() => setShowComments((prev) => !prev)} className="action-btn comment-btn">
          <div className="icon-with-text">
            <FaRegComment size={20} />
          </div>
        </button>

        <button onClick={handleShare} className="action-btn share-btn">
          <div className="icon-with-text">
            <FaShareAlt size={20} />
          </div>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">{memoizedComments}</div>

          <div className="add-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button onClick={handleAddComment} className="add-comment-btn">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Post