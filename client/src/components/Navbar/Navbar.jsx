import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

function Navbar() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toggleTooltip = () => {
    setIsTooltipOpen((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      <div className="navbar-center">Ticket Management System</div>

      <div className="navbar-right">
        <FaUserCircle
          size={32}
          style={{ cursor: "pointer" }}
          onClick={toggleTooltip}
        />

        {isTooltipOpen && user && (
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
