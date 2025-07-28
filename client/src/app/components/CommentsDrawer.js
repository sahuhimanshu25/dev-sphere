"use client"

import { useState } from "react"
import { XMarkIcon, PaperAirplaneIcon, HeartIcon } from "@heroicons/react/24/outline"

export default function CommentsDrawer({ post, onClose }) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: "1",
      user: {
        username: "alice_dev",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      content: "This is amazing! Great work on the implementation 🚀",
      timestamp: new Date().toISOString(),
      likes: 12,
      replies: [
        {
          id: "1-1",
          user: {
            username: "bob_coder",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          content: "I agree! The performance improvements are incredible.",
          timestamp: new Date().toISOString(),
          likes: 3,
        },
      ],
    },
    {
      id: "2",
      user: {
        username: "charlie_js",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      content: "Thanks for sharing this! Really helpful for my current project.",
      timestamp: new Date().toISOString(),
      likes: 8,
      replies: [],
    },
  ])

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: {
          username: "johndoe",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
      <div className="glass-card w-full max-w-md h-3/4 rounded-t-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold gradient-text">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ height: "calc(100% - 140px)" }}>
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex space-x-3">
                <img
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.username}
                  className="h-10 w-10 rounded-full flex-shrink-0 ring-2 ring-blue-500/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-700/50 rounded-2xl px-4 py-3">
                    <p className="font-medium text-white text-sm mb-1">{comment.user.username}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  </div>

                  <div className="flex items-center space-x-4 mt-2 ml-4">
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors text-sm">
                      <HeartIcon className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Reply</button>
                    <span className="text-gray-500 text-xs">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <img
                            src={reply.user.avatar || "/placeholder.svg"}
                            alt={reply.user.username}
                            className="h-8 w-8 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-700/30 rounded-xl px-3 py-2">
                              <p className="font-medium text-white text-xs mb-1">{reply.user.username}</p>
                              <p className="text-gray-300 text-xs">{reply.content}</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-1 ml-3">
                              <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors text-xs">
                                <HeartIcon className="h-3 w-3" />
                                <span>{reply.likes}</span>
                              </button>
                              <span className="text-gray-500 text-xs">
                                {new Date(reply.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitComment} className="p-6 border-t border-white/10">
          <div className="flex space-x-3">
            <img
              src="https://i.pravatar.cc/150?img=1"
              alt="Your avatar"
              className="h-10 w-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
