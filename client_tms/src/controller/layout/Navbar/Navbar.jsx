import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { API_BASE_URL } from "../../../config/config";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true },
      );

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">TMS</span>
      </div>

      <div className="navbar-right">
        <div className="profile" onClick={handleProfileClick}>
          Profile 👨🏻‍💻
          {dropdownOpen && user && (
            <div className="dropdown">
              <div className="profile-info">
                <p>
                  <strong>{user.name}</strong>
                </p>
                <p>
                  {" "}
                  <b>User ID: </b>
                  {user.userID}
                </p>
                <p>
                  {" "}
                  <b>Dept: </b>
                  {user.department}
                </p>
                <p>
                  {" "}
                  <b>Role: </b>
                  {user.role}
                </p>
              </div>

              <hr />

              <button className="dropdown-item-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
