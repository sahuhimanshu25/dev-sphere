"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiCamera, FiUpload, FiX, FiCrop } from "react-icons/fi"
import { cropImageToSquare, validateFile } from "@/utils/fileUpload"
import toast from "react-hot-toast"

const AvatarUpload = ({ currentAvatar, onUpload, onError, size = 120 }) => {
  const [preview, setPreview] = useState(currentAvatar)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (file) => {
    const validation = validateFile(file, "AVATAR")

    if (!validation.isValid) {
      toast.error(validation.errors.join(", "))
      if (onError) onError(new Error(validation.errors.join(", ")))
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
    e.target.value = ""
  }

  const handleCropAndUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // Crop image to square
      const croppedFile = await cropImageToSquare(selectedFile, 400)

      // Create form data
      const formData = new FormData()
      formData.append("avatar", croppedFile, `avatar_${Date.now()}.${selectedFile.type.split("/")[1]}`)

      // Mock upload - replace with actual API call
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      if (result.success) {
        toast.success("Avatar updated successfully!")
        setPreview(result.data.file.url)
        if (onUpload) onUpload(result.data.file)
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload avatar")
      if (onError) onError(error)
    } finally {
      setIsUploading(false)
      setShowCropModal(false)
      setSelectedFile(null)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removeAvatar = () => {
    setPreview(null)
    if (onUpload) onUpload(null)
  }

  return (
    <>
      <div className="relative inline-block">
        <motion.div
          className="relative group cursor-pointer"
          style={{ width: size, height: size }}
          onClick={openFileDialog}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Avatar Image */}
          <div
            className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            {preview ? (
              <img src={preview || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-semibold text-2xl">U</span>
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <FiCamera size={24} className="text-white" />
          </div>

          {/* Upload Indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Remove Button */}
        {preview && !isUploading && (
          <motion.button
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              removeAvatar()
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={16} />
          </motion.button>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Crop Modal */}
      <AnimatePresence>
        {showCropModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-2xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <FiCrop className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Crop Avatar</h3>
                </div>

                {/* Preview */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                    {preview && (
                      <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                <p className="text-gray-400 text-sm">
                  Your image will be cropped to a square and resized for optimal display.
                </p>

                {/* Actions */}
                <div className="flex space-x-4">
                  <motion.button
                    className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                    onClick={() => {
                      setShowCropModal(false)
                      setSelectedFile(null)
                      setPreview(currentAvatar)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 btn-futuristic py-2 flex items-center justify-center space-x-2 disabled:opacity-50"
                    onClick={handleCropAndUpload}
                    disabled={isUploading}
                    whileHover={{ scale: isUploading ? 1 : 1.02 }}
                    whileTap={{ scale: isUploading ? 1 : 0.98 }}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FiUpload size={16} />
                        <span>Upload</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AvatarUpload
