 

import React, { useState, useEffect } from "react"
import axios from "axios"
import { FaHeart, FaComment, FaShare, FaUser, FaUsers, FaImage, FaPlay, FaEllipsisH } from "react-icons/fa"
import "./profile.css"
import { useSelector } from "react-redux"
import Loader from "../../components/Loader/Loader"

const Profile = () => {
  const userId = useSelector((state) => state.post.userId)
  // console.log("User ID:", userId)
  const { token } = useSelector((state) => state.user)
  const [avatar, setAvatar] = useState("")
  const [userName, setUserName] = useState("")
  const [bio, setBio] = useState("No bio available")
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available")
      setError("User ID is not available.")
      setLoading(false)
      return
    }
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/${userId}`, {
withCredentials:true
        })
        const userData = response.data?.data?.userdata
        if (userData) {
          setAvatar(userData.avatar || "")
          setUserName(userData.username || "No Name")
          setBio(userData.bio || "No bio available")
          setPosts(userData.posts || [])
          setFollowers(userData.followers || [])
          setFollowing(userData.following || [])
        } else {
          console.error("User data is missing.")
          setError("User data is not available.")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="othpro-loading">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="othpro-error">
        <div className="othpro-error-card">
          <div className="othpro-error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="othpro-retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="othpro-page">
      <div className="othpro-container">
        {/* Profile Header */}
        <div className="othpro-header">
          <div className="othpro-avatar-section">
            <div className="othpro-avatar-wrapper">
              <img
                src={avatar || "/placeholder.svg?height=150&width=150&query=user avatar"}
                alt={`${userName}'s Avatar`}
                className="othpro-avatar"
                onError={(e) => (e.target.src = "/placeholder.svg?height=150&width=150")}
              />
              <div className="othpro-avatar-ring"></div>
            </div>
          </div>

          <div className="othpro-info">
            <div className="othpro-top">
              <h1 className="othpro-username">@{userName}</h1>
              <div className="othpro-actions">
                <button className="othpro-message-button">
                  <span>Message {userName}</span>
                </button>
                <button className="othpro-more-button">
                  <FaEllipsisH />
                </button>
              </div>
            </div>

            <div className="othpro-stats">
              <div className="othpro-stat-item">
                <span className="othpro-stat-number">{posts.length}</span>
                <span className="othpro-stat-label">Posts</span>
              </div>
              <div className="othpro-stat-item">
                <span className="othpro-stat-number">{followers.length}</span>
                <span className="othpro-stat-label">Followers</span>
              </div>
              <div className="othpro-stat-item">
                <span className="othpro-stat-number">{following.length}</span>
                <span className="othpro-stat-label">Following</span>
              </div>
            </div>

            <div className="othpro-bio">
              <p>{bio}</p>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="othpro-nav">
          <button
            className={`othpro-tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            <FaImage className="othpro-tab-icon" />
            <span>Posts</span>
            <span className="othpro-tab-count">{posts.length}</span>
          </button>
          <button
            className={`othpro-tab ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => setActiveTab("followers")}
          >
            <FaUsers className="othpro-tab-icon" />
            <span>Followers</span>
            <span className="othpro-tab-count">{followers.length}</span>
          </button>
          <button
            className={`othpro-tab ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            <FaUser className="othpro-tab-icon" />
            <span>Following</span>
            <span className="othpro-tab-count">{following.length}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="othpro-content">
          {activeTab === "posts" && (
            <div className="othpro-posts-grid">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="othpro-post-item">
                    <div className="othpro-post-media">
                      {post.content.type === "image" ? (
                        <>
                          <img
                            src={post.content.value || "/placeholder.svg"}
                            alt="Post Image"
                            className="othpro-post-image"
                            onError={(e) =>
                              (e.target.src = "/placeholder.svg?height=300&width=300")
                            }
                          />
                          <div className="othpro-media-indicator othpro-image-indicator">
                            <FaImage />
                          </div>
                        </>
                      ) : post.content.type === "video" ? (
                        <>
                          <video className="othpro-post-video" poster="/placeholder.svg?height=300&width=300">
                            <source src={post.content.value} type="video/mp4" />
                          </video>
                          <div className="othpro-media-indicator othpro-video-indicator">
                            <FaPlay />
                          </div>
                        </>
                      ) : (
                        <div className="othpro-post-text">
                          <p>{post.content.value}</p>
                        </div>
                      )}
                    </div>
                    <div className="othpro-post-overlay">
                      <div className="othpro-overlay-stats">
                        <div className="othpro-stat">
                          <FaHeart className="othpro-stat-icon" />
                          <span>{post.likes.length}</span>
                        </div>
                        <div className="othpro-stat">
                          <FaComment className="othpro-stat-icon" />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="othpro-empty-state">
                  <div className="othpro-empty-icon">📸</div>
                  <h3>No posts yet</h3>
                  <p>When {userName} shares photos and videos, they'll appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "followers" && (
            <div className="othpro-users-grid">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <div key={follower._id} className="othpro-user-card">
                    <div className="othpro-user-avatar-small">
                      <img
                        src={follower.avatar || "/placeholder.svg?height=60&width=60&query=user avatar"}
                        alt={`${follower.username}'s avatar`}
                      />
                    </div>
                    <div className="othpro-user-info-small">
                      <h4>@{follower.username}</h4>
                      <p>{follower.bio || "No bio available"}</p>
                    </div>
                    <button className="othpro-follow-button">Follow</button>
                  </div>
                ))
              ) : (
                <div className="othpro-empty-state">
                  <div className="othpro-empty-icon">👥</div>
                  <h3>No followers yet</h3>
                  <p>When people follow {userName}, they'll appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="othpro-users-grid">
              {following.length > 0 ? (
                following.map((user) => (
                  <div key={user._id} className="othpro-user-card">
                    <div className="othpro-user-avatar-small">
                      <img
                        src={user.avatar || "/placeholder.svg?height=60&width=60&query=user avatar"}
                        alt={`${user.username}'s avatar`}
                      />
                    </div>
                    <div className="othpro-user-info-small">
                      <h4>@{user.username}</h4>
                      <p>{user.bio || "No bio available"}</p>
                    </div>
                    <button className="othpro-unfollow-button">Following</button>
                  </div>
                ))
              ) : (
                <div className="othpro-empty-state">
                  <div className="othpro-empty-icon">🔍</div>
                  <h3>Not following anyone</h3>
                  <p>When {userName} follows people, they'll appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile