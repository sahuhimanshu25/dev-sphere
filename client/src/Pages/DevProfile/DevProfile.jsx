 

import React, { useState, useEffect, useRef } from "react"
import "./DevProfile.css"
import { 
  FaInstagram, 
  FaLinkedin, 
  FaGithub, 
  FaArrowDown, 
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaHeart,
  FaStar
} from "react-icons/fa"
import Himanshu from "../../../public/Himanshu.png"
import Mushraf from "../../../public/Mushraf.jpg"

const DevProfile = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [isVisible, setIsVisible] = useState({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRefs = useRef([])

  // Mouse tracking for card tilt effect
  const handleMouseMove = (e, cardIndex) => {
    const card = cardRefs.current[cardIndex]
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
  }

  const handleMouseLeave = (cardIndex) => {
    const card = cardRefs.current[cardIndex]
    if (!card) return
    
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.dataset.index]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.2 }
    )

    cardRefs.current.forEach(card => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  const developers = [
    {
      id: 1,
      name: "JM Mushraf",
      role: "Full-stack Developer (MERN)",
      image: Mushraf,
      description: "Passionate about building full-stack applications, from front-end interfaces to back-end services. Skilled in creating user-friendly designs and handling server-side logic with technologies like MongoDB, Express, React, and Node.js.",
      projects: [
        {
          name: "Coride",
          description: "A ride-sharing app for travelers.",
          tech: ["React", "Node.js", "MongoDB"]
        },
        {
          name: "WebSphere",
          description: "A platform designed for coders to collaborate, share, and manage their coding projects efficiently.",
          tech: ["MERN Stack", "Socket.io", "JWT"]
        }
      ],
      internships: [
        {
          company: "Cropnow",
          role: "Full-stack Developer Intern",
          duration: "4 months"
        }
      ],
      social: {
        instagram: "https://www.instagram.com/_mushraf_jm/",
        linkedin: "https://www.linkedin.com/in/mushraf-jm-386564306/",
        github: "https://github.com/JM-Mushraf"
      },
      skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "Python"],
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Himanshu Sahu",
      role: "Full-stack Developer (MERN)",
      image: Himanshu,
      description: "Software developer skilled in C++, React, and Node.js. Designed NovaScript’s syntax and built its compiler core. Passionate about language design, systems programming, and building real-world applications.",
      projects: [
        {
          name: "Coride",
          description: "A ride-sharing app for travelers.",
          tech: ["React", "Node.js", "MongoDB"]
        },
        {
          name: "GemiCook",
          description: "A Simple Solutions to find your recipes and make one.",
          tech: ["React", "API Integration", "CSS3"]
        }
      ],
      internships: [],
      social: {
        instagram: "https://www.instagram.com/hi_ma_n_sh_u/",
        linkedin: "https://www.linkedin.com/in/himanshu-sahu-303b2b25a/",
        github: "https://github.com/Himanshu25Sahu"
      },
      skills: ["React", "Node.js", "MongoDB", "Express", "C++", "Python"],
      gradient: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <div className="dev-profile-page">
      {/* Animated Background */}
      <div className="profile-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Meet Our <span className="title-accent">Developers</span></h1>
        <p className="page-subtitle">The brilliant minds behind DevSphere</p>
      </div>

      {/* Developer Cards */}
      <div className="developers-container">
        {developers.map((dev, index) => (
          <div
            key={dev.id}
            ref={el => cardRefs.current[index] = el}
            data-index={index}
            className={`developer-card ${isVisible[index] ? 'animate-in' : ''}`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {/* Card Glow Effect */}
            <div className={`card-glow bg-gradient-to-r ${dev.gradient}`}></div>
            
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-image-container">
                <div className={`image-ring bg-gradient-to-r ${dev.gradient}`}></div>
                <img src={dev.image || "/placeholder.svg"} alt={dev.name} className="profile-image" />
                <div className="status-indicator"></div>
              </div>
              
              <div className="profile-basic-info">
                <h2 className="developer-name">{dev.name}</h2>
                <p className="developer-role">
                  <FaCode className="role-icon" />
                  {dev.role}
                </p>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="skills-section">
              <h3 className="section-title">
                <FaGraduationCap className="section-icon" />
                Skills
              </h3>
              <div className="skills-tags">
                {dev.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <p className="developer-description">{dev.description}</p>
            </div>

            {/* Projects Section */}
            <div className="projects-section">
              <h3 className="section-title">
                <FaCode className="section-icon" />
                Featured Projects
              </h3>

            </div>


            {/* Social Links */}
            <div className="social-section">
              <h3 className="section-title">Connect</h3>
              <div className="social-links">
                <a
                  href={dev.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link instagram"
                >
                  <FaInstagram />
                  <span className="social-tooltip">Instagram</span>
                </a>
                <a
                  href={dev.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                >
                  <FaLinkedin />
                  <span className="social-tooltip">LinkedIn</span>
                </a>
                <a
                  href={dev.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github"
                >
                  <FaGithub />
                  <span className="social-tooltip">GitHub</span>
                </a>
              </div>
            </div>

            {/* Card Footer */}

          </div>
        ))}
      </div>


    </div>
  )
}

export default DevProfile
