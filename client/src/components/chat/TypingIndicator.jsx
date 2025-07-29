"use client"

import { motion } from "framer-motion"

const TypingIndicator = ({ users }) => {
  const getUserNames = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing`
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing`
    } else {
      return `${users.length} people are typing`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-end space-x-2"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-semibold">...</span>
      </div>

      <div className="glass px-4 py-2 rounded-2xl rounded-bl-md">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-300">{getUserNames()}</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-gray-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator
