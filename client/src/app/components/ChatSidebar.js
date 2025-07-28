"use client"

import { MagnifyingGlassIcon, PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline"

export default function ChatSidebar({ users, selectedUser, onSelectUser, searchQuery, onSearchChange }) {
  return (
    <div className="w-80 glass-card border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold gradient-text mb-4">Messages</h2>

        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="input-field w-full pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/20 px-3 py-2 rounded-lg hover:bg-blue-500/30">
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">New Chat</span>
          </button>

          <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/20 px-3 py-2 rounded-lg hover:bg-purple-500/30">
            <UserGroupIcon className="h-4 w-4" />
            <span className="text-sm">Groups</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
              selectedUser.id === user.id ? "bg-blue-500/20 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.username}
                  className="h-12 w-12 rounded-full ring-2 ring-transparent hover:ring-blue-500/30 transition-all duration-300"
                />
                <div
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-gray-800 ${
                    user.isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white truncate">{user.username}</p>
                  <div className="text-xs text-gray-400">{user.timestamp}</div>
                </div>
                <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
                {user.unreadCount && (
                  <div className="flex justify-end mt-1">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{user.unreadCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Online users count */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">{users.filter((u) => u.isOnline).length} online</span>
        </div>
      </div>
    </div>
  )
}
