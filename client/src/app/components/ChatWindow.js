"use client"

import { useState, useRef, useEffect } from "react"
import {
  PaperAirplaneIcon,
  PhotoIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

export default function ChatWindow({ user }) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hey! How are you doing? 👋",
      sender: "other",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: "2",
      content: "I'm doing great! Working on a new React project with some amazing features.",
      sender: "me",
      timestamp: "10:32 AM",
      type: "text",
    },
    {
      id: "3",
      content: "That sounds awesome! What kind of project? I'd love to hear more about it 🚀",
      sender: "other",
      timestamp: "10:33 AM",
      type: "text",
    },
    {
      id: "4",
      content: "It's a social platform for developers! Check out this screenshot:",
      sender: "me",
      timestamp: "10:35 AM",
      type: "text",
    },
    {
      id: "5",
      content: "https://picsum.photos/300/200?random=1",
      sender: "me",
      timestamp: "10:35 AM",
      type: "image",
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      }
      setMessages([...messages, newMessage])
      setMessage("")

      // Simulate typing indicator
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const response = {
          id: (Date.now() + 1).toString(),
          content: "That looks incredible! Great work 👏",
          sender: "other",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        }
        setMessages((prev) => [...prev, response])
      }, 2000)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900/50">
      {/* Header */}
      <div className="p-6 border-b border-white/10 glass-effect">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.username}
                className="h-12 w-12 rounded-full ring-2 ring-blue-500/30"
              />
              <div
                className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-gray-800 ${
                  user.isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              />
            </div>
            <div>
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-sm text-gray-400">{user.isOnline ? "Active now" : "Last seen 2h ago"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-blue-400">
              <PhoneIcon className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-green-400">
              <VideoCameraIcon className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <InformationCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md ${msg.sender === "me" ? "order-2" : "order-1"}`}>
              {msg.type === "text" ? (
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "me"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                      : "bg-gray-700/50 text-gray-100 rounded-bl-md"
                  } animate-fade-in`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              ) : msg.type === "image" ? (
                <div className="animate-fade-in">
                  <img
                    src={msg.content || "/placeholder.svg"}
                    alt="Shared image"
                    className="rounded-2xl max-w-full h-auto shadow-lg"
                  />
                </div>
              ) : null}

              <p className={`text-xs text-gray-400 mt-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700/50 rounded-2xl px-4 py-3 rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <PhotoIcon className="h-5 w-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="input-field w-full pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaceSmileIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
