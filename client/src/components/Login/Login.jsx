"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { login } from "../../slices/authSlice"
import { toast } from "react-hot-toast"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles, ArrowRight } from "lucide-react"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { error, loading } = useSelector((state) => state.user)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const result = await dispatch(login(formData))
      if (login.fulfilled.match(result)) {
        toast.success("Welcome back! 🎉")
        router.push("/")
      } else {
        const errorMessage = result.payload || "Login failed"
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationEmail = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address first")
      return
    }

    try {
      const response = await fetch(`${process.env.VITE_BACKEND_BASEURL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Verification email sent successfully!")
      } else {
        toast.error("Failed to resend verification email")
      }
    } catch (error) {
      toast.error("An error occurred while resending email")
    }
  }

  const isEmailVerificationError =
    error && (error.toLowerCase().includes("verify") || error.toLowerCase().includes("verification"))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20" />

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="p-2 rounded-xl bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold text-white">Dev</span>
              <span className="text-3xl font-bold text-gradient">Sphere</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue your coding journey</p>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-modern w-full pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-modern w-full pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:placeholder-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card bg-red-500/10 border-red-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm">{error}</p>
                    {isEmailVerificationError && (
                      <button
                        type="button"
                        onClick={resendVerificationEmail}
                        className="text-red-300 hover:text-red-200 text-sm underline mt-2 transition-colors"
                      >
                        Resend verification email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              className="group relative w-full py-4 px-6 bg-gradient-primary text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading || loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-gradient font-medium hover:underline transition-all">
                Create one here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 glass-card bg-primary-500/10 border-primary-500/20 rounded-xl">
            <h4 className="text-sm font-medium text-primary-400 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Demo Credentials</span>
            </h4>
            <div className="text-xs text-gray-300 space-y-1 font-mono">
              <p>📧 demo@devsphere.com</p>
              <p>🔑 demo123</p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
