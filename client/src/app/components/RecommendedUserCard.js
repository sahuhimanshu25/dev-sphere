"use client"

import { useState } from "react"
import { CheckIcon } from "@heroicons/react/24/outline"

export default function RecommendedUserCard({ user }) {
  const [following, setFollowing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFollow = () => {
    setFollowing(!following)
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.username}
            className="h-12 w-12 rounded-full ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">{user.username}</p>
          <p className="text-sm text-gray-400 truncate">{user.bio}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">1.2k followers</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-blue-400">Mutual: 5</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleFollow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
          following
            ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/30"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {following ? (
          <div className="flex items-center space-x-1">
            {isHovered ? (
              <>
                <span>Unfollow</span>
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Following</span>
              </>
            )}
          </div>
        ) : (
          "Follow"
        )}
      </button>
    </div>
  )
}
