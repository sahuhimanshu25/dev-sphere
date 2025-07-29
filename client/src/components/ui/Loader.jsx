"use client"

import { motion } from "framer-motion"

const Loader = ({ size = "md", text = "Loading...", fullScreen = false }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    : "flex items-center justify-center p-8"

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 p-1`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-gray-900" />
          </motion.div>

          {/* Inner ring */}
          <motion.div
            className={`absolute inset-2 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500`}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-gray-900" />
          </motion.div>

          {/* Center dot */}
          <motion.div
            className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        {text && (
          <motion.p
            className="text-sm font-medium text-gray-300 gradient-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default Loader
