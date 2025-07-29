"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { FiSearch, FiUsers, FiUserPlus, FiFilter, FiRefreshCw } from "react-icons/fi"
import { fetchSuggestedFriends, fetchFriends } from "@/store/slices/userSlice"
import Sidebar from "@/components/navigation/Sidebar"
import SearchUsers from "@/components/friends/SearchUsers"
import SuggestedFriends from "@/components/friends/SuggestedFriends"
import FriendRequests from "@/components/friends/FriendRequests"
import NearbyUsers from "@/components/friends/NearbyUsers"
import ImportContacts from "@/components/friends/ImportContacts"
import Loader from "@/components/ui/Loader"

const AddFriendsPage = () => {
  const [activeTab, setActiveTab] = useState("search")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()

  const { isAuthorized } = useSelector((state) => state.auth)
  const { suggestedFriends, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login")
      return
    }

    initializeFriendDiscovery()
  }, [isAuthorized, router])

  const initializeFriendDiscovery = async () => {
    try {
      await Promise.all([dispatch(fetchSuggestedFriends()), dispatch(fetchFriends("me"))])
      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing friend discovery:", error)
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "search", label: "Search", icon: FiSearch, description: "Find users by name or username" },
    { id: "suggestions", label: "Suggestions", icon: FiUsers, description: "Discover people you might know" },
    { id: "requests", label: "Requests", icon: FiUserPlus, description: "Manage friend requests" },
    { id: "nearby", label: "Nearby", icon: FiFilter, description: "Find users near your location" },
    { id: "import", label: "Import", icon: FiRefreshCw, description: "Import from other platforms" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchUsers />
      case "suggestions":
        return <SuggestedFriends />
      case "requests":
        return <FriendRequests />
      case "nearby":
        return <NearbyUsers />
      case "import":
        return <ImportContacts />
      default:
        return <SearchUsers />
    }
  }

  if (isLoading) {
    return <Loader fullScreen text="Loading friend discovery..." />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />

      <div className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Find <span className="gradient-text">Friends</span>
            </h1>
            <p className="text-gray-400">Discover and connect with fellow developers</p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-2 mb-8"
          >
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <motion.button
                    key={tab.id}
                    className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all whitespace-nowrap min-w-0 ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <Icon size={20} className={isActive ? "text-purple-400" : ""} />
                    <div className="text-left">
                      <div className="relative z-10 font-semibold">{tab.label}</div>
                      <div className="relative z-10 text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AddFriendsPage
