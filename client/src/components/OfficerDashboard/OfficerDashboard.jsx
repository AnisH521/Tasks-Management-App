import React, { useState } from "react";
import "./OfficerDashboard.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";

function OfficerDashboard() {
  const [selected, setSelected] = useState("dashboard"); // default is dashboard

  return (
    <div className="officer-dashboard">
      <Navbar />
      <div className="content">
        <Sidebar selected={selected} setSelected={setSelected} />

        <div className="main-content">
          {selected === "dashboard" && <Dashboard />}
          {selected === "issues" && <h2>Issue List will appear here</h2>}
        </div>
      </div>
    </div>
  );
}

export default OfficerDashboard;
