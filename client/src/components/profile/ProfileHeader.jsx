"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import {
  FiEdit3,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiMessageCircle,
  FiMoreHorizontal,
  FiMapPin,
  FiCalendar,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiGlobe,
} from "react-icons/fi"
import { sendFriendRequest, followUser, unfollowUser, removeFriend } from "@/store/slices/userSlice"
import { format } from "date-fns"
import EditProfileModal from "./EditProfileModal"
import toast from "react-hot-toast"

const ProfileHeader = ({ profile, isOwnProfile = false }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.auth)

  const handleFriendAction = async (action) => {
    if (!profile?.id || isActionLoading) return

    setIsActionLoading(true)
    try {
      switch (action) {
        case "send_request":
          await dispatch(sendFriendRequest(profile.id)).unwrap()
          toast.success("Friend request sent!")
          break
        case "remove_friend":
          await dispatch(removeFriend(profile.id)).unwrap()
          toast.success("Friend removed")
          break
        case "follow":
          await dispatch(followUser(profile.id)).unwrap()
          toast.success("User followed!")
          break
        case "unfollow":
          await dispatch(unfollowUser(profile.id)).unwrap()
          toast.success("User unfollowed")
          break
      }
    } catch (error) {
      toast.error("Action failed. Please try again.")
    } finally {
      setIsActionLoading(false)
    }
  }

  const getFriendButtonConfig = () => {
    if (isOwnProfile) return null

    const friendStatus = profile?.friendStatus || "none"
    const isFollowing = profile?.isFollowing || false

    switch (friendStatus) {
      case "friends":
        return {
          icon: FiUserCheck,
          text: "Friends",
          action: "remove_friend",
          className: "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400",
        }
      case "request_sent":
        return {
          icon: FiUserX,
          text: "Request Sent",
          action: "cancel_request",
          className: "bg-yellow-500/20 text-yellow-400 hover:bg-red-500/20 hover:text-red-400",
        }
      case "request_received":
        return {
          icon: FiUserPlus,
          text: "Accept Request",
          action: "accept_request",
          className: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
        }
      default:
        return {
          icon: FiUserPlus,
          text: "Add Friend",
          action: "send_request",
          className: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
        }
    }
  }

  const friendButtonConfig = getFriendButtonConfig()

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 relative">
        <div className="absolute inset-0 bg-black/20" />
        {profile?.coverImage && (
          <img src={profile.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        )}

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          {/* Left Section - Avatar and Basic Info */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Avatar */}
            <div className="relative -mt-16 lg:-mt-20 mb-4 lg:mb-0">
              <motion.div
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1 mx-auto lg:mx-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl lg:text-5xl font-bold text-white">
                      {profile?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Online Status */}
              {profile?.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full" />
              )}
            </div>

            {/* Basic Info */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{profile?.name || "Unknown User"}</h1>

              {profile?.username && <p className="text-lg text-gray-400 mb-3">@{profile.username}</p>}

              {profile?.bio && <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{profile.bio}</p>}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-400 mb-4">
                {profile?.location && (
                  <div className="flex items-center space-x-1">
                    <FiMapPin size={16} />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile?.joinedAt && (
                  <div className="flex items-center space-x-1">
                    <FiCalendar size={16} />
                    <span>Joined {format(new Date(profile.joinedAt), "MMMM yyyy")}</span>
                  </div>
                )}

                {profile?.company && (
                  <div className="flex items-center space-x-1">
                    <span>Works at {profile.company}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profile?.socialLinks?.github ||
                profile?.socialLinks?.twitter ||
                profile?.socialLinks?.linkedin ||
                profile?.website) && (
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                  {profile.socialLinks?.github && (
                    <motion.a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiGithub size={20} />
                    </motion.a>
                  )}

                  {profile.socialLinks?.twitter && (
                    <motion.a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiTwitter size={20} />
                    </motion.a>
                  )}

                  {profile.socialLinks?.linkedin && (
                    <motion.a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiLinkedin size={20} />
                    </motion.a>
                  )}

                  {profile?.website && (
                    <motion.a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiGlobe size={20} />
                    </motion.a>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-white text-lg">{profile?.stats?.postsCount || 0}</div>
                  <div className="text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-lg">{profile?.stats?.friendsCount || 0}</div>
                  <div className="text-gray-400">Friends</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-lg">{profile?.stats?.followersCount || 0}</div>
                  <div className="text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-lg">{profile?.stats?.followingCount || 0}</div>
                  <div className="text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center space-x-3 mt-6 lg:mt-0">
            {isOwnProfile ? (
              <motion.button
                className="btn-futuristic flex items-center space-x-2"
                onClick={() => setShowEditModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit3 size={18} />
                <span>Edit Profile</span>
              </motion.button>
            ) : (
              <>
                {/* Friend/Follow Button */}
                {friendButtonConfig && (
                  <motion.button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${friendButtonConfig.className}`}
                    onClick={() => handleFriendAction(friendButtonConfig.action)}
                    disabled={isActionLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActionLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <friendButtonConfig.icon size={18} />
                    )}
                    <span>{friendButtonConfig.text}</span>
                  </motion.button>
                )}

                {/* Follow Button (separate from friend status) */}
                <motion.button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    profile?.isFollowing
                      ? "bg-blue-500/20 text-blue-400 hover:bg-red-500/20 hover:text-red-400"
                      : "bg-gray-500/20 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400"
                  }`}
                  onClick={() => handleFriendAction(profile?.isFollowing ? "unfollow" : "follow")}
                  disabled={isActionLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{profile?.isFollowing ? "Following" : "Follow"}</span>
                </motion.button>

                {/* Message Button */}
                <motion.button
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiMessageCircle size={20} />
                </motion.button>

                {/* More Options */}
                <motion.button
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiMoreHorizontal size={20} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && <EditProfileModal profile={profile} onClose={() => setShowEditModal(false)} />}
    </div>
  )
}

export default ProfileHeader
