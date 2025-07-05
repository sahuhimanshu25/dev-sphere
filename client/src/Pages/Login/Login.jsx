"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../Slices/authSlice.js"
import "./Login.css"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Loader from "../../components/Loader/Loader.jsx"

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.user)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e, demoCredentials = null) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Modern toast for server wakeup
    toast(
      <div className="modern-toast">
        <div className="toast-icon-wrapper">
          <div className="toast-spinner"></div>
          <span className="toast-icon">🚀</span>
        </div>
        <div className="toast-content">
          <div className="toast-title">Waking up the server...</div>
          <div className="toast-subtitle">This may take up to 40 seconds. Thanks for your patience!</div>
        </div>
        <div className="toast-progress"></div>
      </div>,
      {
        duration: 6000,
        position: "top-center",
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          transform: "translateX(-60px)", // Move toast 60px to the left
        },
      },
    )

    const credentials = demoCredentials || { email, password }
    try {
      const result = await dispatch(login(credentials)).unwrap()
      if (result) {
        toast.success("Login Successful", {
          style: {
            background: "linear-gradient(135deg, #7c78eb 0%, #605dd3 100%)",
            color: "white",
            border: "1px solid rgba(124, 120, 235, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(124, 120, 235, 0.3)",
          },
          iconTheme: {
            primary: "white",
            secondary: "#7c78eb",
          },
        })
        console.log(result, "latest update 6.50")
        navigate("/post")
      }
    } catch (err) {
      toast.error(err || "Login failed. Please check your credentials.", {
        style: {
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
          color: "white",
          border: "1px solid rgba(255, 107, 107, 0.3)",
          borderRadius: "12px",
          padding: "16px 20px",
          fontSize: "16px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
        },
        iconTheme: {
          primary: "white",
          secondary: "#ff6b6b",
        },
      })
      console.error("LOGIN.JSX ERROR: ", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (e) => {
    const demoCredentials = {
      email: import.meta.env.VITE_EMAIL,
      password: import.meta.env.VITE_PASSWORD,
    }
    handleLogin(e, demoCredentials)
  }

  return (
    <div className="log">
      <div className="login-container">
        <h2 className="login-title">
          <span>Log</span>
          <span>in</span>
        </h2>
        {loading && <Loader />}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>
              <span className="icon">📧</span>
              <span className="icon-t">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input"
            />
          </div>
          <div className="form-group">
            <label>
              <span className="icon">🔒</span>
              <span className="icon-t">Password</span>
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="login-input"
              />
              <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="login-button demo-button"
            onClick={handleDemoLogin}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? "Logging in..." : "Login as Demo User"}
          </button>
          <div className="reg">
            <span>Don't have an account? </span>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
