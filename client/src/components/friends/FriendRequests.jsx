"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiUserPlus, FiUserCheck, FiUserX, FiClock, FiSend } from "react-icons/fi"
import { respondToFriendRequest } from "@/store/slices/userSlice"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState("received") // received, sent
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const { friendRequests } = useSelector((state) => state.user)

  // Mock data - replace with actual data from Redux store
  const mockReceivedRequests = [
    {
      id: 1,
      sender: {
        id: 101,
        name: "Alex Johnson",
        username: "alexdev",
        avatar: null,
        bio: "Full-stack developer passionate about React and Node.js",
        location: "San Francisco, CA",
        mutualFriends: 3,
        skills: ["React", "Node.js", "TypeScript"],
      },
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      message: "Hi! I saw your post about React hooks and would love to connect!",
    },
    {
      id: 2,
      sender: {
        id: 102,
        name: "Sarah Chen",
        username: "sarahcodes",
        avatar: null,
        bio: "Frontend engineer specializing in modern web technologies",
        location: "New York, NY",
        mutualFriends: 1,
        skills: ["Vue.js", "CSS", "JavaScript"],
      },
      sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  ]

  const mockSentRequests = [
    {
      id: 3,
      recipient: {
        id: 103,
        name: "Mike Rodriguez",
        username: "mikedev",
        avatar: null,
        bio: "Backend developer and DevOps enthusiast",
        location: "Austin, TX",
        skills: ["Python", "Docker", "AWS"],
      },
      sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: "pending",
    },
    {
      id: 4,
      recipient: {
        id: 104,
        name: "Emma Wilson",
        username: "emmacodes",
        avatar: null,
        bio: "Mobile app developer and UI/UX designer",
        location: "Seattle, WA",
        skills: ["Flutter", "Figma", "Swift"],
      },
      sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "pending",
    },
  ]

  const handleRequestResponse = async (requestId, action) => {
    setIsLoading(true)
    try {
      await dispatch(respondToFriendRequest({ requestId, action })).unwrap()
      toast.success(action === "accept" ? "Friend request accepted!" : "Friend request declined")
    } catch (error) {
      toast.error("Failed to respond to friend request")
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    {
      id: "received",
      label: "Received",
      icon: FiUserPlus,
      count: mockReceivedRequests.length,
    },
    {
      id: "sent",
      label: "Sent",
      icon: FiSend,
      count: mockSentRequests.length,
    },
  ]

  const RequestCard = ({ request, type }) => {
    const user = type === "received" ? request.sender : request.recipient
    const isReceived = type === "received"

    return (
      <motion.div
        className="glass rounded-xl p-6 card-hover"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start space-x-4">
          {/* Avatar */}
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
            {isReceived && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <FiUserPlus size={12} className="text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{user.name}</h3>
                {user.username && <p className="text-sm text-gray-400">@{user.username}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatDistanceToNow(request.sentAt, { addSuffix: true })}</p>
                {!isReceived && (
                  <div className="flex items-center space-x-1 mt-1">
                    <FiClock size={12} className="text-yellow-400" />
                    <span className="text-xs text-yellow-400 capitalize">{request.status}</span>
                  </div>
                )}
              </div>
            </div>

            {user.bio && <p className="text-sm text-gray-400 line-clamp-2 mb-3">{user.bio}</p>}

            {/* Message (for received requests) */}
            {isReceived && request.message && (
              <div className="bg-white/5 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-300 italic">"{request.message}"</p>
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              {user.location && <span>{user.location}</span>}
              {user.mutualFriends > 0 && <span>{user.mutualFriends} mutual friends</span>}
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
            {isReceived ? (
              <div className="flex space-x-3">
                <motion.button
                  className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium flex items-center justify-center space-x-2"
                  onClick={() => handleRequestResponse(request.id, "accept")}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUserCheck size={16} />
                  <span>Accept</span>
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium flex items-center justify-center space-x-2"
                  onClick={() => handleRequestResponse(request.id, "decline")}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUserX size={16} />
                  <span>Decline</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <motion.button
                  className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Profile
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Tabs */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Friend Requests</h2>
            <p className="text-gray-400">Manage your incoming and outgoing friend requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <motion.button
                key={tab.id}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all flex-1 ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-md"
                    layoutId="activeRequestTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon size={18} className={isActive ? "text-purple-400" : ""} />
                <span className="relative z-10">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="relative z-10 bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === "received" ? (
            <motion.div
              key="received"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {mockReceivedRequests.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                    <FiUserPlus size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-300">No friend requests</h3>
                  <p className="text-gray-400">You don't have any pending friend requests</p>
                </div>
              ) : (
                mockReceivedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} type="received" />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {mockSentRequests.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                    <FiSend size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-300">No sent requests</h3>
                  <p className="text-gray-400">You haven't sent any friend requests yet</p>
                </div>
              ) : (
                mockSentRequests.map((request) => <RequestCard key={request.id} request={request} type="sent" />)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FriendRequests
