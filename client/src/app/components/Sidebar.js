"use client"

import { useAuth } from "../providers"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  UserIcon,
  UserGroupIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline"

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/home", icon: HomeIcon, color: "text-blue-400" },
    { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon, color: "text-green-400" },
    { name: "Community", href: "/community", icon: UserGroupIcon, color: "text-purple-400" },
    { name: "Compiler", href: "/compiler", icon: CodeBracketIcon, color: "text-orange-400" },
    { name: "Profile", href: "/profile", icon: UserIcon, color: "text-pink-400" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-50 h-full w-72 glass-card transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <CodeBracketIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">DevConnect</h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.username}
                    className="h-12 w-12 rounded-full ring-2 ring-blue-500/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user.username}</p>
                  <p className="text-gray-400 text-sm truncate">{user.email}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{user.posts}</p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{user.followers}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{user.following}</p>
                  <p className="text-xs text-gray-400">Following</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`
                        group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 ${isActive ? item.color : "group-hover:" + item.color} transition-colors`}
                      />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Additional Actions */}
            <div className="mt-8 space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300">
                <BellIcon className="h-6 w-6" />
                <span>Notifications</span>
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              </button>

              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300">
                <Cog6ToothIcon className="h-6 w-6" />
                <span>Settings</span>
              </button>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 group-hover:text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
