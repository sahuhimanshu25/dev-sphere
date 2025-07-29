"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiGrid, FiList, FiFilter } from "react-icons/fi"
import PostCard from "@/components/community/PostCard"
import Loader from "@/components/ui/Loader"

const ProfilePosts = ({ userId }) => {
  const [viewMode, setViewMode] = useState("grid") // grid, list
  const [filter, setFilter] = useState("all") // all, posts, code, images
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  const { posts, loading } = useSelector((state) => state.post)
  const { userData } = useSelector((state) => state.auth)

  const isOwnProfile = userId === userData?.id

  useEffect(() => {
    fetchUserPosts()
  }, [userId, filter])

  const fetchUserPosts = async () => {
    try {
      // Mock API call - replace with actual implementation
      setIsLoading(true)
      // await dispatch(fetchPosts({ userId, filter }))

      // Mock delay
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching user posts:", error)
      setIsLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true
    return post.type === filter
  })

  const filterOptions = [
    { value: "all", label: "All Posts" },
    { value: "text", label: "Text Posts" },
    { value: "code", label: "Code Snippets" },
    { value: "image", label: "Images" },
    { value: "link", label: "Links" },
  ]

  if (isLoading || loading) {
    return <Loader text="Loading posts..." />
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{isOwnProfile ? "My Posts" : "Posts"}</h2>
            <p className="text-gray-400">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" size={18} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
              <motion.button
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setViewMode("grid")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiGrid size={16} />
              </motion.button>
              <motion.button
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setViewMode("list")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiList size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-6"}>
        {filteredPosts.length === 0 ? (
          <div className="col-span-full">
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <FiGrid size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-300">No posts yet</h3>
              <p className="text-gray-400 mb-8">
                {isOwnProfile ? "Share your first post with the community!" : "This user hasn't shared any posts yet."}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default ProfilePosts
