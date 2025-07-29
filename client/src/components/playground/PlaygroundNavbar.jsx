"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FiPlay, FiSave, FiArrowLeft, FiSettings, FiDownload, FiShare2 } from "react-icons/fi"
import { languageMap } from "@/store/slices/playgroundSlice"
import toast from "react-hot-toast"

const PlaygroundNavbar = ({ playground, folder, language, onLanguageChange, onRunCode, isRunning }) => {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleBack = () => {
    router.push("/compile")
  }

  const handleSave = () => {
    toast.success("Code saved successfully!")
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([playground.code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${playground.title}.${getFileExtension(language)}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Code downloaded!")
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Playground link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
    }
    return extensions[lang] || "txt"
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-16 glass border-b border-white/10 flex items-center justify-between px-6"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          onClick={handleBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiArrowLeft size={20} />
        </motion.button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{language.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="font-semibold text-white">{playground.title}</h1>
            <p className="text-xs text-gray-400">{folder.title}</p>
          </div>
        </div>
      </div>

      {/* Center Section - Language Selector */}
      <div className="hidden md:flex items-center space-x-4">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        >
          {Object.keys(languageMap).map((lang) => (
            <option key={lang} value={lang} className="bg-gray-800">
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Action Buttons */}
        <motion.button
          className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSave size={16} />
          <span className="text-sm">Save</span>
        </motion.button>

        <motion.button
          className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          onClick={handleDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiDownload size={16} />
          <span className="text-sm">Download</span>
        </motion.button>

        <motion.button
          className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiShare2 size={16} />
          <span className="text-sm">Share</span>
        </motion.button>

        {/* Settings */}
        <motion.button
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiSettings size={18} />
        </motion.button>

        {/* Run Button */}
        <motion.button
          className="btn-futuristic px-6 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onRunCode}
          disabled={isRunning}
          whileHover={{ scale: isRunning ? 1 : 1.05 }}
          whileTap={{ scale: isRunning ? 1 : 0.95 }}
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <FiPlay size={16} />
              <span>Run</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.nav>
  )
}

export default PlaygroundNavbar
