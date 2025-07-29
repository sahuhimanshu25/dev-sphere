"use client"

<<<<<<< HEAD
import { useState } from "react"
import Layout from "../components/Layout"
import ChatSidebar from "../components/ChatSidebar"
import ChatWindow from "../components/ChatWindow"
import { chatUsers } from "../lib/dummyData"

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(chatUsers[0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = chatUsers.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex">
        <ChatSidebar
          users={filteredUsers}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ChatWindow user={selectedUser} />
      </div>
    </Layout>
  )
}
=======
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { socketManager } from "@/utils/socket"
import { setConversations, setMessages } from "@/store/slices/chatSlice"
import Sidebar from "@/components/navigation/Sidebar"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import WelcomeScreen from "@/components/chat/WelcomeScreen"
import Loader from "@/components/ui/Loader"
import axios from "axios"

const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()

  const { isAuthorized, token, userData } = useSelector((state) => state.auth)
  const { conversations, activeConversation, isConnected } = useSelector((state) => state.chat)

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login")
      return
    }

    initializeChat()
  }, [isAuthorized, router, token])

  const initializeChat = async () => {
    try {
      // Connect to socket
      socketManager.connect(dispatch, token)

      // Fetch conversations
      const conversationsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })

      const conversationsData = conversationsResponse.data.conversations || {}
      dispatch(setConversations(conversationsData))

      // Fetch messages for each conversation
      for (const conversationId of Object.keys(conversationsData)) {
        try {
          const messagesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/chat/messages/${conversationId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            },
          )

          dispatch(
            setMessages({
              conversationId,
              messages: messagesResponse.data.messages || [],
            }),
          )
        } catch (error) {
          console.error(`Error fetching messages for conversation ${conversationId}:`, error)
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing chat:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup socket connection on unmount
      socketManager.disconnect()
    }
  }, [])

  if (isLoading) {
    return <Loader fullScreen text="Loading your conversations..." />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />

      <div className="lg:ml-64 flex h-screen">
        {/* Chat Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col"
        >
          <ChatSidebar />
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {activeConversation ? <ChatWindow /> : <WelcomeScreen />}
        </motion.div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 glass rounded-lg px-4 py-2 flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Reconnecting...</span>
        </motion.div>
      )}
    </div>
  )
}

export default ChatPage
>>>>>>> 09c7f749f77f35c97009f99a04ac2d17a917f862
