import React from "react";
import "./Loader.css"

const Loader = () => {
  return (
    <div className="devsphere-loader">
      <div className="loader-container">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
        <div className="loader-text">
          <span className="brand-name">DevSphere</span>
          <span className="loading-text">Loading...</span>
        </div>
      </div>
    </div>
  )
}

export default Loader

