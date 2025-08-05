"use client"

import { useNavigate } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({ isFullScreen }) => {
  const navigate = useNavigate()

  return (
    <div className={`navbar-container ${isFullScreen ? "fullscreen" : ""}`}>
      <button className="navbar-content" onClick={() => navigate("/")}>
        <h1 className="main-heading">
          <span>Dev</span> <span>Sphere</span>
        </h1>
      </button>
    </div>
  )
}

export default Navbar
