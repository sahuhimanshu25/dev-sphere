import React from "react";
import { Link } from "react-router-dom";
import "./MainHome.css";
const MainHome = () => {
  return (
    <>
      <div class="home-card">
        <div class="home-loader">
          <p>For Developers To </p>
          <div class="home-words">
            <span class="home-word">Create</span>
            <span class="home-word">Explore</span>
            <span class="home-word">Understand</span>
            <span class="home-word">View</span>
            <span class="home-word">buttons</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainHome;
