 

import { useContext, useState } from "react"
import logo from "../../../public/bgrLogo.png"
import { ModalContext } from "../../context/ModalContext"
import { FiPlus, FiCode, FiZap } from "react-icons/fi"
import "./leftComponent.css"

const LeftComponent = () => {
  const { openModal } = useContext(ModalContext)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="modern-left-container">
      <div className="modern-left-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="logo-container">
            <img className="modern-logo" src={logo || "/placeholder.svg"} alt="DevSphere Logo" />
            <div className="logo-glow"></div>
          </div>

          <div className="brand-section">
            <h1 className="modern-brand-title">
              <span className="brand-dev">Dev</span>
              <span className="brand-sphere">Sphere</span>
            </h1>
            <p className="modern-tagline">Where Code Comes to Life</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-showcase">
          <div className="feature-item">
            <div className="feature-icon">
              <FiCode />
            </div>
            <span>Code</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FiZap />
            </div>
            <span>Compile</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FiZap />
            </div>
            <span>Debug</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="cta-section">
          <button
            className={`modern-create-button ${isHovered ? "hovered" : ""}`}
            onClick={() =>
              openModal({
                show: true,
                modalType: 3,
                identifiers: { folderId: "", cardId: "" },
              })
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="button-background">
              <div className="button-gradient"></div>
              <div className="button-shine"></div>
            </div>
            <div className="button-content">
              <FiPlus className="button-icon" />
              <span className="button-text">Create New Playground</span>
            </div>
            <div className="button-ripple"></div>
          </button>

          <p className="cta-description">Start coding instantly with our powerful online IDE</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
      </div>
    </div>
  )
}

export default LeftComponent
