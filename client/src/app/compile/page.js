"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { FiFolder, FiCode, FiPlus, FiEdit3, FiTrash2 } from "react-icons/fi"
import { openModal } from "@/store/slices/modalSlice"
import { deleteFolder, deletePlayground } from "@/store/slices/playgroundSlice"
import Sidebar from "@/components/navigation/Sidebar"
import Modal from "@/components/ui/Modal"
import Loader from "@/components/ui/Loader"

const CompilerHomePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthorized } = useSelector((state) => state.auth)
  const { folders } = useSelector((state) => state.playground)
  const { isOpen } = useSelector((state) => state.modal)

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login")
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthorized, router])

  const handleCreateFolder = () => {
    dispatch(
      openModal({
        modalType: 1,
        identifiers: { folderId: "", cardId: "" },
      }),
    )
  }

  const handleCreatePlayground = (folderId) => {
    dispatch(
      openModal({
        modalType: 2,
        identifiers: { folderId, cardId: "" },
      }),
    )
  }

  const handleEditFolder = (folderId) => {
    dispatch(
      openModal({
        modalType: 4,
        identifiers: { folderId, cardId: "" },
      }),
    )
  }

  const handleEditPlayground = (folderId, playgroundId) => {
    dispatch(
      openModal({
        modalType: 5,
        identifiers: { folderId, cardId: playgroundId },
      }),
    )
  }

  const handleDeleteFolder = (folderId) => {
    if (window.confirm("Are you sure you want to delete this folder?")) {
      dispatch(deleteFolder({ folderId }))
    }
  }

  const handleDeletePlayground = (folderId, playgroundId) => {
    if (window.confirm("Are you sure you want to delete this playground?")) {
      dispatch(deletePlayground({ folderId, playgroundId }))
    }
  }

  const handlePlaygroundClick = (folderId, playgroundId) => {
    router.push(`/playground/${folderId}/${playgroundId}`)
  }

  if (isLoading) {
    return <Loader fullScreen text="Loading your workspace..." />
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                My <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-gray-400">Organize your code projects and start coding</p>
            </div>

            <motion.button
              className="btn-futuristic mt-4 lg:mt-0 flex items-center space-x-2"
              onClick={handleCreateFolder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={20} />
              <span>New Folder</span>
            </motion.button>
          </motion.div>

          {/* Folders Grid */}
          <div className="space-y-8">
            {Object.entries(folders).length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                  <FiFolder size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-300">No folders yet</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Create your first folder to organize your coding projects
                </p>
                <motion.button
                  className="btn-futuristic flex items-center space-x-2 mx-auto"
                  onClick={handleCreateFolder}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus size={20} />
                  <span>Create First Folder</span>
                </motion.button>
              </motion.div>
            ) : (
              Object.entries(folders).map(([folderId, folder], folderIndex) => (
                <motion.div
                  key={folderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: folderIndex * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  {/* Folder Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <FiFolder size={24} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{folder.title}</h2>
                        <p className="text-sm text-gray-400">{Object.keys(folder.playgrounds).length} playground(s)</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        onClick={() => handleEditFolder(folderId)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEdit3 size={18} />
                      </motion.button>
                      <motion.button
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                        onClick={() => handleDeleteFolder(folderId)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                      <motion.button
                        className="glass rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors flex items-center space-x-2"
                        onClick={() => handleCreatePlayground(folderId)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiPlus size={16} />
                        <span>New Playground</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Playgrounds Grid */}
                  {Object.keys(folder.playgrounds).length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-xl">
                      <FiCode size={32} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No playgrounds in this folder</p>
                      <motion.button
                        className="text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-2 mx-auto"
                        onClick={() => handleCreatePlayground(folderId)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiPlus size={16} />
                        <span>Create First Playground</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(folder.playgrounds).map(([playgroundId, playground], playgroundIndex) => (
                        <motion.div
                          key={playgroundId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: playgroundIndex * 0.1 }}
                          className="glass rounded-xl p-4 card-hover cursor-pointer group"
                          onClick={() => handlePlaygroundClick(folderId, playgroundId)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                <FiCode size={20} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                                  {playground.title}
                                </h3>
                                <p className="text-sm text-gray-400 capitalize">{playground.language}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditPlayground(folderId, playgroundId)
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiEdit3 size={14} />
                              </motion.button>
                              <motion.button
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePlayground(folderId, playgroundId)
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiTrash2 size={14} />
                              </motion.button>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 font-mono bg-black/20 rounded-md p-2 overflow-hidden">
                            <div className="truncate">{playground.code.split("\n")[0] || "Empty playground"}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && <Modal />}
    </div>
  )
}

export default CompilerHomePage
