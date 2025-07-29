"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiSearch, FiPlus, FiMessageCircle, FiSettings, FiCheck, FiCheckCheck } from "react-icons/fi"
import { setActiveConversation, setSearchResults, setSearching } from "@/store/slices/chatSlice"
import { socketManager } from "@/utils/socket"
import { format } from "date-fns"
import axios from "axios"

const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const dispatch = useDispatch()

  const { userData, token } = useSelector((state) => state.auth)
  const { conversations, activeConversation, onlineUsers, unreadCounts, isSearching, searchResults } = useSelector(
    (state) => state.chat,
  )

  const handleConversationClick = (conversationId) => {
    dispatch(setActiveConversation(conversationId))
    socketManager.joinConversation(conversationId)
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      dispatch(setSearching(true))
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/chat/search?q=${encodeURIComponent(query)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        )
        dispatch(setSearchResults(response.data.results || []))
      } catch (error) {
        console.error("Search error:", error)
        dispatch(setSearchResults([]))
      } finally {
        dispatch(setSearching(false))
      }
    } else {
      dispatch(setSearchResults([]))
      dispatch(setSearching(false))
    }
  }

  const getLastMessagePreview = (conversation) => {
    if (!conversation.lastMessage) return "No messages yet"

    const message = conversation.lastMessage
    if (message.type === "image") return "📷 Image"
    if (message.type === "file") return "📎 File"
    return message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content
  }

  const getMessageStatus = (message) => {
    if (!message || message.senderId !== userData?.id) return null

    switch (message.status) {
      case "sent":
        return <FiCheck size={14} className="text-gray-400" />
      case "delivered":
        return <FiCheckCheck size={14} className="text-gray-400" />
      case "read":
        return <FiCheckCheck size={14} className="text-blue-400" />
      default:
        return null
    }
  }

  const isUserOnline = (userId) => {
    return onlineUsers.some((user) => user.id === userId)
  }

  const getConversationName = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name || "Group Chat"
    }

    // For direct messages, show the other participant's name
    const otherParticipant = conversation.participants?.find((p) => p.id !== userData?.id)
    return otherParticipant?.name || "Unknown User"
  }

  const getConversationAvatar = (conversation) => {
    if (conversation.type === "group") {
      return conversation.avatar || "/default-group.png"
    }

    const otherParticipant = conversation.participants?.find((p) => p.id !== userData?.id)
    return otherParticipant?.avatar || "/default-avatar.png"
  }

  const sortedConversations = Object.values(conversations).sort((a, b) => {
    const aTime = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(a.createdAt)
    const bTime = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(b.createdAt)
    return bTime - aTime
  })

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Messages</h1>
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowNewChatModal(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiPlus size={20} />
            </motion.button>
            <motion.button
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiSettings size={20} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-center">
            <div className="loading-dots mx-auto mb-2">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-gray-400 text-sm">Searching...</p>
          </div>
        ) : searchQuery ? (
          <div className="p-2">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <motion.div
                  key={result.id}
                  className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => handleConversationClick(result.conversationId)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold">{result.name?.charAt(0) || "?"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{result.name}</p>
                      <p className="text-sm text-gray-400 truncate">{result.preview}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-400">No results found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            <AnimatePresence>
              {sortedConversations.map((conversation, index) => {
                const isActive = activeConversation === conversation.id
                const unreadCount = unreadCounts[conversation.id] || 0
                const otherParticipant = conversation.participants?.find((p) => p.id !== userData?.id)
                const isOnline = otherParticipant ? isUserOnline(otherParticipant.id) : false

                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                        : "hover:bg-white/5"
                    }`}
                    onClick={() => handleConversationClick(conversation.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {getConversationName(conversation).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {conversation.type === "direct" && isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-medium truncate ${isActive ? "text-white" : "text-gray-200"}`}>
                            {getConversationName(conversation)}
                          </p>
                          <div className="flex items-center space-x-1">
                            {conversation.lastMessage && getMessageStatus(conversation.lastMessage)}
                            {conversation.lastMessageTime && (
                              <span className="text-xs text-gray-400">
                                {format(new Date(conversation.lastMessageTime), "HH:mm")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400 truncate">{getLastMessagePreview(conversation)}</p>
                          {unreadCount > 0 && (
                            <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {sortedConversations.length === 0 && (
              <div className="p-8 text-center">
                <FiMessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No conversations yet</p>
                <p className="text-gray-500 text-sm mb-4">Start a new conversation to begin chatting</p>
                <motion.button
                  className="btn-futuristic px-4 py-2 text-sm"
                  onClick={() => setShowNewChatModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start New Chat
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatSidebar
