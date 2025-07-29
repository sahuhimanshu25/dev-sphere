"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FiHome, FiArrowLeft, FiSearch, FiZap } from "react-icons/fi"
import { useEffect, useState } from "react"

export default function NotFound() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            404
          </motion.div>

          {/* Glitch Effect */}
          <motion.div
            className="relative inline-block"
            animate={{
              x: [0, -2, 2, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Page Not Found</h1>
            <motion.div
              className="absolute inset-0 text-4xl md:text-6xl font-bold text-red-500 opacity-20"
              animate={{
                x: [0, 3, -3, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
                delay: 0.05,
              }}
            >
              Page Not Found
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Oops! The page you're looking for has vanished into the digital void.
          </p>
          <p className="text-gray-400">
            Don't worry, even the best developers encounter 404s. Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            className="btn-futuristic flex items-center space-x-2 px-8 py-4 text-lg"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHome size={20} />
            <span>Go Home</span>
          </motion.button>

          <motion.button
            className="flex items-center space-x-2 px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200"
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft size={20} />
            <span>Go Back</span>
          </motion.button>

          <motion.button
            className="flex items-center space-x-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-300 rounded-xl transition-all duration-200 border border-purple-500/30"
            onClick={() => router.push("/community")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSearch size={20} />
            <span>Explore</span>
          </motion.button>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass rounded-2xl p-6 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <FiZap className="text-yellow-400 mr-2" size={24} />
            <h3 className="text-xl font-semibold text-white">Did You Know?</h3>
          </div>
          <p className="text-gray-300 text-center">
            The HTTP 404 error was named after room 404 at CERN, where the original web servers were located. When files
            couldn't be found, they were said to be "404" - not found in room 404!
          </p>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8"
        >
          <motion.div
            className="text-xs text-gray-600 cursor-pointer hover:text-purple-400 transition-colors"
            onClick={() => {
              const messages = [
                "🚀 Keep coding!",
                "💻 Debug the world!",
                "⚡ Stay curious!",
                "🌟 Build amazing things!",
                "🔥 Never stop learning!",
              ]
              alert(messages[Math.floor(Math.random() * messages.length)])
            }}
            whileHover={{ scale: 1.1 }}
          >
            psst... click me for motivation 🎯
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Code Snippets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          "const found = false;",
          "if (page === null) {",
          "return <NotFound />;",
          "404: Page.exe stopped",
          "// TODO: Fix this",
          "console.log('lost');",
        ].map((code, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/20 font-mono text-sm"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
          >
            {code}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
