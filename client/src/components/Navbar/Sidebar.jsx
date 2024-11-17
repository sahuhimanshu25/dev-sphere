import { FaBars, FaHome, FaUser, FaCog, FaSearch } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { BiCodeAlt } from "react-icons/bi"; // Importing a new icon
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.user.userData);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSettingsMenu = () => setIsSettingsOpen(!isSettingsOpen);

  return (
    <div className="main-container">
      {/* Fixed syntax error in className */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="top_section">
          {isOpen && <h1 className="logo">DevChat</h1>}
          <div className="bars" onClick={toggleSidebar}>
            <FaBars />
          </div>
        </div>
        <div className="user-info">
          {user ? (
            <>
              <div>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="user-avatar"
                />
              </div>
              {isOpen && <h3 className="username">{user.username}</h3>}
            </>
          ) : (
            <>
              <div></div>
              {isOpen && <h3 className="username">Login</h3>}
            </>
          )}
        </div>

        <div className="search">
          <div className="search_icon">
            <FaSearch />
          </div>
          {isOpen && (
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        <section className="routes">
          <div className="menu">
            <Link to="/post" className="menu_item">
              <div className="icon">
                <FaHome />
              </div>
              {isOpen && <div className="link_text">Home</div>}
            </Link>
          </div>
          <div className="menu">
            <Link to="/chat" className="menu_item">
              <div className="icon">
                <MdMessage />
              </div>
              {isOpen && <div className="link_text">Chat</div>}
            </Link>
          </div>
          <div className="menu">
            <Link to="/compile" className="menu_item">
              <div className="icon">
                <BiCodeAlt /> {/* Updated icon */}
              </div>
              {isOpen && <div className="link_text">Compile</div>}
            </Link>
          </div>
          {!user && (
            <div className="menu">
              <Link to="/login" className="menu_item">
                <div className="icon">
                  <FaUser />
                </div>
                {isOpen && <div className="link_text">Login</div>}
              </Link>
            </div>
          )}
          <div className="menu">
            <Link to="/myProfile" className="menu_item">
              <div className="icon">
                <FaUser />
              </div>
              {isOpen && <div className="link_text">My Profile</div>}
            </Link>
          </div>
          <div className="menu">
            <div className="menu_item" onClick={toggleSettingsMenu}>
              <div className="icon">
                <FaCog />
              </div>
              {isOpen && <div className="link_text">Settings</div>}
            </div>

            {isSettingsOpen && (
              <div className="submenu">
                <div className="submenu_item">
                  <Link to="/user/Edit-profile" className="link_text">
                    <div className="icon">
                      <FaUser />
                    </div>
                    Edit Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
        {user && (
          <div className="logout-btn">
            <Link to="/logout">
              <FiLogOut />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
