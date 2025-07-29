"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { fetchUserProfile, fetchFriends } from "@/store/slices/userSlice"
import Sidebar from "@/components/navigation/Sidebar"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs from "@/components/profile/ProfileTabs"
import ProfilePosts from "@/components/profile/ProfilePosts"
import ProfileFriends from "@/components/profile/ProfileFriends"
import ProfileSettings from "@/components/profile/ProfileSettings"
import Loader from "@/components/ui/Loader"

const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()

  const { isAuthorized, userData } = useSelector((state) => state.auth)
  const { currentProfile, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login")
      return
    }

    initializeProfile()
  }, [isAuthorized, router])

  const initializeProfile = async () => {
    try {
      await dispatch(fetchUserProfile(userData?.id || "me"))
      await dispatch(fetchFriends(userData?.id || "me"))
      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing profile:", error)
      setIsLoading(false)
    }
  }

  if (isLoading || loading) {
    return <Loader fullScreen text="Loading your profile..." />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts userId={userData?.id} />
      case "friends":
        return <ProfileFriends userId={userData?.id} />
      case "settings":
        return <ProfileSettings />
      default:
        return <ProfilePosts userId={userData?.id} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />

      <div className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ProfileHeader profile={currentProfile || userData} isOwnProfile={true} />
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8"
          >
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isOwnProfile={true} />
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MyProfilePage
