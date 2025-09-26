 

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
        `/user/register`,
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
        `/user/register/verification`,
        {
          verificationCode,
        },
        { withCredentials: true }
      )
      // console.log(result.data)
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
    <div className="reg-page">
      {isloading && (
        <div className="reg-loader-container">
          <Loader />
        </div>
      )}

      <div className="reg-container">
        {/* Progress Indicator */}
        <div className="reg-progress-indicator">
          <div className={`reg-progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="reg-step-circle">
              {step > 1 ? <FaCheckCircle /> : <FaUser />}
            </div>
            <span className="reg-step-label">Register</span>
          </div>
          <div className="reg-progress-line">
            <div className={`reg-progress-fill ${step > 1 ? 'filled' : ''}`}></div>
          </div>
          <div className={`reg-progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="reg-step-circle">
              <FaKey />
            </div>
            <span className="reg-step-label">Verify</span>
          </div>
        </div>

        {step === 1 && (
          <div className="reg-content">
            <div className="reg-header">
              <h1 className="reg-title">
                Create <span className="reg-title-accent">Account</span>
              </h1>
              <p className="reg-subtitle">Join our community today</p>
            </div>

            {/* Avatar Upload Section */}
            <div className="reg-avatar-section">
              <div 
                className={`reg-avatar-upload-area ${dragOver ? 'drag-over' : ''} ${avatar ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="reg-avatar-preview-wrapper">
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Avatar Preview"
                    className="reg-avatar-preview"
                  />
                  <div className="reg-avatar-overlay">
                    <FaCamera className="reg-camera-icon" />
                    <span className="reg-upload-text">
                      {avatar ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </div>
                </div>
                <label htmlFor="avatarInput" className="reg-avatar-upload-label">
                  <FaPencilAlt className="reg-pencil-icon" />
                </label>
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="reg-avatar-input"
                />
              </div>
              <p className="reg-avatar-hint">Click or drag & drop to upload your profile picture</p>
            </div>

            <form onSubmit={handleRegister} className="reg-form">
              <div className="reg-form-container">
                <div className={`reg-form-group ${focusedField === 'username' ? 'focused' : ''} ${formData.username ? 'filled' : ''}`}>
                  <label className="reg-form-label">
                    <FaUser className="reg-label-icon" />
                    <span>Username</span>
                  </label>
                  <div className="reg-input-wrapper">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Choose a unique username"
                      required
                      className="reg-form-input"
                    />
                    <div className="reg-input-border"></div>
                  </div>
                </div>

                <div className={`reg-form-group ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                  <label className="reg-form-label">
                    <FaEnvelope className="reg-label-icon" />
                    <span>Email Address</span>
                  </label>
                  <div className="reg-input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your email address"
                      required
                      className="reg-form-input"
                    />
                    <div className="reg-input-border"></div>
                  </div>
                </div>

                <div className={`reg-form-group ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
                  <label className="reg-form-label">
                    <FaLock className="reg-label-icon" />
                    <span>Password</span>
                  </label>
                  <div className="reg-input-wrapper reg-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Create a strong password"
                      required
                      className="reg-form-input"
                    />
                    <button
                      type="button"
                      className="reg-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <div className="reg-input-border"></div>
                  </div>
                </div>
              </div>

              <button type="submit" className="reg-button" disabled={isloading}>
                <span className="reg-button-content">
                  {isloading ? (
                    <>
                      <div className="reg-button-spinner"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <FaUser className="reg-button-icon" />
                      <span>Create Account</span>
                    </>
                  )}
                </span>
                <div className="reg-button-glow"></div>
              </button>

              <div className="reg-form-footer">
                <div className="reg-divider">
                  <span className="reg-divider-text">Already have an account?</span>
                </div>
                <p className="reg-login-text">
                  <Link to="/login" className="reg-login-link">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="reg-verification-content">
            <div className="reg-verification-header">
              <div className="reg-verification-icon">
                <FaKey />
              </div>
              <h1 className="reg-verification-title">
                Check Your <span className="reg-title-accent">Email</span>
              </h1>
              <p className="reg-verification-subtitle">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="reg-verification-form">
              <div className={`reg-form-group ${focusedField === 'code' ? 'focused' : ''} ${verificationCode ? 'filled' : ''}`}>
                <label className="reg-form-label">
                  <FaKey className="reg-label-icon" />
                  <span>Verification Code</span>
                </label>
                <div className="reg-input-wrapper">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    onFocus={() => setFocusedField('code')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter the 6-digit code"
                    required
                    className="reg-form-input reg-verification-input"
                    maxLength="6"
                  />
                  <div className="reg-input-border"></div>
                </div>
              </div>

              <button type="submit" className="reg-verify-button" disabled={isloading}>
                <span className="reg-button-content">
                  {isloading ? (
                    <>
                      <div className="reg-button-spinner"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="reg-button-icon" />
                      <span>Verify Account</span>
                    </>
                  )}
                </span>
                <div className="reg-button-glow"></div>
              </button>

              <div className="reg-verification-footer">
                <p className="reg-resend-text">
                  Didn't receive the code? <button type="button" className="reg-resend-link">Resend</button>
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