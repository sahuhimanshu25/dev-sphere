"use client"

import { useState } from "react"
import { XMarkIcon, PhotoIcon, VideoCameraIcon, FaceSmileIcon } from "@heroicons/react/24/outline"

export default function CreatePostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (content.trim()) {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate upload
      onSubmit(content, images)
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) => `https://picsum.photos/400/300?random=${Date.now() + index}`,
      )
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold gradient-text">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* User info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://i.pravatar.cc/150?img=1"
              alt="Your avatar"
              className="h-10 w-10 rounded-full ring-2 ring-blue-500/30"
            />
            <div>
              <p className="font-medium text-white">johndoe</p>
              <p className="text-sm text-gray-400">Public</p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind, developer?"
            className="input-field w-full h-32 resize-none mb-4 text-lg"
            required
          />

          {/* Image preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-500/20 transition-colors">
                  <PhotoIcon className="h-5 w-5" />
                </div>
                <span className="text-sm">Photos</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <button
                type="button"
                className="flex items-center space-x-2 text-gray-400 hover:text-green-400 cursor-pointer transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-green-500/20 transition-colors">
                  <VideoCameraIcon className="h-5 w-5" />
                </div>
                <span className="text-sm">Video</span>
              </button>

              <button
                type="button"
                className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                  <FaceSmileIcon className="h-5 w-5" />
                </div>
                <span className="text-sm">Emoji</span>
              </button>
            </div>

            <div className="text-sm text-gray-400">{content.length}/500</div>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
          >
            {isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                </div>
              </div>
            )}
            <span className={isSubmitting ? "opacity-0" : "opacity-100"}>Share Post</span>
          </button>
        </form>
      </div>
    </div>
  )
}
