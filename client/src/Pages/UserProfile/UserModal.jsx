"use client"
import { FaTimes, FaUsers, FaUserPlus } from "react-icons/fa"
import "./UserModal.css"

const UserModal = ({ type, users, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modern-modal-backdrop" onClick={handleBackdropClick}>
      <div className="modern-modal-container">
        <div className="modern-modal-header">
          <div className="modern-modal-title">
            {type === "followers" ? <FaUsers /> : <FaUserPlus />}
            <h2>{type === "followers" ? "Followers" : "Following"}</h2>
            <span className="modern-modal-count">({users.length})</span>
          </div>
          <button className="modern-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modern-modal-content">
          {users.length > 0 ? (
            <div className="modern-users-list">
              {users.map((user) => (
                <div key={user._id} className="modern-user-item">
                  <div className="modern-user-avatar">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  </div>
                  <div className="modern-user-info">
                    <span className="modern-user-name">{user.username}</span>
                    <span className="modern-user-bio">{user.bio || "No bio available"}</span>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
            <div className="modern-empty-state">
              {type === "followers" ? <FaUsers /> : <FaUserPlus />}
              <h3>No {type} yet</h3>
              <p>
                {type === "followers"
                  ? "When people follow you, they'll appear here."
                  : "When you follow people, they'll appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserModal
