"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiMoreHorizontal,
  FiCode,
  FiImage,
  FiLink,
} from "react-icons/fi"
import { likePost, bookmarkPost, fetchComments } from "@/store/slices/postSlice"
import { format, formatDistanceToNow } from "date-fns"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import CommentsSection from "./CommentsSection"
import toast from "react-hot-toast"

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.auth)
  const { comments } = useSelector((state) => state.post)

  const handleLike = async () => {
    try {
      await dispatch(likePost(post.id)).unwrap()
    } catch (error) {
      toast.error("Failed to like post")
    }
  }

  const handleBookmark = async () => {
    try {
      await dispatch(bookmarkPost(post.id)).unwrap()
      toast.success(post.bookmarked ? "Removed from bookmarks" : "Added to bookmarks")
    } catch (error) {
      toast.error("Failed to bookmark post")
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`)
      toast.success("Post link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleComments = () => {
    if (!showComments) {
      dispatch(fetchComments(post.id))
    }
    setShowComments(!showComments)
  }

  const getPostTypeIcon = () => {
    switch (post.type) {
      case "code":
        return <FiCode size={16} className="text-green-400" />
      case "image":
        return <FiImage size={16} className="text-blue-400" />
      case "link":
        return <FiLink size={16} className="text-purple-400" />
      default:
        return null
    }
  }

  const renderPostContent = () => {
    const shouldTruncate = post.content && post.content.length > 300 && !showFullContent

    switch (post.type) {
      case "code":
        return (
          <div className="space-y-4">
            {post.content && (
              <p className="text-gray-300 leading-relaxed">
                {shouldTruncate ? `${post.content.substring(0, 300)}...` : post.content}
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="text-purple-400 hover:text-purple-300 ml-2 font-medium"
                  >
                    Show more
                  </button>
                )}
              </p>
            )}
            {post.codeSnippet && (
              <div className="rounded-xl overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                  <span className="text-sm text-gray-400">{post.language || "Code"}</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <SyntaxHighlighter
                  language={post.language || "javascript"}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "14px",
                  }}
                >
                  {post.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            {post.content && (
              <p className="text-gray-300 leading-relaxed">
                {shouldTruncate ? `${post.content.substring(0, 300)}...` : post.content}
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="text-purple-400 hover:text-purple-300 ml-2 font-medium"
                  >
                    Show more
                  </button>
                )}
              </p>
            )}
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
          </div>
        )

      case "link":
        return (
          <div className="space-y-4">
            {post.content && (
              <p className="text-gray-300 leading-relaxed">
                {shouldTruncate ? `${post.content.substring(0, 300)}...` : post.content}
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="text-purple-400 hover:text-purple-300 ml-2 font-medium"
                  >
                    Show more
                  </button>
                )}
              </p>
            )}
            {post.linkUrl && (
              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <FiLink size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1 truncate">{post.linkTitle || "Link"}</h4>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">{post.linkDescription}</p>
                    <a
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Visit Link →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <p className="text-gray-300 leading-relaxed">
            {shouldTruncate ? `${post.content.substring(0, 300)}...` : post.content}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullContent(true)}
                className="text-purple-400 hover:text-purple-300 ml-2 font-medium"
              >
                Show more
              </button>
            )}
          </p>
        )
    }
  }

  return (
    <motion.div className="glass rounded-2xl p-6 card-hover" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-semibold">{post.author?.name?.charAt(0).toUpperCase() || "U"}</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{post.author?.name || "Unknown User"}</h3>
              {getPostTypeIcon()}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex space-x-1">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-purple-400">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && <span className="text-gray-500">+{post.tags.length - 2}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <motion.button
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiMoreHorizontal size={20} />
        </motion.button>
      </div>

      {/* Title */}
      {post.title && <h2 className="text-xl font-bold text-white mb-4">{post.title}</h2>}

      {/* Content */}
      <div className="mb-6">{renderPostContent()}</div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <span>{post.likesCount || 0} likes</span>
          <span>{post.commentsCount || 0} comments</span>
          <span>{post.viewsCount || 0} views</span>
        </div>
        <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-1">
          <motion.button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              post.liked
                ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            }`}
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHeart size={18} className={post.liked ? "fill-current" : ""} />
            <span className="font-medium">{post.likesCount || 0}</span>
          </motion.button>

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            onClick={handleComments}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMessageCircle size={18} />
            <span className="font-medium">{post.commentsCount || 0}</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-1">
          <motion.button
            className="p-2 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiShare2 size={18} />
          </motion.button>

          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              post.bookmarked
                ? "text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20"
                : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            }`}
            onClick={handleBookmark}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiBookmark size={18} className={post.bookmarked ? "fill-current" : ""} />
          </motion.button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <CommentsSection postId={post.id} comments={comments[post.id] || []} />
        </motion.div>
      )}
    </motion.div>
  )
}

export default PostCard
