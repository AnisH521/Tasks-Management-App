import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/register-issue"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setOpen(false)}
          >
            Register Issue
          </NavLink>

          <NavLink
            to="/issue-list"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setOpen(false)}
          >
            Received Issue List
          </NavLink>

          <NavLink
            to="/raised-issue-list"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
            onClick={() => setOpen(false)}
          >
            Raised Issue List
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
