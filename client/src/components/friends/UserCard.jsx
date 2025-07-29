"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiUserPlus, FiMessageCircle, FiMapPin, FiUsers, FiStar, FiMoreHorizontal, FiEye } from "react-icons/fi"
import { sendFriendRequest, followUser, unfollowUser } from "@/store/slices/userSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const UserCard = ({ user }) => {
  const [isActionLoading, setIsActionLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { userData } = useSelector((state) => state.auth)

  const handleFriendRequest = async () => {
    if (isActionLoading) return

    setIsActionLoading(true)
    try {
      await dispatch(sendFriendRequest(user.id)).unwrap()
      toast.success("Friend request sent!")
    } catch (error) {
      toast.error("Failed to send friend request")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleFollow = async () => {
    if (isActionLoading) return

    setIsActionLoading(true)
    try {
      if (user.isFollowing) {
        await dispatch(unfollowUser(user.id)).unwrap()
        toast.success("User unfollowed")
      } else {
        await dispatch(followUser(user.id)).unwrap()
        toast.success("User followed!")
      }
    } catch (error) {
      toast.error("Action failed")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleMessage = () => {
    router.push(`/chat?user=${user.id}`)
  }

  const handleViewProfile = () => {
    router.push(`/profile/${user.id}`)
  }

  const getFriendStatus = () => {
    switch (user.friendStatus) {
      case "friends":
        return { text: "Friends", color: "text-green-400", bg: "bg-green-500/20" }
      case "request_sent":
        return { text: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/20" }
      case "request_received":
        return { text: "Accept", color: "text-blue-400", bg: "bg-blue-500/20" }
      default:
        return { text: "Add Friend", color: "text-purple-400", bg: "bg-purple-500/20" }
    }
  }

  const friendStatus = getFriendStatus()

  return (
    <motion.div
      className="glass rounded-2xl p-6 card-hover group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-xl">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full" />
            )}
            {user.isPremium && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <FiStar size={12} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
              {user.name}
            </h3>
            {user.username && <p className="text-sm text-gray-400 truncate">@{user.username}</p>}
            {user.title && <p className="text-xs text-gray-500 truncate">{user.title}</p>}
          </div>
        </div>

        <motion.button
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiMoreHorizontal size={16} />
        </motion.button>
      </div>

      {/* Bio */}
      {user.bio && <p className="text-sm text-gray-400 line-clamp-2 mb-4">{user.bio}</p>}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-3">
          {user.location && (
            <div className="flex items-center space-x-1">
              <FiMapPin size={12} />
              <span>{user.location}</span>
            </div>
          )}
          {user.mutualFriends > 0 && (
            <div className="flex items-center space-x-1">
              <FiUsers size={12} />
              <span>{user.mutualFriends} mutual</span>
            </div>
          )}
        </div>
        {user.distance && <span>{user.distance}km away</span>}
      </div>

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {user.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {skill}
            </span>
          ))}
          {user.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
              +{user.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <motion.button
          className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center space-x-1 ${friendStatus.bg} ${friendStatus.color} hover:opacity-80`}
          onClick={handleFriendRequest}
          disabled={isActionLoading || user.friendStatus === "friends"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isActionLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiUserPlus size={14} />
          )}
          <span>{friendStatus.text}</span>
        </motion.button>

        <motion.button
          className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center"
          onClick={handleViewProfile}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiEye size={14} />
        </motion.button>

        <motion.button
          className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center"
          onClick={handleMessage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiMessageCircle size={14} />
        </motion.button>
      </div>

      {/* Follow Button */}
      <motion.button
        className={`w-full mt-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
          user.isFollowing
            ? "bg-gray-500/20 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
            : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
        }`}
        onClick={handleFollow}
        disabled={isActionLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </motion.button>
    </motion.div>
  )
}

export default UserCard
