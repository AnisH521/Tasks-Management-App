import React, { useState } from "react";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Monitor from "../Monitor/Monitor";
import IssueList from "../IssueList/IssueList";
import RegisterIssue from "../RegisterIssue/RegisterIssue";

function Dashboard() {
  // Default selected = "monitor"
  const [selected, setSelected] = useState("monitor");

  const renderContent = () => {
    switch (selected) {
      case "monitor":
        return <Monitor />;
      case "issues":
        return <IssueList />;
      case "register":
        return <RegisterIssue />;
      default:
        return <Monitor />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar selected={selected} setSelected={setSelected} />
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
