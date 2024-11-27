import React from "react";
import "./DevProfile.css";
import { FaInstagram, FaLinkedin, FaGithub, FaArrowDown } from "react-icons/fa"; // Import the arrow icon
import image from "../../../public/userimg.jpg";
import Mushraf from "../../../public/Mushraf.jpg";

const DevProfile = () => {
  return (
    <div className="dev-profile-page">
      <div className="dev-profile-card">
        <div className="dev-info">
          <img src={Mushraf} alt="Developer 1" className="dev-image" />
          <h2 className="dev-name">JM Mushraf</h2>
          <p className="dev-role">Full-stack Developer (MERN)</p>
          <p className="dev-description">
            Passionate about building full-stack applications, from front-end
            interfaces to back-end services. Skilled in creating user-friendly
            designs and handling server-side logic with technologies like
            MongoDB, Express, React, and Node.js.
          </p>

          <div className="dev-projects">
            <h3 className="dev-section-title">Projects</h3>
            <ul className="dev-list">
              <li>Coride: A ride-sharing app for travelers.</li>
              <li>
                WebSphere: A platform designed for coders to collaborate, share,
                and manage their coding projects efficiently.
              </li>
            </ul>
            <div className="sep11"></div>
            <h3 className="dev-section-title">Internships</h3>
            <ul className="dev-list">
              <li>Cropnow: Full-stack Developer Intern (4 months).</li>
            </ul>
            <div className="scroll-indicator">
              <FaArrowDown />
            </div>
          </div>
          <div className="dev-social-links">
            <a
              href="https://www.instagram.com/_mushraf_jm/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/mushraf-jm-386564306/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/JM-Mushraf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon github"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="dev-profile-card">
        <div className="dev-info">
          <img src={image} alt="Developer 1" className="dev-image" />
          <h2 className="dev-name">DEV1</h2>
          <p className="dev-role">Full-stack Developer (MERN)</p>
          <p className="dev-description">
            Expert in creating scalable server-side applications, API
            integrations, and performance optimization. Experienced with
            MongoDB, Express, React, and Node.js.
          </p>
          <div className="dev-projects">
            <h3 className="dev-section-title">Projects</h3>
            <ul className="dev-list">
              <li>Coride: A ride-sharing app for travelers.</li>
              <li>Shield: Web app for network anomaly detection.</li>
            </ul>
            <div className="sep11"></div>
            <h3 className="dev-section-title">Internships</h3>
            <ul className="dev-list">
              <li>Cropnow: Full-stack Developer Intern (4 months).</li>
            </ul>
            <div className="scroll-indicator">
              <FaArrowDown />
            </div>
          </div>
          <div className="dev-social-links">
            <a
              href="https://www.instagram.com/dev1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/dev1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/dev1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon github"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevProfile;
