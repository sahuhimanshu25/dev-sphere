"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiRefreshCw, FiUsers, FiTrendingUp, FiMapPin, FiCode } from "react-icons/fi"
import { fetchSuggestedFriends } from "@/store/slices/userSlice"
import UserCard from "./UserCard"
import Loader from "@/components/ui/Loader"

const SuggestedFriends = () => {
  const [suggestionType, setSuggestionType] = useState("all") // all, mutual, location, skills, activity
  const [isRefreshing, setIsRefreshing] = useState(false)
  const dispatch = useDispatch()

  const { suggestedFriends, loading } = useSelector((state) => state.user)
  const { userData } = useSelector((state) => state.auth)

  useEffect(() => {
    if (suggestedFriends.length === 0) {
      dispatch(fetchSuggestedFriends())
    }
  }, [dispatch, suggestedFriends.length])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await dispatch(fetchSuggestedFriends()).unwrap()
    } catch (error) {
      console.error("Error refreshing suggestions:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const filterSuggestions = (suggestions) => {
    switch (suggestionType) {
      case "mutual":
        return suggestions.filter((user) => user.mutualFriends > 0)
      case "location":
        return suggestions.filter(
          (user) =>
            user.location &&
            userData?.location &&
            user.location.toLowerCase().includes(userData.location.toLowerCase()),
        )
      case "skills":
        return suggestions.filter(
          (user) => user.skills && userData?.skills && user.skills.some((skill) => userData.skills.includes(skill)),
        )
      case "activity":
        return suggestions.filter((user) => user.isActive)
      default:
        return suggestions
    }
  }

  const filteredSuggestions = filterSuggestions(suggestedFriends)

  const suggestionCategories = [
    {
      id: "all",
      label: "All Suggestions",
      icon: FiUsers,
      description: "All recommended users",
    },
    {
      id: "mutual",
      label: "Mutual Friends",
      icon: FiUsers,
      description: "People you may know through friends",
    },
    {
      id: "location",
      label: "Nearby",
      icon: FiMapPin,
      description: "Users in your area",
    },
    {
      id: "skills",
      label: "Similar Skills",
      icon: FiCode,
      description: "Developers with similar expertise",
    },
    {
      id: "activity",
      label: "Active Users",
      icon: FiTrendingUp,
      description: "Recently active members",
    },
  ]

  if (loading && suggestedFriends.length === 0) {
    return <Loader text="Finding suggested friends..." />
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Suggested Friends</h2>
            <p className="text-gray-400">Discover people you might know based on mutual connections and interests</p>
          </div>

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              <FiRefreshCw size={18} />
            </motion.div>
            <span>Refresh</span>
          </motion.button>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {suggestionCategories.map((category) => {
            const Icon = category.icon
            const isActive = suggestionType === category.id
            const count = category.id === "all" ? suggestedFriends.length : filterSuggestions(suggestedFriends).length

            return (
              <motion.button
                key={category.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setSuggestionType(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                <span>{category.label}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{count}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="glass rounded-2xl p-6">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <FiUsers size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">
              {suggestionType === "all"
                ? "No suggestions available"
                : `No ${suggestionCategories.find((c) => c.id === suggestionType)?.label.toLowerCase()} found`}
            </h3>
            <p className="text-gray-400 mb-8">
              {suggestionType === "all"
                ? "We'll suggest new friends as you interact more with the community"
                : "Try selecting a different category or refresh suggestions"}
            </p>
            <motion.button
              className="btn-futuristic flex items-center space-x-2 mx-auto"
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw size={20} />
              <span>Refresh Suggestions</span>
            </motion.button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {suggestionCategories.find((c) => c.id === suggestionType)?.label} ({filteredSuggestions.length})
              </h3>
              <p className="text-sm text-gray-400">
                {suggestionCategories.find((c) => c.id === suggestionType)?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredSuggestions.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <UserCard user={user} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Reasons */}
      {filteredSuggestions.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Why these suggestions?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <FiUsers className="text-blue-400" size={20} />
              <div>
                <p className="text-sm font-medium text-white">Mutual Connections</p>
                <p className="text-xs text-gray-400">Friends of friends</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <FiMapPin className="text-green-400" size={20} />
              <div>
                <p className="text-sm font-medium text-white">Location</p>
                <p className="text-xs text-gray-400">Same city or region</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <FiCode className="text-purple-400" size={20} />
              <div>
                <p className="text-sm font-medium text-white">Skills</p>
                <p className="text-xs text-gray-400">Similar technologies</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <FiTrendingUp className="text-orange-400" size={20} />
              <div>
                <p className="text-sm font-medium text-white">Activity</p>
                <p className="text-xs text-gray-400">Active community members</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuggestedFriends
