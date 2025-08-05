"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaRegComment, FaShareAlt, FaHeart, FaRegHeart } from "react-icons/fa"
import { BiDotsVerticalRounded, BiDownload } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUserId } from "../../Slices/postSlice.js"
import "./Post.css"

function Post({ postData, onLike }) {
  const [liked, setLiked] = useState(postData.likes.some((like) => like.user === postData.user._id))
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const { token } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (showComments) {
      fetchComments()
      console.log(postData.user.avatar)
    }
  }, [showComments])

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/post/post/${postData._id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setComments(data.data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleLike = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post/like/${postData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setLiked(!liked)
      onLike(postData._id, data.data.likes)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment) return
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/post/post/${postData._id}/comment`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setComments([...comments, data.data])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleHeaderClick = () => {
    dispatch(setUserId(postData.user._id))
    navigate(`/user/user-details`, { state: { user: postData.user } })
  }

  const handlePostData = () => {
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
  }

  const handleDownload = async () => {
    console.log(postData)
  }

  const handleShare = async () => {
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
  }

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
            <div className="post-timestamp">2 hours ago</div>
          </div>
        </div>
        <div className="post-options">
          <button className="options-toggle" onClick={() => setShowOptions(!showOptions)}>
            <BiDotsVerticalRounded />
          </button>
          {showOptions && (
            <div className="options-menu">
              <button onClick={handleDownload} className="option-btn">
                <BiDownload /> Download
              </button>
              <button onClick={handleShare} className="option-btn">
                <FaShareAlt /> Share
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">{handlePostData()}</div>

      <div className="post-actions">
        <button onClick={handleLike} className={`action-btn like-btn ${liked ? "liked" : ""}`}>
    <div className="icon-with-text">
      {liked ? <FaHeart size={20}/> : <FaRegHeart size={20} />}
      <span>{postData.likes.length}</span>
    </div>
  </button>

        <button onClick={() => setShowComments(!showComments)} className="action-btn comment-btn">
          <div className="icon-with-text">

          <FaRegComment size={20} />
          </div>
          
        </button>

        <button onClick={handleShare} className="action-btn share-btn">
          <div className="icon-with-text">

          <FaShareAlt size={20}/>
          </div>
          
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <img src={comment.owner.avatar || "/placeholder.svg"} alt="avatar" className="comment-avatar" />
                <div className="comment-content">
                  <span className="comment-owner">{comment.owner.username}</span>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

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
