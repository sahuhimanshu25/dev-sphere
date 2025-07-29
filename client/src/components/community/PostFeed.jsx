"use client"

import { useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { fetchPosts } from "@/store/slices/postSlice"
import PostCard from "./PostCard"
import Loader from "@/components/ui/Loader"
import { FiRefreshCw } from "react-icons/fi"

const PostFeed = () => {
  const dispatch = useDispatch()
  const { posts, loading, hasMore, page, filter, sortBy } = useSelector((state) => state.post)

  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchPosts({ page: page + 1, filter, sortBy }))
    }
  }, [dispatch, loading, hasMore, page, filter, sortBy])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosts()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMorePosts])

  const handleRefresh = () => {
    dispatch(fetchPosts({ page: 1, filter, sortBy }))
  }

  if (loading && posts.length === 0) {
    return <Loader text="Loading posts..." />
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          {filter === "all" && "All Posts"}
          {filter === "following" && "Following"}
          {filter === "trending" && "Trending Posts"}
        </h2>
        <motion.button
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          onClick={handleRefresh}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={loading}
        >
          <motion.div
            animate={{ rotate: loading ? 360 : 0 }}
            transition={{ duration: 1, repeat: loading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          >
            <FiRefreshCw size={20} />
          </motion.div>
        </motion.button>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post, index) => (
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

      {/* Loading More */}
      {loading && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <Loader size="sm" text="Loading more posts..." />
        </div>
      )}

      {/* No More Posts */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">You've reached the end!</p>
        </div>
      )}

      {/* No Posts */}
      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <FiRefreshCw size={48} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-300">No posts yet</h3>
          <p className="text-gray-400 mb-8">Be the first to share something with the community!</p>
        </div>
      )}
    </div>
  )
}

export default PostFeed
