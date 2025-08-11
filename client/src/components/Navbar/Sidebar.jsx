 
import { FaBars, FaHome, FaUser, FaCog } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { BiCodeAlt } from "react-icons/bi";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiUsers } from "react-icons/hi2";
import "./Sidebar.css";

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const user = useSelector((state) => state.user.userData);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSettingsMenu = () => setIsSettingsOpen(!isSettingsOpen);

  const handleMyProfileClick = async () => {
    await navigate('/myProfile');
    if (window.innerWidth <= 768) setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className={`yyzz-main-container ${isOpen ? 'yyzz-sidebar-open' : 'yyzz-sidebar-closed'}`}>
      <div className={`yyzz-sidebar ${isOpen ? "yyzz-open" : "yyzz-closed"} yyzz-glass-effect yyzz-modern-shadow`}>
        <div className="yyzz-top_section">
          {isOpen && (
            <h1 className="yyzz-logo">
              <span>Dev</span>
              <span>Sphere</span>
            </h1>
          )}
          <div className="yyzz-bars yyzz-hover-lift" onClick={toggleSidebar}>
            <FaBars />
          </div>
        </div>
        <div className="yyzz-user-info">
          {user ? (
            <div className="yyzz-top-sdb-in">
              <div onClick={handleMyProfileClick} className="yyzz-sidebar-profile-container yyzz-hover-lift">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="yyzz-user-avatar-1"
                />
              </div>
              {isOpen && <h3 className="yyzz-username" onClick={handleMyProfileClick}>{user.username}</h3>}
            </div>
          ) : (
            <>
              <div></div>
              {isOpen && <h3 className="yyzz-username">Login</h3>}
            </>
          )}
        </div>

        <section className="yyzz-routes">
          <div className="yyzz-menu">
            <Link to="/post" className="yyzz-menu_item yyzz-hover-lift" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
              <div className="yyzz-icon">
                <FaHome />
              </div>
              {isOpen && <div className="yyzz-link_text">Home</div>}
            </Link>
          </div>
          <div className="yyzz-menu">
            <Link to="/chat" className="yyzz-menu_item yyzz-hover-lift" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
              <div className="yyzz-icon">
                <MdMessage />
              </div>
              {isOpen && <div className="yyzz-link_text">Chat</div>}
            </Link>
          </div>
          <div className="yyzz-menu">
            <Link to="/compile" className="yyzz-menu_item yyzz-hover-lift" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
              <div className="yyzz-icon">
                <BiCodeAlt />
              </div>
              {isOpen && <div className="yyzz-link_text">Compile</div>}
            </Link>
          </div>
          {!user && (
            <div className="yyzz-menu">
              <Link to="/login" className="yyzz-menu_item yyzz-hover-lift" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
                <div className="yyzz-icon">
                  <FaUser />
                </div>
                {isOpen && <div className="yyzz-link_text">Login</div>}
              </Link>
            </div>
          )}
          <div className="yyzz-menu">
            <Link to="/myProfile" className="yyzz-menu_item yyzz-hover-lift" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
              <div className="yyzz-icon">
                <FaUser />
              </div>
              {isOpen && <div className="yyzz-link_text">My Profile</div>}
            </Link>
          </div>
          <div className="yyzz-menu">
            <div className="yyzz-menu_item yyzz-hover-lift" onClick={toggleSettingsMenu}>
              <div className="yyzz-icon">
                <FaCog />
              </div>
              {isOpen && <div className="yyzz-link_text">Settings</div>}
            </div>
            {isSettingsOpen && isOpen && (
              <div className="yyzz-submenu">
                <div className="yyzz-submenu_item yyzz-hover-lift">
                  <Link to="/user/Edit-profile" className="yyzz-link_text" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
                    <div className="yyzz-icon">
                      <FaUser />
                    </div>
                    Edit Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="yyzz-menu">
            <Link to="/devProfile" className="yyzz-menu_item yyzz-hover-lift" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
              <div className="yyzz-icon">
                <HiUsers />
              </div>
              {isOpen && <div className="yyzz-link_text">Dev Profiles</div>}
            </Link>
          </div>
        </section>
        {user && (
          <div className="yyzz-logout-btn yyzz-hover-lift">
            <Link to="/logout" onClick={() => window.innerWidth <= 768 && setIsOpen(false)}>
              <FiLogOut />
            </Link>
          </div>
        )}
      </div>
      <div className="yyzz-main-content">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;