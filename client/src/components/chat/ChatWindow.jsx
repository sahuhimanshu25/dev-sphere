"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiArrowLeft,
  FiImage,
  FiFile,
} from "react-icons/fi"
import { socketManager } from "@/utils/socket"
import { addMessage, clearUnreadCount } from "@/store/slices/chatSlice"
import MessageBubble from "@/components/chat/MessageBubble"
import TypingIndicator from "@/components/chat/TypingIndicator"

const ChatWindow = () => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const fileInputRef = useRef(null)

  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.auth)
  const { conversations, activeConversation, messages, typing, onlineUsers } = useSelector((state) => state.chat)

  const currentConversation = conversations[activeConversation]
  const currentMessages = messages[activeConversation] || []
  const currentTyping = typing[activeConversation] || {}

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  useEffect(() => {
    if (activeConversation) {
      dispatch(clearUnreadCount(activeConversation))
      socketManager.markAsRead(
        activeConversation,
        currentMessages.filter((msg) => msg.senderId !== userData?.id).map((msg) => msg.id),
      )
    }
  }, [activeConversation, currentMessages, dispatch, userData])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversation) return

    const newMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      senderId: userData?.id,
      senderName: userData?.name,
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sending",
    }

    // Add message to local state immediately
    dispatch(
      addMessage({
        conversationId: activeConversation,
        message: newMessage,
      }),
    )

    // Send via socket
    socketManager.sendMessage(activeConversation, message.trim())

    setMessage("")
    handleStopTyping()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = (value) => {
    setMessage(value)

    if (!isTyping) {
      setIsTyping(true)
      socketManager.startTyping(activeConversation)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping()
    }, 1000)
  }

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false)
      socketManager.stopTyping(activeConversation)
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const handleFileUpload = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "*/*"
      fileInputRef.current.click()
    }
    setShowAttachments(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file)
      // You would typically upload the file to your server and then send the message
    }
  }

  const getConversationName = () => {
    if (!currentConversation) return ""

    if (currentConversation.type === "group") {
      return currentConversation.name || "Group Chat"
    }

    const otherParticipant = currentConversation.participants?.find((p) => p.id !== userData?.id)
    return otherParticipant?.name || "Unknown User"
  }

  const getOnlineStatus = () => {
    if (currentConversation?.type === "group") {
      const onlineCount = currentConversation.participants?.filter((p) => onlineUsers.some((u) => u.id === p.id)).length
      return `${onlineCount} online`
    }

    const otherParticipant = currentConversation?.participants?.find((p) => p.id !== userData?.id)
    const isOnline = otherParticipant ? onlineUsers.some((u) => u.id === otherParticipant.id) : false
    return isOnline ? "Online" : "Offline"
  }

  if (!currentConversation) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-white/10 glass flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowLeft size={20} />
          </motion.button>

          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-semibold">{getConversationName().charAt(0).toUpperCase()}</span>
            </div>
            {currentConversation.type === "direct" && getOnlineStatus() === "Online" && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-white">{getConversationName()}</h2>
            <p className="text-sm text-gray-400">{getOnlineStatus()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiPhone size={20} />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiVideo size={20} />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMoreVertical size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {currentMessages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === userData?.id}
              showAvatar={
                index === 0 ||
                currentMessages[index - 1]?.senderId !== msg.senderId ||
                new Date(msg.timestamp) - new Date(currentMessages[index - 1]?.timestamp) > 300000
              }
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {Object.keys(currentTyping).length > 0 && (
          <TypingIndicator users={Object.keys(currentTyping).map((userId) => ({ id: userId, name: "User" }))} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-t border-white/10 glass"
      >
        <div className="flex items-end space-x-3">
          {/* Attachments */}
          <div className="relative">
            <motion.button
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowAttachments(!showAttachments)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiPaperclip size={20} />
            </motion.button>

            <AnimatePresence>
              {showAttachments && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 glass rounded-lg p-2 space-y-1"
                >
                  <motion.button
                    className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    onClick={() => handleFileUpload("image")}
                    whileHover={{ scale: 1.02 }}
                  >
                    <FiImage size={16} />
                    <span className="text-sm">Image</span>
                  </motion.button>
                  <motion.button
                    className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    onClick={() => handleFileUpload("file")}
                    whileHover={{ scale: 1.02 }}
                  >
                    <FiFile size={16} />
                    <span className="text-sm">File</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />

            {/* Emoji Button */}
            <motion.button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiSmile size={20} />
            </motion.button>
          </div>

          {/* Send Button */}
          <motion.button
            className="btn-futuristic p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            whileHover={{ scale: message.trim() ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() ? 0.95 : 1 }}
          >
            <FiSend size={20} />
          </motion.button>
        </div>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      </motion.div>
    </div>
  )
}

export default ChatWindow
