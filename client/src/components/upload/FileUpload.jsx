"use client"

import { useState, useRef, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import ImageEditor from "./ImageEditor"
import BatchImageEditor from "./BatchImageEditor"
import ImageGallery from "./ImageGallery"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = {
  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".bmp"],
}

export default function FileUpload({
  onUpload,
  multiple = true,
  accept = ACCEPTED_TYPES,
  maxSize = MAX_FILE_SIZE,
  className = "",
}) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [editingFile, setEditingFile] = useState(null)
  const [batchEditing, setBatchEditing] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const fileInputRef = useRef(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      console.error(`File ${file.name} rejected:`, errors)
    })

    // Process accepted files
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false,
      error: null,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  })

  const removeFile = (id) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id)
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return updated
    })
    setSelectedFiles((prev) => prev.filter((id) => id !== id))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    const filesToUpload = files.filter((f) => !f.uploaded)

    try {
      for (const fileData of filesToUpload) {
        const formData = new FormData()
        formData.append("file", fileData.file)

        const response = await fetch("/api/upload/images", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, uploaded: true, url: result.url } : f)))
        } else {
          throw new Error("Upload failed")
        }
      }

      if (onUpload) {
        onUpload(files.filter((f) => f.uploaded))
      }
    } catch (error) {
      console.error("Upload error:", error)
      setFiles((prev) => prev.map((f) => ({ ...f, error: "Upload failed" })))
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (fileData) => {
    setEditingFile(fileData)
  }

  const handleEditSave = (editedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === editingFile.id
          ? {
              ...f,
              file: editedFile,
              preview: URL.createObjectURL(editedFile),
              name: editedFile.name,
            }
          : f,
      ),
    )
    setEditingFile(null)
  }

  const handleBatchEdit = () => {
    const selectedFileData = files.filter((f) => selectedFiles.includes(f.id))
    if (selectedFileData.length > 0) {
      setBatchEditing(selectedFileData)
    }
  }

  const handleBatchEditSave = (editedFiles) => {
    editedFiles.forEach((editedFile, index) => {
      const originalFile = files.find((f) => selectedFiles.includes(f.id))
      if (originalFile) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === originalFile.id
              ? {
                  ...f,
                  file: editedFile,
                  preview: URL.createObjectURL(editedFile),
                  name: editedFile.name,
                }
              : f,
          ),
        )
      }
    })
    setBatchEditing(false)
    setSelectedFiles([])
  }

  const toggleFileSelection = (id) => {
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]))
  }

  const openGallery = (index) => {
    setGalleryIndex(index)
    setShowGallery(true)
  }

  const clearAll = () => {
    files.forEach((f) => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview)
      }
    })
    setFiles([])
    setSelectedFiles([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">or click to browse files</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Max file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              {selectedFiles.length > 0 && (
                <span className="text-sm text-blue-600 dark:text-blue-400">({selectedFiles.length} selected)</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {selectedFiles.length > 1 && (
                <button
                  onClick={handleBatchEdit}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  Batch Edit
                </button>
              )}
              <button onClick={clearAll} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                Clear All
              </button>
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((fileData, index) => (
              <div
                key={fileData.id}
                className={`relative group border rounded-lg overflow-hidden ${
                  selectedFiles.includes(fileData.id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(fileData.id)}
                    onChange={() => toggleFileSelection(fileData.id)}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Image Preview */}
                <div
                  className="aspect-square bg-gray-100 dark:bg-gray-800 cursor-pointer"
                  onClick={() => openGallery(index)}
                >
                  {fileData.type.startsWith("image/") ? (
                    <img
                      src={fileData.preview || "/placeholder.svg"}
                      alt={fileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📄</div>
                  )}
                </div>

                {/* File Info */}
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{fileData.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {(fileData.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  {fileData.uploaded && <div className="text-xs text-green-600 dark:text-green-400">✓ Uploaded</div>}
                  {fileData.error && <div className="text-xs text-red-600 dark:text-red-400">✗ {fileData.error}</div>}
                </div>

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {fileData.type.startsWith("image/") && (
                    <button
                      onClick={() => handleEdit(fileData)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={uploading || files.every((f) => f.uploaded)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {editingFile && (
        <ImageEditor file={editingFile.file} onSave={handleEditSave} onCancel={() => setEditingFile(null)} />
      )}

      {/* Batch Editor Modal */}
      {batchEditing && (
        <BatchImageEditor
          files={batchEditing.map((f) => f.file)}
          onSave={handleBatchEditSave}
          onCancel={() => setBatchEditing(false)}
        />
      )}

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          images={files
            .filter((f) => f.type.startsWith("image/"))
            .map((f) => ({
              src: f.preview,
              alt: f.name,
              title: f.name,
            }))}
          initialIndex={galleryIndex}
          onClose={() => setShowGallery(false)}
          onEdit={(index) => {
            const imageFiles = files.filter((f) => f.type.startsWith("image/"))
            handleEdit(imageFiles[index])
            setShowGallery(false)
          }}
        />
      )}
    </div>
  )
}
