"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiMapPin, FiNavigation, FiSettings, FiEyeOff } from "react-icons/fi"
import UserCard from "./UserCard"

const NearbyUsers = () => {
  const [location, setLocation] = useState(null)
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const [radius, setRadius] = useState(10) // km
  const [nearbyUsers, setNearbyUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock nearby users data
  const mockNearbyUsers = [
    {
      id: 201,
      name: "David Kim",
      username: "davidcodes",
      avatar: null,
      bio: "React developer working on fintech solutions",
      location: "San Francisco, CA",
      distance: 2.5,
      skills: ["React", "TypeScript", "GraphQL"],
      isOnline: true,
      mutualFriends: 2,
    },
    {
      id: 202,
      name: "Lisa Zhang",
      username: "lisadev",
      avatar: null,
      bio: "Full-stack engineer passionate about clean code",
      location: "San Francisco, CA",
      distance: 5.1,
      skills: ["Vue.js", "Python", "Docker"],
      isOnline: false,
      mutualFriends: 0,
    },
  ]

  const requestLocation = async () => {
    setIsLoading(true)
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            setIsLocationEnabled(true)
            setNearbyUsers(mockNearbyUsers)
            setIsLoading(false)
          },
          (error) => {
            console.error("Error getting location:", error)
            setIsLoading(false)
          },
        )
      } else {
        console.error("Geolocation is not supported")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error requesting location:", error)
      setIsLoading(false)
    }
  }

  const disableLocation = () => {
    setLocation(null)
    setIsLocationEnabled(false)
    setNearbyUsers([])
  }

  return (
    <div className="space-y-6">
      {/* Location Settings */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Nearby Users</h2>
            <p className="text-gray-400">Find developers in your area</p>
          </div>

          <div className="flex items-center space-x-3">
            {isLocationEnabled ? (
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                onClick={disableLocation}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiEyeOff size={16} />
                <span>Disable Location</span>
              </motion.button>
            ) : (
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                onClick={requestLocation}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiNavigation size={16} />
                )}
                <span>{isLoading ? "Getting Location..." : "Enable Location"}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Location Controls */}
        {isLocationEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4">
              <FiMapPin className="text-green-400" size={20} />
              <span className="text-white">Location enabled</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">Finding users within {radius}km</span>
            </div>

            {/* Radius Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Radius: {radius}km</label>
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1km</span>
                <span>50km</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Privacy Notice */}
      {!isLocationEnabled && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <FiSettings size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Location Privacy</h3>
              <p className="text-gray-400 mb-4">
                Your location is only used to find nearby developers and is never stored or shared with other users. You
                can disable location access at any time.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Your exact location is never revealed to other users</li>
                <li>• Only approximate distance is shown</li>
                <li>• You control who can see you're nearby</li>
                <li>• Location data is not stored on our servers</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Users */}
      {isLocationEnabled && (
        <div className="glass rounded-2xl p-6">
          {nearbyUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <FiMapPin size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-300">No nearby users found</h3>
              <p className="text-gray-400 mb-8">Try increasing your search radius or check back later</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Nearby Developers ({nearbyUsers.length})</h3>
                <p className="text-sm text-gray-400">Within {radius}km of your location</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative"
                  >
                    <UserCard user={user} />
                    {/* Distance Badge */}
                    <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                      {user.distance}km away
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NearbyUsers
