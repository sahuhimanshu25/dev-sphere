import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function MainNavbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyApp</Link>
      </div>
      <ul className="navbar-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === "/compile" ? "active" : ""}>
          <Link to="/compile">Compile</Link>
        </li>
        <li className={location.pathname === "/login" ? "active" : ""}>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default MainNavbar;