"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { addNotification } from "@/store/slices/notificationSlice"
import {
  FiBell,
  FiX,
  FiCheck,
  FiUserPlus,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiSettings,
  FiTrash2,
} from "react-icons/fi"
import { formatDistanceToNow } from "date-fns"
import { markNotificationAsRead, deleteNotification, clearAllNotifications } from "@/store/slices/notificationSlice"
import { connectSocket, disconnectSocket } from "@/utils/socket"

const NotificationSystem = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState("all") // all, unread, friends, posts
  const dispatch = useDispatch()

  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications)
  const { isAuthorized, userData } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthorized) {
      // Connect to Socket.IO for real-time notifications
      const socket = connectSocket()

      socket.on("notification", (notification) => {
        // Handle incoming real-time notification
        dispatch(addNotification(notification))
        showToast(notification)
      })

      return () => {
        disconnectSocket()
      }
    }
  }, [isAuthorized, dispatch])

  const showToast = (notification) => {
    // Create toast notification
    const toast = document.createElement("div")
    toast.className = "fixed top-4 right-4 z-50 glass rounded-lg p-4 max-w-sm"
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          ${getNotificationIcon(notification.type)}
        </div>
        <div class="flex-1">
          <p class="text-white font-medium">${notification.title}</p>
          <p class="text-gray-400 text-sm">${notification.message}</p>
        </div>
      </div>
    `

    document.body.appendChild(toast)

    // Animate in
    toast.style.transform = "translateX(100%)"
    toast.style.transition = "transform 0.3s ease"
    setTimeout(() => {
      toast.style.transform = "translateX(0)"
    }, 100)

    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 5000)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
        return '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/></svg>'
      case "message":
        return '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/></svg>'
      case "like":
        return '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>'
      default:
        return '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>'
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await dispatch(deleteNotification(notificationId)).unwrap()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const handleClearAll = async () => {
    try {
      await dispatch(clearAllNotifications()).unwrap()
    } catch (error) {
      console.error("Error clearing notifications:", error)
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read
      case "friends":
        return ["friend_request", "friend_accepted"].includes(notification.type)
      case "posts":
        return ["like", "comment", "share"].includes(notification.type)
      default:
        return true
    }
  })

  const NotificationItem = ({ notification }) => {
    const getIcon = () => {
      switch (notification.type) {
        case "friend_request":
          return <FiUserPlus className="text-blue-400" size={20} />
        case "message":
          return <FiMessageCircle className="text-green-400" size={20} />
        case "like":
          return <FiHeart className="text-red-400" size={20} />
        case "share":
          return <FiShare2 className="text-purple-400" size={20} />
        default:
          return <FiBell className="text-gray-400" size={20} />
      }
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
          !notification.read ? "bg-purple-500/5 border-l-4 border-l-purple-500" : ""
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`font-medium ${notification.read ? "text-gray-300" : "text-white"}`}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div className="flex items-center space-x-2 ml-2">
                {!notification.read && (
                  <motion.button
                    className="p-1 rounded-full hover:bg-green-500/20 text-green-400 transition-colors"
                    onClick={() => handleMarkAsRead(notification.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiCheck size={16} />
                  </motion.button>
                )}

                <motion.button
                  className="p-1 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
                  onClick={() => handleDelete(notification.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTrash2 size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!isAuthorized) return null

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        className="relative p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-16 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] glass rounded-2xl shadow-2xl max-h-[80vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", bounce: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <motion.button
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                  {[
                    { id: "all", label: "All" },
                    { id: "unread", label: "Unread" },
                    { id: "friends", label: "Friends" },
                    { id: "posts", label: "Posts" },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 ${
                        filter === tab.id
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setFilter(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="p-4 border-b border-white/10">
                  <div className="flex space-x-2">
                    <motion.button
                      className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                      onClick={() => {
                        notifications.forEach((n) => {
                          if (!n.read) handleMarkAsRead(n.id)
                        })
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Mark All Read
                    </motion.button>

                    <motion.button
                      className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                      onClick={handleClearAll}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear All
                    </motion.button>

                    <motion.button
                      className="px-3 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiSettings size={16} />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <p className="text-gray-400 mt-4">Loading notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiBell size={48} className="text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-300 mb-2">No notifications</h4>
                    <p className="text-gray-400">
                      {filter === "all" ? "You're all caught up!" : `No ${filter} notifications found`}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default NotificationSystem
