"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { FaPencilAlt, FaUser, FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash, FaCamera, FaCheckCircle } from "react-icons/fa"
import "./Register.css"
import DefaultAvatar from "../../../public/userimg.jpg"
import axios from "axios"
import Loader from "../../components/Loader/Loader"

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar)
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [isloading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const [dragOver, setDragOver] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result)
          setAvatar(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result)
          setAvatar(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!avatar) {
      toast.error("Please upload an avatar.")
      return
    }

    const completeData = new FormData()
    completeData.append("username", formData.username)
    completeData.append("email", formData.email)
    completeData.append("password", formData.password)
    completeData.append("avatar", avatar)

    try {
      setIsLoading(true)
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/user/register`,
        completeData,
        { withCredentials: true }
      )
      if (result.data.success) {
        setIsLoading(false)
        toast.success("Verification code sent to your email.")
        setStep(2)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.")
      console.error("REGISTER ERROR: ", err)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/user/register/verification`,
        {
          verificationCode,
        },
        { withCredentials: true }
      )
      console.log(result.data)
      if (result.data.success) {
        setIsLoading(false)
        toast.success("Registration successful. Please log in.")
        navigate("/login")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.")
      console.error("VERIFICATION ERROR: ", err)
    }
  }

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {isloading && (
        <div className="loader-container">
          <Loader />
        </div>
      )}

      <div className="register-container">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 1 ? <FaCheckCircle /> : <FaUser />}
            </div>
            <span className="step-label">Register</span>
          </div>
          <div className="progress-line">
            <div className={`progress-fill ${step > 1 ? 'filled' : ''}`}></div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">
              <FaKey />
            </div>
            <span className="step-label">Verify</span>
          </div>
        </div>

        {step === 1 && (
          <div className="register-content">
            <div className="register-header">
              <h1 className="register-title">
                Create <span className="title-accent">Account</span>
              </h1>
              <p className="register-subtitle">Join our community today</p>
            </div>

            {/* Avatar Upload Section */}
            <div className="avatar-section">
              <div 
                className={`avatar-upload-area ${dragOver ? 'drag-over' : ''} ${avatar ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="avatar-preview-wrapper">
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Avatar Preview"
                    className="avatar-preview"
                  />
                  <div className="avatar-overlay">
                    <FaCamera className="camera-icon" />
                    <span className="upload-text">
                      {avatar ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </div>
                </div>
                <label htmlFor="avatarInput" className="avatar-upload-label">
                  <FaPencilAlt className="pencil-icon" />
                </label>
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="avatar-input"
                />
              </div>
              <p className="avatar-hint">Click or drag & drop to upload your profile picture</p>
            </div>

            <form onSubmit={handleRegister} className="register-form">
              <div className="form-container">
                <div className={`form-group ${focusedField === 'username' ? 'focused' : ''} ${formData.username ? 'filled' : ''}`}>
                  <label className="form-label">
                    <FaUser className="label-icon" />
                    <span>Username</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Choose a unique username"
                      required
                      className="form-input"
                    />
                    <div className="input-border"></div>
                  </div>
                </div>

                <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                  <label className="form-label">
                    <FaEnvelope className="label-icon" />
                    <span>Email Address</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your email address"
                      required
                      className="form-input"
                    />
                    <div className="input-border"></div>
                  </div>
                </div>

                <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
                  <label className="form-label">
                    <FaLock className="label-icon" />
                    <span>Password</span>
                  </label>
                  <div className="input-wrapper password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Create a strong password"
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <div className="input-border"></div>
                  </div>
                </div>
              </div>

              <button type="submit" className="register-button" disabled={isloading}>
                <span className="button-content">
                  {isloading ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <FaUser className="button-icon" />
                      <span>Create Account</span>
                    </>
                  )}
                </span>
                <div className="button-glow"></div>
              </button>

              <div className="form-footer">
                <div className="divider">
                  <span className="divider-text">Already have an account?</span>
                </div>
                <p className="login-text">
                  <Link to="/login" className="login-link">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="verification-content">
            <div className="verification-header">
              <div className="verification-icon">
                <FaKey />
              </div>
              <h1 className="verification-title">
                Check Your <span className="title-accent">Email</span>
              </h1>
              <p className="verification-subtitle">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="verification-form">
              <div className={`form-group ${focusedField === 'code' ? 'focused' : ''} ${verificationCode ? 'filled' : ''}`}>
                <label className="form-label">
                  <FaKey className="label-icon" />
                  <span>Verification Code</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    onFocus={() => setFocusedField('code')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter the 6-digit code"
                    required
                    className="form-input verification-input"
                    maxLength="6"
                  />
                  <div className="input-border"></div>
                </div>
              </div>

              <button type="submit" className="verify-button" disabled={isloading}>
                <span className="button-content">
                  {isloading ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="button-icon" />
                      <span>Verify Account</span>
                    </>
                  )}
                </span>
                <div className="button-glow"></div>
              </button>

              <div className="verification-footer">
                <p className="resend-text">
                  Didn't receive the code? <button type="button" className="resend-link">Resend</button>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
