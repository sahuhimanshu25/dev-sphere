"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error")
      setMessage("Invalid verification link. Please check your email and try again.")
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch(`${process.env.VITE_BACKEND_BASEURL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationStatus("success")
        setMessage("Your email has been successfully verified! You can now log in to your account.")
        toast.success("Email verified successfully!")

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setVerificationStatus("error")
        setMessage(data.message || "Email verification failed. The link may be expired or invalid.")
        toast.error("Email verification failed")
      }
    } catch (error) {
      setVerificationStatus("error")
      setMessage("An error occurred during email verification. Please try again.")
      toast.error("Verification error")
    }
  }

  const resendVerificationEmail = async () => {
    try {
      const email = searchParams.get("email")
      if (!email) {
        toast.error("Email address not found. Please register again.")
        return
      }

      const response = await fetch(`${process.env.VITE_BACKEND_BASEURL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <span className="text-3xl font-bold text-white">Dev</span>
            <span className="text-3xl font-bold text-primary">Sphere</span>
          </Link>
        </div>

        {/* Verification Status */}
        <div className="glass-effect rounded-xl p-8 border border-primary/20 text-center">
          {verificationStatus === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary/20 p-3">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Verifying Your Email</h2>
              <p className="text-gray-300">Please wait while we verify your email address...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-500/20 p-3">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
              <p className="text-gray-300 mb-6">{message}</p>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <p className="text-green-400 text-sm">Redirecting to login page in 3 seconds...</p>
              </div>

              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white text-center rounded-lg transition-colors duration-200"
              >
                Continue to Login
              </Link>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-red-500/20 p-3">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
              <p className="text-gray-300 mb-6">{message}</p>

              <div className="space-y-4">
                <button
                  onClick={resendVerificationEmail}
                  className="w-full py-3 px-4 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors duration-200"
                >
                  Resend Verification Email
                </button>

                <div className="flex space-x-4">
                  <Link
                    href="/register"
                    className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 text-center rounded-lg transition-colors duration-200"
                  >
                    Register Again
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white text-center rounded-lg transition-colors duration-200"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Need help?</p>
          <Link href="/" className="text-primary hover:text-primary-light transition-colors text-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
