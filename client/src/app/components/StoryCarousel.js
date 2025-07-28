"use client"

import { useState } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"

export default function StoryCarousel({ stories }) {
  const [selectedStory, setSelectedStory] = useState(null)

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Add Story */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-0.5 cursor-pointer hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
            <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
              <PlusIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-400">Your Story</p>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0">
            <div
              className="relative w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-0.5 cursor-pointer hover:from-pink-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
              onClick={() => setSelectedStory(story)}
            >
              <img
                src={story.user.avatar || "/placeholder.svg"}
                alt={story.user.username}
                className="w-full h-full rounded-full object-cover border-2 border-gray-800"
              />
              {story.isNew && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
            <p className="text-xs text-center mt-2 text-gray-400 truncate w-20">{story.user.username}</p>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md h-full bg-black">
            {/* Progress bar */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full animate-progress"></div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-6 right-6 text-white z-10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ×
            </button>

            {/* Story content */}
            <img src={selectedStory.image || "/placeholder.svg"} alt="Story" className="w-full h-full object-cover" />

            {/* User info */}
            <div className="absolute top-16 left-4 flex items-center space-x-3">
              <img
                src={selectedStory.user.avatar || "/placeholder.svg"}
                alt={selectedStory.user.username}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-white font-semibold">{selectedStory.user.username}</p>
                <p className="text-gray-300 text-sm">{selectedStory.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
