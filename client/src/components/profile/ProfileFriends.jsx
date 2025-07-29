"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiSearch, FiUserPlus, FiUserCheck, FiMessageCircle, FiMoreHorizontal, FiUsers } from "react-icons/fi"
import { fetchFriends, removeFriend } from "@/store/slices/userSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const ProfileFriends = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all") // all, online, mutual
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const { friends, loading } = useSelector((state) => state.user)
  const { userData } = useSelector((state) => state.auth)

  const isOwnProfile = userId === userData?.id

  useEffect(() => {
    if (userId) {
      dispatch(fetchFriends(userId))
    }
  }, [userId, dispatch])

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    switch (filter) {
      case "online":
        return friend.isOnline
      case "mutual":
        return friend.isMutual
      default:
        return true
    }
  })

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return

    try {
      await dispatch(removeFriend(friendId)).unwrap()
      toast.success("Friend removed successfully")
    } catch (error) {
      toast.error("Failed to remove friend")
    }
  }

  const handleSendMessage = (friendId) => {
    router.push(`/chat?user=${friendId}`)
  }

  const handleViewProfile = (friendId) => {
    router.push(`/profile/${friendId}`)
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/10 rounded-full"></div>
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
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{isOwnProfile ? "My Friends" : "Friends"}</h2>
            <p className="text-gray-400">
              {friends.length} {friends.length === 1 ? "friend" : "friends"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="all" className="bg-gray-800">
                All Friends
              </option>
              <option value="online" className="bg-gray-800">
                Online
              </option>
              <option value="mutual" className="bg-gray-800">
                Mutual Friends
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Friends Grid */}
      <div className="glass rounded-2xl p-6">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <FiUsers size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">
              {searchQuery ? "No friends found" : "No friends yet"}
            </h3>
            <p className="text-gray-400 mb-8">
              {searchQuery
                ? "Try adjusting your search or filter criteria"
                : isOwnProfile
                  ? "Start connecting with other developers in the community"
                  : "This user hasn't added any friends yet"}
            </p>
            {isOwnProfile && !searchQuery && (
              <motion.button
                className="btn-futuristic flex items-center space-x-2 mx-auto"
                onClick={() => router.push("/addChat")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUserPlus size={20} />
                <span>Find Friends</span>
              </motion.button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass rounded-xl p-6 card-hover group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          {friend.avatar ? (
                            <img
                              src={friend.avatar || "/placeholder.svg"}
                              alt={friend.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-xl">
                              {friend.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                          {friend.name}
                        </h3>
                        {friend.username && <p className="text-sm text-gray-400 truncate">@{friend.username}</p>}
                        {friend.title && <p className="text-xs text-gray-500 truncate mt-1">{friend.title}</p>}
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

                  {friend.bio && <p className="text-sm text-gray-400 line-clamp-2 mb-4">{friend.bio}</p>}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{friend.mutualFriends || 0} mutual friends</span>
                    <span>Friends since {friend.friendsSince || "recently"}</span>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                      onClick={() => handleViewProfile(friend.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>View Profile</span>
                    </motion.button>

                    <motion.button
                      className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center"
                      onClick={() => handleSendMessage(friend.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiMessageCircle size={16} />
                    </motion.button>

                    {isOwnProfile && (
                      <motion.button
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
                        onClick={() => handleRemoveFriend(friend.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiUserCheck size={16} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileFriends
