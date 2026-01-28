import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/register-issue"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Register Issue
        </NavLink>

        <NavLink
          to="/issue-list"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Received Issue List
        </NavLink>
        <NavLink
          to="/raised-issue-list"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Raised Issue List
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
