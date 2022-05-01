import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ history }) => {
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  return (
    <nav>
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          <h2>Smart Health Monitoring System</h2>
        </NavLink>
        <div className="nav-links">
          <button onClick={logoutHandler} className="nav-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
