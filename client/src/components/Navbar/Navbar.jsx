import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Navbar.css";
import Logo from "../../assets/logo.png";

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // useNavigate for redirection

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear user data and other tokens if stored
    localStorage.removeItem("userInfo");
    // Optionally clear other data, cookies, etc. here

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      {/* Center: Title */}
      <div className="navbar-center">Ticket Management System</div>

      {/* Right: Profile Icon */}
      <div
        className="navbar-right"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FaUserCircle size={32} style={{ cursor: "pointer" }} />

        {isHovered && user && (
          <div className="user-tooltip">
            <p>
              <strong>Name: {user.name}</strong>
            </p>
            <p>Email: {user.email}</p>
            <p>Department: {user.department}</p>
            <p>Role: {user.role}</p>
            <hr />
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
