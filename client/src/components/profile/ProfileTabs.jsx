"use client"

import { motion } from "framer-motion"
import { FiGrid, FiUsers, FiSettings, FiBookmark, FiActivity } from "react-icons/fi"

const ProfileTabs = ({ activeTab, onTabChange, isOwnProfile = false }) => {
  const tabs = [
    {
      id: "posts",
      label: "Posts",
      icon: FiGrid,
      description: "User posts and content",
    },
    {
      id: "friends",
      label: "Friends",
      icon: FiUsers,
      description: "Friends and connections",
    },
    {
      id: "activity",
      label: "Activity",
      icon: FiActivity,
      description: "Recent activity",
      ownOnly: false,
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: FiBookmark,
      description: "Saved posts",
      ownOnly: true,
    },
    {
      id: "settings",
      label: "Settings",
      icon: FiSettings,
      description: "Account settings",
      ownOnly: true,
    },
  ]

  const visibleTabs = tabs.filter((tab) => !tab.ownOnly || isOwnProfile)

  return (
    <div className="glass rounded-2xl p-2">
      <div className="flex space-x-1 overflow-x-auto">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all whitespace-nowrap min-w-0 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl"
                  layoutId="activeProfileTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <Icon size={20} className={isActive ? "text-purple-400" : ""} />
              <div className="text-left">
                <div className="relative z-10 font-semibold">{tab.label}</div>
                <div className="relative z-10 text-xs text-gray-500">{tab.description}</div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default ProfileTabs
