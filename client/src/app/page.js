"use client"

import { useAuth } from "./providers"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import './globals.css'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border-4 border-purple-500 opacity-20"></div>
      </div>
    </div>
  )
}
