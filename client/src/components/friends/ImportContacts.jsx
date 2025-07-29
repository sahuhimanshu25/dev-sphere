"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiUpload, FiUsers, FiCheck, FiX } from "react-icons/fi"

const ImportContacts = () => {
  const [importStatus, setImportStatus] = useState({})
  const [isImporting, setIsImporting] = useState(false)

  const platforms = [
    {
      id: "github",
      name: "GitHub",
      icon: FiGithub,
      description: "Import from your GitHub followers and following",
      color: "from-gray-600 to-gray-800",
      textColor: "text-gray-300",
      connected: false,
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: FiTwitter,
      description: "Find developers from your Twitter network",
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-400",
      connected: false,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: FiLinkedin,
      description: "Connect with your professional network",
      color: "from-blue-600 to-blue-700",
      textColor: "text-blue-400",
      connected: false,
    },
    {
      id: "email",
      name: "Email Contacts",
      icon: FiMail,
      description: "Upload your email contacts to find friends",
      color: "from-green-500 to-green-600",
      textColor: "text-green-400",
      connected: false,
    },
  ]

  const handleImport = async (platformId) => {
    setIsImporting(true)
    setImportStatus((prev) => ({ ...prev, [platformId]: "importing" }))

    try {
      // Mock import process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock success
      setImportStatus((prev) => ({ ...prev, [platformId]: "success" }))

      setTimeout(() => {
        setImportStatus((prev) => ({ ...prev, [platformId]: null }))
      }, 3000)
    } catch (error) {
      setImportStatus((prev) => ({ ...prev, [platformId]: "error" }))
      setTimeout(() => {
        setImportStatus((prev) => ({ ...prev, [platformId]: null }))
      }, 3000)
    } finally {
      setIsImporting(false)
    }
  }

  const getStatusIcon = (platformId) => {
    const status = importStatus[platformId]
    switch (status) {
      case "importing":
        return <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      case "success":
        return <FiCheck size={20} className="text-green-400" />
      case "error":
        return <FiX size={20} className="text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (platformId) => {
    const status = importStatus[platformId]
    switch (status) {
      case "importing":
        return "Importing..."
      case "success":
        return "Import Complete"
      case "error":
        return "Import Failed"
      default:
        return "Import Contacts"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Import Contacts</h2>
          <p className="text-gray-400">Connect your social accounts to find friends who are already on DevSphere</p>
        </div>
      </div>

      {/* Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform, index) => {
          const Icon = platform.icon
          const status = importStatus[platform.id]
          const isDisabled = isImporting && status !== "importing"

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${platform.color} flex items-center justify-center`}
                >
                  <Icon size={32} className="text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{platform.name}</h3>
                    {getStatusIcon(platform.id)}
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{platform.description}</p>

                  <motion.button
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                      status === "success"
                        ? "bg-green-500/20 text-green-400"
                        : status === "error"
                          ? "bg-red-500/20 text-red-400"
                          : status === "importing"
                            ? "bg-blue-500/20 text-blue-400"
                            : `bg-white/5 ${platform.textColor} hover:bg-white/10`
                    }`}
                    onClick={() => handleImport(platform.id)}
                    disabled={isDisabled}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                  >
                    <Icon size={18} />
                    <span>{getStatusText(platform.id)}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Manual Upload */}
      <div className="glass rounded-2xl p-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <FiUpload size={48} className="text-gray-400" />
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">Manual Upload</h3>
          <p className="text-gray-400 mb-6">Upload a CSV file with email addresses to find friends</p>

          <div className="max-w-md mx-auto">
            <motion.label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
              <input type="file" className="hidden" accept=".csv" />
            </motion.label>

            <p className="text-xs text-gray-500 mt-4">
              Your contacts are processed securely and never stored on our servers
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Information */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <FiUsers size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy & Security</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• We only access public information from connected accounts</p>
              <p>• Your login credentials are never stored or accessed</p>
              <p>• Contact data is processed securely and deleted after matching</p>
              <p>• You can disconnect accounts at any time in your settings</p>
              <p>• We never post or send messages on your behalf</p>
            </div>
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Imports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiGithub className="text-gray-400" size={20} />
              <div>
                <p className="text-white font-medium">GitHub</p>
                <p className="text-xs text-gray-400">Found 12 users • 2 hours ago</p>
              </div>
            </div>
            <span className="text-green-400 text-sm">Completed</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiLinkedin className="text-blue-400" size={20} />
              <div>
                <p className="text-white font-medium">LinkedIn</p>
                <p className="text-xs text-gray-400">Found 8 users • 1 day ago</p>
              </div>
            </div>
            <span className="text-green-400 text-sm">Completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportContacts
