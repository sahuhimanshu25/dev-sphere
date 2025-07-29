"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiMaximize2, FiDownload, FiTrash2 } from "react-icons/fi"

const ImageGallery = ({ images = [], onRemove, onReorder, editable = false }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    if (!editable) return
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e, index) => {
    if (!editable || draggedIndex === null) return
    e.preventDefault()

    if (draggedIndex !== index) {
      const newImages = [...images]
      const draggedImage = newImages[draggedIndex]
      newImages.splice(draggedIndex, 1)
      newImages.splice(index, 0, draggedImage)

      if (onReorder) onReorder(newImages)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = filename || "image.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No images to display</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id || index}
            className="relative group aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer"
            draggable={editable}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url || image}
              alt={image.filename || `Image ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-2">
                <motion.button
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(image)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiMaximize2 size={16} className="text-white" />
                </motion.button>

                {editable && onRemove && (
                  <motion.button
                    className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(index)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiTrash2 size={16} className="text-white" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Drag Indicator */}
            {editable && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors z-10"
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={24} />
              </motion.button>

              {/* Image */}
              <img
                src={selectedImage.url || selectedImage}
                alt={selectedImage.filename || "Image"}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {/* Actions */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <motion.button
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors flex items-center space-x-2"
                  onClick={() =>
                    downloadImage(selectedImage.url || selectedImage, selectedImage.filename || "image.jpg")
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiDownload size={16} />
                  <span>Download</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
