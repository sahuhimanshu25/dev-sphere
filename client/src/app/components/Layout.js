"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import { Bars3Icon } from "@heroicons/react/24/outline"

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="glass-effect p-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72 transition-all duration-300">
        <main className="pt-16 lg:pt-0 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
