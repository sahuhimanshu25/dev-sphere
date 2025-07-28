"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext(undefined)

const demoUser = {
  id: "1",
  username: "johndoe",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "Full-stack developer passionate about React and Node.js 🚀",
  posts: 42,
  followers: 1234,
  following: 567,
}

export function Providers({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    setUser(demoUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
