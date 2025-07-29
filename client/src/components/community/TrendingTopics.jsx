"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiTrendingUp, FiHash } from "react-icons/fi"

const TrendingTopics = () => {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingTopics()
  }, [])

  const fetchTrendingTopics = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockTopics = [
        { tag: "react", count: 1234, growth: "+12%" },
        { tag: "javascript", count: 987, growth: "+8%" },
        { tag: "nextjs", count: 756, growth: "+15%" },
        { tag: "typescript", count: 543, growth: "+5%" },
        { tag: "tailwind", count: 432, growth: "+20%" },
        { tag: "nodejs", count: 321, growth: "+3%" },
      ]

      setTimeout(() => {
        setTopics(mockTopics)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching trending topics:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiTrendingUp className="text-orange-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <FiTrendingUp className="text-orange-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
      </div>

      <div className="space-y-3">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.tag}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <FiHash size={16} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-orange-300 transition-colors">#{topic.tag}</p>
                <p className="text-sm text-gray-400">{topic.count.toLocaleString()} posts</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-green-400">{topic.growth}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="w-full mt-4 p-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View All Topics
      </motion.button>
    </motion.div>
  )
}

export default TrendingTopics
