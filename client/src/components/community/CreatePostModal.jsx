"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { FiX, FiCode, FiImage, FiLink, FiType, FiSend } from "react-icons/fi"
import { createPost } from "@/store/slices/postSlice"
import toast from "react-hot-toast"
import FileUpload from "@/components/upload/FileUpload"

const CreatePostModal = ({ onClose }) => {
  const [postType, setPostType] = useState("text")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    codeSnippet: "",
    language: "javascript",
    imageUrl: "",
    linkUrl: "",
    linkTitle: "",
    linkDescription: "",
    tags: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const [uploadedImages, setUploadedImages] = useState([])

  const postTypes = [
    { value: "text", label: "Text Post", icon: FiType },
    { value: "code", label: "Code Snippet", icon: FiCode },
    { value: "image", label: "Image Post", icon: FiImage },
    { value: "link", label: "Link Share", icon: FiLink },
  ]

  const languages = ["javascript", "python", "java", "cpp", "html", "css", "typescript", "go", "rust", "php"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.content.trim() && !formData.codeSnippet.trim()) {
      toast.error("Please add some content to your post")
      return
    }

    setIsSubmitting(true)
    try {
      const postData = {
        type: postType,
        title: formData.title.trim() || null,
        content: formData.content.trim() || null,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      }

      if (postType === "code") {
        postData.codeSnippet = formData.codeSnippet.trim()
        postData.language = formData.language
      } else if (postType === "image") {
        postData.imageUrl = formData.imageUrl.trim()
      } else if (postType === "link") {
        postData.linkUrl = formData.linkUrl.trim()
        postData.linkTitle = formData.linkTitle.trim()
        postData.linkDescription = formData.linkDescription.trim()
      }

      await dispatch(createPost(postData)).unwrap()
      toast.success("Post created successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Post</h2>
            <motion.button
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={24} />
            </motion.button>
          </div>

          {/* Post Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Post Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {postTypes.map((type) => {
                const Icon = type.icon
                return (
                  <motion.button
                    key={type.value}
                    className={`p-4 rounded-xl border transition-all ${
                      postType === type.value
                        ? "border-purple-500 bg-purple-500/10 text-purple-400"
                        : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setPostType(type.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="Give your post a title..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all"
                placeholder="What's on your mind?"
                rows={4}
                required={postType !== "code"}
              />
            </div>

            {/* Code Snippet */}
            {postType === "code" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang} className="bg-gray-800">
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Code Snippet</label>
                  <textarea
                    value={formData.codeSnippet}
                    onChange={(e) => handleChange("codeSnippet", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-mono text-sm resize-none transition-all"
                    placeholder="Paste your code here..."
                    rows={8}
                    required
                  />
                </div>
              </div>
            )}

            {/* Image Upload */}
            {postType === "image" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images</label>
                <FileUpload
                  accept="image/*"
                  multiple={true}
                  maxFiles={5}
                  fileType="IMAGE"
                  onUpload={(files) => {
                    setUploadedImages(files)
                  }}
                  onError={(error) => {
                    console.error("Upload error:", error)
                  }}
                />
              </div>
            )}

            {/* Link Details */}
            {postType === "link" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Link URL</label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => handleChange("linkUrl", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Link Title</label>
                  <input
                    type="text"
                    value={formData.linkTitle}
                    onChange={(e) => handleChange("linkTitle", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="Link title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Link Description</label>
                  <textarea
                    value={formData.linkDescription}
                    onChange={(e) => handleChange("linkDescription", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all"
                    placeholder="Brief description of the link..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (Optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="javascript, react, tutorial (comma separated)"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <motion.button
                type="button"
                className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-futuristic py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    <span>Create Post</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreatePostModal
