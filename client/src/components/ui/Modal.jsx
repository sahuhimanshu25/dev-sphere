"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiX, FiFolder, FiCode, FiSave } from "react-icons/fi"
import { closeModal } from "@/store/slices/modalSlice"
import {
  createFolder,
  updateFolder,
  createPlayground,
  updatePlayground,
  languageMap,
} from "@/store/slices/playgroundSlice"
import { uuidv4 } from "@/utils/uuid"
import toast from "react-hot-toast"

const Modal = () => {
  const dispatch = useDispatch()
  const { isOpen, modalType, identifiers } = useSelector((state) => state.modal)
  const { folders } = useSelector((state) => state.playground)

  const [formData, setFormData] = useState({
    title: "",
    language: "javascript",
  })

  useEffect(() => {
    if (isOpen && modalType) {
      // Pre-fill form data for edit modals
      if (modalType === 4 && identifiers.folderId) {
        // Edit folder
        const folder = folders[identifiers.folderId]
        if (folder) {
          setFormData({ title: folder.title, language: "javascript" })
        }
      } else if (modalType === 5 && identifiers.folderId && identifiers.cardId) {
        // Edit playground
        const playground = folders[identifiers.folderId]?.playgrounds[identifiers.cardId]
        if (playground) {
          setFormData({ title: playground.title, language: playground.language })
        }
      } else {
        // Reset form for create modals
        setFormData({ title: "", language: "javascript" })
      }
    }
  }, [isOpen, modalType, identifiers, folders])

  const handleClose = () => {
    dispatch(closeModal())
    setFormData({ title: "", language: "javascript" })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      switch (modalType) {
        case 1: // Create folder
          dispatch(
            createFolder({
              folderId: uuidv4(),
              title: formData.title.trim(),
            }),
          )
          toast.success("Folder created successfully")
          break

        case 2: // Create playground
          dispatch(
            createPlayground({
              folderId: identifiers.folderId,
              playgroundId: uuidv4(),
              title: formData.title.trim(),
              language: formData.language,
            }),
          )
          toast.success("Playground created successfully")
          break

        case 4: // Edit folder
          dispatch(
            updateFolder({
              folderId: identifiers.folderId,
              title: formData.title.trim(),
            }),
          )
          toast.success("Folder updated successfully")
          break

        case 5: // Edit playground
          dispatch(
            updatePlayground({
              folderId: identifiers.folderId,
              playgroundId: identifiers.cardId,
              title: formData.title.trim(),
              language: formData.language,
            }),
          )
          toast.success("Playground updated successfully")
          break

        default:
          break
      }

      handleClose()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const getModalTitle = () => {
    switch (modalType) {
      case 1:
        return "Create New Folder"
      case 2:
        return "Create New Playground"
      case 4:
        return "Edit Folder"
      case 5:
        return "Edit Playground"
      case 6:
        return "Running Code..."
      default:
        return "Modal"
    }
  }

  const getModalIcon = () => {
    switch (modalType) {
      case 1:
      case 4:
        return FiFolder
      case 2:
      case 5:
        return FiCode
      case 6:
        return FiCode
      default:
        return FiCode
    }
  }

  if (modalType === 6) {
    // Loading modal for code execution
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                  <FiCode size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Running Code...</h2>
                <p className="text-gray-400 mb-6">Please wait while we execute your code</p>
                <div className="loading-dots mx-auto">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  const Icon = getModalIcon()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="glass rounded-2xl p-8 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Icon size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{getModalTitle()}</h2>
              </div>
              <motion.button
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {modalType === 1 || modalType === 4 ? "Folder Name" : "Playground Name"}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder={`Enter ${modalType === 1 || modalType === 4 ? "folder" : "playground"} name`}
                  required
                  autoFocus
                />
              </div>

              {(modalType === 2 || modalType === 5) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                  >
                    {Object.keys(languageMap).map((lang) => (
                      <option key={lang} value={lang} className="bg-gray-800">
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex space-x-4">
                <motion.button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 btn-futuristic py-3 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiSave size={18} />
                  <span>{modalType === 1 || modalType === 2 ? "Create" : "Update"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
