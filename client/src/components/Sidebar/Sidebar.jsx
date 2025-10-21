import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (tab) => {
    setIsOpen(false);
    switch (tab) {
      case "monitor":
        navigate("/monitor");
        break;
      case "issues":
        navigate("/monitor/issues");
        break;
      case "register":
        navigate("/monitor/register");
        break;
      default:
        navigate("/monitor");
    }
  };

  // Helper function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="hamburger" onClick={handleToggle}>
        <FaBars size={24} />
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li
            onClick={() => handleSelect("monitor")}
            className={isActive("/monitor") ? "active" : ""}
          >
            Monitor
          </li>
          <li
            onClick={() => handleSelect("issues")}
            className={isActive("/monitor/issues") ? "active" : ""}
          >
            Issue List
          </li>
          <li
            onClick={() => handleSelect("register")}
            className={isActive("/monitor/register") ? "active" : ""}
          >
            Issue Register
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
