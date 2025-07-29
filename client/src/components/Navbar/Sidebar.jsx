"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { usePathname } from "next/navigation"
import {
  FaHome,
  FaCode,
  FaComments,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaBell,
} from "react-icons/fa"
import { Sparkles } from "lucide-react"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { userData } = useSelector((state) => state.user)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Playground", path: "/compile", icon: FaCode },
    { name: "Chat", path: "/chat", icon: FaComments },
    { name: "Community", path: "/community", icon: FaUsers },
    { name: "Profile", path: "/myProfile", icon: FaUser },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)

  if (!mounted) return null

  return (
    <>
      {/* Enhanced Toggle button - More prominent with better contrast */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] w-14 h-14 rounded-2xl bg-gradient-primary shadow-2xl hover:shadow-glow-lg transition-all duration-300 group border-2 border-white/20 hover:border-white/40 backdrop-blur-sm"
        style={{ display: "block" }}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 blur-xl scale-110 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {isOpen ? (
            <FaTimes className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300 drop-shadow-lg" />
          ) : (
            <FaBars className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
          )}
        </div>

        {/* Pulse animation when closed */}
        {!isOpen && <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping opacity-20" />}

        {/* Hover shimmer effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 glass-effect border-r border-white/10 transform transition-all duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <button
              onClick={toggleSidebar}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 group"
              aria-label="Close sidebar"
            >
              <FaTimes className="w-5 h-5 text-gray-400 hover:text-white transition-colors group-hover:rotate-90 duration-300" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 mb-12 group" onClick={() => setIsOpen(false)}>
            <div className="p-2 rounded-xl bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Dev</span>
              <span className="text-2xl font-bold text-gradient">Sphere</span>
            </div>
          </Link>

          {/* User Profile */}
          {userData && (
            <div className="mb-8 p-4 glass-card rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{userData.name}</p>
                  <p className="text-gray-400 text-sm truncate">{userData.email}</p>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <FaBell className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`sidebar-item flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="space-y-2 pt-6 border-t border-white/10">
            <Link
              href="/settings"
              className="sidebar-item flex items-center space-x-4 px-4 py-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              onClick={() => setIsOpen(false)}
            >
              <FaCog className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Settings</span>
            </Link>

            {userData && (
              <Link
                href="/logout"
                className="sidebar-item flex items-center space-x-4 px-4 py-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
                onClick={() => setIsOpen(false)}
              >
                <FaSignOutAlt className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Logout</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Overlay with better backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

export default Sidebar
