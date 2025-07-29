"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiUserPlus, FiUsers, FiCheck } from "react-icons/fi"
import toast from "react-hot-toast"

const SuggestedUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [followingUsers, setFollowingUsers] = useState(new Set())

  useEffect(() => {
    fetchSuggestedUsers()
  }, [])

  const fetchSuggestedUsers = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockUsers = [
        {
          id: 1,
          name: "Alex Johnson",
          username: "alexdev",
          avatar: null,
          bio: "Full-stack developer passionate about React and Node.js",
          followers: 1234,
          isFollowing: false,
        },
        {
          id: 2,
          name: "Sarah Chen",
          username: "sarahcodes",
          avatar: null,
          bio: "Frontend engineer specializing in modern web technologies",
          followers: 987,
          isFollowing: false,
        },
        {
          id: 3,
          name: "Mike Rodriguez",
          username: "mikedev",
          avatar: null,
          bio: "Backend developer and DevOps enthusiast",
          followers: 756,
          isFollowing: false,
        },
        {
          id: 4,
          name: "Emma Wilson",
          username: "emmacodes",
          avatar: null,
          bio: "Mobile app developer and UI/UX designer",
          followers: 543,
          isFollowing: false,
        },
      ]

      setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching suggested users:", error)
      setLoading(false)
    }
  }

  const handleFollow = async (userId) => {
    try {
      // Mock API call - replace with actual implementation
      setFollowingUsers((prev) => new Set([...prev, userId]))
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isFollowing: true, followers: user.followers + 1 } : user)),
      )
      toast.success("User followed!")
    } catch (error) {
      toast.error("Failed to follow user")
      setFollowingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleUnfollow = async (userId) => {
    try {
      // Mock API call - replace with actual implementation
      setFollowingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: false, followers: user.followers - 1 } : user,
        ),
      )
      toast.success("User unfollowed!")
    } catch (error) {
      toast.error("Failed to unfollow user")
      setFollowingUsers((prev) => new Set([...prev, userId]))
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiUsers className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Suggested Users</h3>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <FiUsers className="text-blue-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Suggested Users</h3>
      </div>

      <div className="space-y-4">
        {users.map((user, index) => {
          const isFollowing = user.isFollowing || followingUsers.has(user.id)

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">{user.name.charAt(0).toUpperCase()}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white truncate">{user.name}</h4>
                  <motion.button
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      isFollowing
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                    }`}
                    onClick={() => (isFollowing ? handleUnfollow(user.id) : handleFollow(user.id))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isFollowing ? (
                      <>
                        <FiCheck size={14} className="inline mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={14} className="inline mr-1" />
                        Follow
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-sm text-gray-400 mb-1">@{user.username}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{user.bio}</p>
                <p className="text-xs text-gray-400">{user.followers.toLocaleString()} followers</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.button
        className="w-full mt-4 p-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View All Suggestions
      </motion.button>
    </motion.div>
  )
}

export default SuggestedUsers
