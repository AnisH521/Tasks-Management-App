import React from "react";
import "./Sidebar.css";

function Sidebar({ selected, setSelected }) {
  return (
    <div className="sidebar">
      <ul>
        <li
          className={selected === "monitor" ? "active" : ""}
          onClick={() => setSelected("monitor")}
        >
          Monitor
        </li>
        <li
          className={selected === "issues" ? "active" : ""}
          onClick={() => setSelected("issues")}
        >
          Issue List
        </li>
        <li
          className={selected === "register" ? "active" : ""}
          onClick={() => setSelected("register")}
        >
          Issue Register
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
