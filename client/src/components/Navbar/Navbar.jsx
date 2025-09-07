import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
              <strong>{user.name}</strong>
            </p>
            <p>{user.email}</p>
            <p>{user.department}</p>
            <p>{user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
