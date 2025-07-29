"use client"

import { motion } from "framer-motion"
import { FiMessageCircle, FiUsers, FiZap, FiShield } from "react-icons/fi"

const WelcomeScreen = () => {
  const features = [
    {
      icon: FiMessageCircle,
      title: "Real-time Messaging",
      description: "Send and receive messages instantly with our lightning-fast chat system",
    },
    {
      icon: FiUsers,
      title: "Group Conversations",
      description: "Create group chats and collaborate with multiple team members",
    },
    {
      icon: FiZap,
      title: "File Sharing",
      description: "Share images, documents, and files seamlessly within conversations",
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Your conversations are encrypted and protected with enterprise-grade security",
    },
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
            <FiMessageCircle size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="gradient-text">DevSphere Chat</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Connect with fellow developers, share ideas, and collaborate in real-time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass rounded-2xl p-6 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-gray-400 mb-4">Ready to start chatting?</p>
          <p className="text-sm text-gray-500">Select a conversation from the sidebar or start a new one</p>
        </motion.div>
      </div>
    </div>
  )
}

export default WelcomeScreen
