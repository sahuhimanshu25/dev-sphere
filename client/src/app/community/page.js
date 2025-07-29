"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { FiTrendingUp, FiUsers, FiGlobe, FiPlus } from "react-icons/fi"
import { fetchPosts, setFilter, setSortBy } from "@/store/slices/postSlice"
import Sidebar from "@/components/navigation/Sidebar"
import PostFeed from "@/components/community/PostFeed"
import CreatePostModal from "@/components/community/CreatePostModal"
import TrendingTopics from "@/components/community/TrendingTopics"
import SuggestedUsers from "@/components/community/SuggestedUsers"
import Loader from "@/components/ui/Loader"

const CommunityPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const { isAuthorized } = useSelector((state) => state.auth)
  const { filter, sortBy, loading } = useSelector((state) => state.post)

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login")
      return
    }

    initializeCommunity()
  }, [isAuthorized, router])

  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchPosts({ page: 1, filter, sortBy }))
    }
  }, [filter, sortBy, dispatch, isAuthorized])

  const initializeCommunity = async () => {
    try {
      await dispatch(fetchPosts({ page: 1, filter: "all", sortBy: "latest" }))
      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing community:", error)
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter))
  }

  const handleSortChange = (newSort) => {
    dispatch(setSortBy(newSort))
  }

  if (isLoading) {
    return <Loader fullScreen text="Loading community..." />
  }

  const filterOptions = [
    { value: "all", label: "All Posts", icon: FiGlobe },
    { value: "following", label: "Following", icon: FiUsers },
    { value: "trending", label: "Trending", icon: FiTrendingUp },
  ]

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Popular" },
    { value: "trending", label: "Trending" },
  ]

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
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Developer <span className="gradient-text">Community</span>
              </h1>
              <p className="text-gray-400">Connect, share, and learn with fellow developers</p>
            </div>

            <motion.button
              className="btn-futuristic mt-4 lg:mt-0 flex items-center space-x-2"
              onClick={() => setShowCreatePost(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={20} />
              <span>Create Post</span>
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                <div className="space-y-2">
                  {filterOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <motion.button
                        key={option.value}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                          filter === option.value
                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white"
                            : "hover:bg-white/5 text-gray-300"
                        }`}
                        onClick={() => handleFilterChange(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={18} className={filter === option.value ? "text-purple-400" : "text-gray-400"} />
                        <span className="font-medium">{option.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <TrendingTopics />
            </motion.div>

            {/* Main Content - Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <PostFeed />
            </motion.div>

            {/* Right Sidebar - Suggested Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <SuggestedUsers />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}
    </div>
  )
}

export default CommunityPage
