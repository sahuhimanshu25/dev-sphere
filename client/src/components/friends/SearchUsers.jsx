"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiSearch, FiFilter, FiX, FiMapPin, FiUsers, FiCode } from "react-icons/fi"
import { searchUsers, clearSearchResults } from "@/store/slices/userSlice"
import UserCard from "./UserCard"
import { debounce } from "lodash"

const SearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    location: "",
    skills: [],
    company: "",
    experience: "all", // all, junior, mid, senior
    availability: "all", // all, available, busy
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState([])

  const dispatch = useDispatch()
  const { searchResults, isSearching } = useSelector((state) => state.user)

  const popularSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Java",
    "Go",
    "Rust",
    "Docker",
    "Kubernetes",
    "AWS",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
    "Vue.js",
    "Angular",
    "Flutter",
    "Swift",
    "Kotlin",
    "C++",
  ]

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query, searchFilters) => {
      if (query.trim() || Object.values(searchFilters).some((v) => v && v.length > 0)) {
        dispatch(searchUsers({ query: query.trim(), filters: searchFilters }))
      } else {
        dispatch(clearSearchResults())
      }
    }, 500),
    [dispatch],
  )

  useEffect(() => {
    debouncedSearch(searchQuery, filters)
    return () => debouncedSearch.cancel()
  }, [searchQuery, filters, debouncedSearch])

  const handleSkillToggle = (skill) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill]

    setSelectedSkills(newSkills)
    setFilters((prev) => ({ ...prev, skills: newSkills }))
  }

  const clearAllFilters = () => {
    setFilters({
      location: "",
      skills: [],
      company: "",
      experience: "all",
      availability: "all",
    })
    setSelectedSkills([])
    setSearchQuery("")
  }

  const hasActiveFilters =
    searchQuery || Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v && v !== "all"))

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or skills..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setSearchQuery("")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={20} />
              </motion.button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <motion.button
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                showFilters
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiFilter size={18} />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 bg-purple-400 rounded-full" />}
            </motion.button>

            {hasActiveFilters && (
              <motion.button
                className="px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={clearAllFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear All
              </motion.button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Company Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={filters.company}
                    onChange={(e) => setFilters((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  >
                    <option value="all" className="bg-gray-800">
                      All Levels
                    </option>
                    <option value="junior" className="bg-gray-800">
                      Junior (0-2 years)
                    </option>
                    <option value="mid" className="bg-gray-800">
                      Mid (2-5 years)
                    </option>
                    <option value="senior" className="bg-gray-800">
                      Senior (5+ years)
                    </option>
                  </select>
                </div>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Skills & Technologies</label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill)
                    return (
                      <motion.button
                        key={skill}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                        onClick={() => handleSkillToggle(skill)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {skill}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results */}
      <div className="glass rounded-2xl p-6">
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="loading-dots mb-4">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p className="text-gray-400">Searching for users...</p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Search Results ({searchResults.length})</h3>
              <div className="text-sm text-gray-400">{hasActiveFilters && "Filtered results"}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {searchResults.map((user, index) => (
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
        ) : hasActiveFilters ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <FiSearch size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">No users found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search criteria or filters</p>
            <motion.button
              className="btn-futuristic flex items-center space-x-2 mx-auto"
              onClick={clearAllFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiX size={20} />
              <span>Clear Filters</span>
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <FiUsers size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">Start searching</h3>
            <p className="text-gray-400 mb-8">Enter a name, username, or skill to find developers</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["React", "Python", "JavaScript", "Node.js"].map((skill) => (
                <motion.button
                  key={skill}
                  className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => {
                    setSearchQuery(skill)
                    handleSkillToggle(skill)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCode size={16} className="inline mr-2" />
                  {skill}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchUsers
