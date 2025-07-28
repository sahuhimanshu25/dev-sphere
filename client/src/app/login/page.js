"use client"

import { useState } from "react"
import { useAuth } from "../providers"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { EyeIcon, EyeSlashIcon, SparklesIcon } from "@heroicons/react/24/outline"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      login(email, password)
      router.push("/home")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    login("demo@example.com", "password")
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <SparklesIcon className="h-16 w-16 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 bg-blue-400 rounded-full filter blur-xl opacity-30 animate-ping"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-2">DevConnect</h2>
          <p className="text-gray-300 text-lg">Welcome back to the future of coding</p>
        </div>

        <div className="glass-card p-8 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field w-full group-hover:border-blue-400 transition-all duration-300"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input-field w-full pr-12 group-hover:border-blue-400 transition-all duration-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    </div>
                  </div>
                )}
                <span className={loading ? "opacity-0" : "opacity-100"}>Sign In to DevConnect</span>
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn-secondary w-full relative group overflow-hidden"
              >
                <span className="relative z-10">Try Demo Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-400">
                New to DevConnect?{" "}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Social proof */}
        <div className="text-center animate-fade-in">
          <p className="text-gray-400 text-sm mb-4">Trusted by 50,000+ developers worldwide</p>
          <div className="flex justify-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i}`}
                  alt={`User ${i}`}
                  className="w-8 h-8 rounded-full border-2 border-gray-800 hover:scale-110 transition-transform duration-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
