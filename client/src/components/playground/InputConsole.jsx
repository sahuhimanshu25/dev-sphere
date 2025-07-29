"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiTerminal, FiTrash2, FiCopy } from "react-icons/fi"
import toast from "react-hot-toast"

const InputConsole = ({ input, onChange }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      toast.success("Input copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy input")
    }
  }

  const handleClear = () => {
    onChange("")
    toast.success("Input cleared!")
  }

  return (
    <motion.div
      className="h-full flex flex-col bg-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 glass">
        <div className="flex items-center space-x-2">
          <FiTerminal size={16} className="text-green-400" />
          <h3 className="text-sm font-medium text-gray-300">Input</h3>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!input}
          >
            <FiCopy size={14} />
          </motion.button>

          <motion.button
            className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
            onClick={handleClear}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!input}
          >
            <FiTrash2 size={14} />
          </motion.button>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-1 p-4">
        <textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter input for your program here..."
          className="w-full h-full bg-transparent border border-white/10 rounded-lg p-3 text-sm font-mono text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
          style={{ minHeight: "200px" }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-gray-800/30">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Input will be passed to your program via stdin</span>
          <span>{input.length} characters</span>
        </div>
      </div>
    </motion.div>
  )
}

export default InputConsole
