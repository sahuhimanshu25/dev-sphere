"use client"

import { motion } from "framer-motion"
import { FiCheck, FiCheckCheck, FiClock } from "react-icons/fi"
import { format, isToday, isYesterday } from "date-fns"

const MessageBubble = ({ message, isOwn, showAvatar }) => {
  const getMessageStatus = () => {
    if (!isOwn) return null

    switch (message.status) {
      case "sending":
        return <FiClock size={12} className="text-gray-400" />
      case "sent":
        return <FiCheck size={12} className="text-gray-400" />
      case "delivered":
        return <FiCheckCheck size={12} className="text-gray-400" />
      case "read":
        return <FiCheckCheck size={12} className="text-blue-400" />
      default:
        return null
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "HH:mm")}`
    } else {
      return format(date, "MMM dd, HH:mm")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end space-x-2`}
    >
      {/* Avatar for received messages */}
      {!isOwn && showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">{message.senderName?.charAt(0).toUpperCase() || "?"}</span>
        </div>
      )}

      {!isOwn && !showAvatar && <div className="w-8" />}

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-1" : "order-2"}`}>
        {/* Sender name for group chats */}
        {!isOwn && showAvatar && <p className="text-xs text-gray-400 mb-1 px-3">{message.senderName || "Unknown"}</p>}

        <motion.div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md"
              : "glass text-gray-100 rounded-bl-md"
          }`}
          whileHover={{ scale: 1.02 }}
        >
          {/* Message content based on type */}
          {message.type === "text" && <p className="text-sm leading-relaxed">{message.content}</p>}

          {message.type === "image" && (
            <div className="space-y-2">
              <img
                src={message.content || "/placeholder.svg"}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: "300px" }}
              />
              {message.caption && <p className="text-sm">{message.caption}</p>}
            </div>
          )}

          {message.type === "file" && (
            <div className="flex items-center space-x-3 p-2 bg-black/20 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                <span className="text-xs font-mono">{message.fileName?.split(".").pop()?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.fileName}</p>
                <p className="text-xs text-gray-400">{message.fileSize}</p>
              </div>
            </div>
          )}

          {/* Timestamp and status */}
          <div className={`flex items-center justify-end space-x-1 mt-1 ${isOwn ? "text-white/70" : "text-gray-400"}`}>
            <span className="text-xs">{formatTime(message.timestamp)}</span>
            {getMessageStatus()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
