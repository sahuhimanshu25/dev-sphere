"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiSend, FiHeart, FiMoreHorizontal } from "react-icons/fi"
import { addComment } from "@/store/slices/postSlice"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"

const CommentsSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.auth)

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await dispatch(addComment({ postId, content: newComment.trim() })).unwrap()
      setNewComment("")
      toast.success("Comment added!")
    } catch (error) {
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <form onSubmit={handleSubmitComment} className="flex space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">{userData?.name?.charAt(0).toUpperCase() || "U"}</span>
        </div>
        <div className="flex-1 flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            disabled={isSubmitting}
          />
          <motion.button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: newComment.trim() && !isSubmitting ? 1.05 : 1 }}
            whileTap={{ scale: newComment.trim() && !isSubmitting ? 0.95 : 1 }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSend size={16} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1">
                <div className="glass rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{comment.author?.name || "Unknown User"}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      <motion.button
                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiMoreHorizontal size={14} />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 ml-3">
                  <motion.button
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiHeart size={12} />
                    <span>{comment.likesCount || 0}</span>
                  </motion.button>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors">Reply</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentsSection
