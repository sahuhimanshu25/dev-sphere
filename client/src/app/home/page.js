"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import PostCard from "../components/PostCard"
import RecommendedUserCard from "../components/RecommendedUserCard"
import CreatePostModal from "../components/CreatePostModal"
import StoryCarousel from "../components/StoryCarousel"
import TrendingTopics from "../components/TrendingTopics"
import { PlusIcon, FireIcon } from "@heroicons/react/24/outline"
import { dummyPosts, recommendedUsers, stories, trendingTopics } from "../lib/dummyData"

export default function HomePage() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [posts, setPosts] = useState(dummyPosts)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const handleCreatePost = (content, images) => {
    const newPost = {
      id: Date.now().toString(),
      user: {
        id: "1",
        username: "johndoe",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      content,
      images,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
    }
    setPosts([newPost, ...posts])
    setShowCreatePost(false)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-48 bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="card animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                        <div className="h-3 bg-gray-700 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stories Section */}
        <div className="mb-8">
          <StoryCarousel stories={stories} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Post */}
            <div
              className="card cursor-pointer hover:border-blue-500/50 transition-all duration-300"
              onClick={() => setShowCreatePost(true)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.pravatar.cc/150?img=1"
                  alt="Your avatar"
                  className="h-12 w-12 rounded-full ring-2 ring-blue-500/50"
                />
                <div className="flex-1 bg-gray-700/50 rounded-full px-4 py-3 text-gray-400 hover:bg-gray-700/70 transition-colors">
                  What's on your mind, developer?
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110">
                  <PlusIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <FireIcon className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold gradient-text">Trending</h3>
              </div>
              <TrendingTopics topics={trendingTopics} />
            </div>

            {/* Recommended Users */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 gradient-text">Recommended Developers</h3>
              <div className="space-y-4">
                {recommendedUsers.map((user, index) => (
                  <div key={user.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <RecommendedUserCard user={user} />
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 gradient-text">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Posts this week</span>
                  <span className="font-semibold text-blue-400">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Code commits</span>
                  <span className="font-semibold text-green-400">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Streak</span>
                  <span className="font-semibold text-orange-400">🔥 15 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 pulse-glow z-50"
        >
          <PlusIcon className="h-6 w-6" />
        </button>

        {/* Create Post Modal */}
        {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />}
      </div>
    </Layout>
  )
}
