"use client"

import { useState } from "react"
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import CommentsDrawer from "./CommentsDrawer"

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  return (
    <>
      <div className="card interactive-hover">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={post.user.avatar || "/placeholder.svg"}
                alt={post.user.username}
                className="h-12 w-12 rounded-full ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <p className="font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer">
                {post.user.username}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(post.timestamp).toLocaleDateString()} •<span className="ml-1 text-blue-400">Following</span>
              </p>
            </div>
          </div>

          <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-full">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-100 leading-relaxed">{post.content}</p>
        </div>

        {/* Image Carousel */}
        {post.images.length > 0 && (
          <div className="relative mb-4 group">
            <div className="overflow-hidden rounded-xl">
              <img
                src={post.images[currentImageIndex] || "/placeholder.svg"}
                alt="Post content"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  →
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-300 transform hover:scale-110 ${
                liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              {liked ? <HeartSolidIcon className="h-6 w-6 animate-pulse" /> : <HeartIcon className="h-6 w-6" />}
              <span className="font-medium">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
            >
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              <span className="font-medium">{post.comments.length}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-all duration-300 transform hover:scale-110">
              <ShareIcon className="h-6 w-6" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={`transition-all duration-300 transform hover:scale-110 ${
              bookmarked ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
            }`}
          >
            {bookmarked ? <BookmarkSolidIcon className="h-6 w-6" /> : <BookmarkIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Like preview */}
        {likesCount > 0 && (
          <div className="mt-3 flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/24?img=${i + 10}`}
                  alt={`Liker ${i}`}
                  className="w-6 h-6 rounded-full border-2 border-gray-800"
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Liked by <span className="text-white font-medium">alice_dev</span> and{" "}
              <span className="text-white font-medium">{likesCount - 1} others</span>
            </p>
          </div>
        )}
      </div>

      {showComments && <CommentsDrawer post={post} onClose={() => setShowComments(false)} />}
    </>
  )
}
