"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { FiHome, FiCode, FiMessageCircle, FiUsers, FiUser, FiLogOut, FiMenu, FiX, FiPlus } from "react-icons/fi"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { userData, isAuthorized } = useSelector((state) => state.auth || { userData: null, isAuthorized: false })

  const menuItems = [
    { icon: FiHome, label: "Home", path: "/", requireAuth: false },
    { icon: FiCode, label: "Compiler", path: "/compile", requireAuth: true },
    { icon: FiMessageCircle, label: "Chat", path: "/chat", requireAuth: true },
    { icon: FiUsers, label: "Community", path: "/community", requireAuth: true },
    { icon: FiPlus, label: "Add Friends", path: "/addChat", requireAuth: true },
    { icon: FiUser, label: "Profile", path: "/myProfile", requireAuth: true },
  ]

  const handleLogout = async () => {
    try {
      // await dispatch(logout()).unwrap()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleNavigation = (path, requireAuth) => {
    if (requireAuth && !isAuthorized) {
      router.push("/login")
      return
    }
    router.push(path)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-xl p-3"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 z-40 hidden lg:flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <FiCode className="text-white" size={20} />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="text-xl font-bold gradient-text">DevSphere</span>
                  <span className="text-xs text-gray-400">Code. Compile. Debug.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path
            const Icon = item.icon

            return (
              <motion.button
                key={item.path}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                    : "hover:bg-white/5"
                }`}
                onClick={() => handleNavigation(item.path, item.requireAuth)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon size={20} className={isActive ? "text-purple-400" : "text-gray-400"} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </nav>

        {/* User section */}
        {isAuthorized && userData && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold">{userData.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-white truncate">{userData.name}</p>
                    <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLogOut size={20} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}

        {/* Collapse button */}
        <motion.button
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiMenu size={12} />
          </motion.div>
        </motion.button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 z-40 lg:hidden flex flex-col"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Mobile content - same as desktop but without collapse functionality */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <FiCode className="text-white" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold gradient-text">DevSphere</span>
                    <span className="text-xs text-gray-400">Code. Compile. Debug.</span>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.path
                  const Icon = item.icon

                  return (
                    <motion.button
                      key={item.path}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => handleNavigation(item.path, item.requireAuth)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon size={20} className={isActive ? "text-purple-400" : "text-gray-400"} />
                      <span className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}>{item.label}</span>
                    </motion.button>
                  )
                })}
              </nav>

              {isAuthorized && userData && (
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold">{userData.name?.charAt(0).toUpperCase() || "U"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{userData.name}</p>
                      <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                    </div>
                  </div>

                  <button
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
