import { Routes, Route } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Monitor from "../Monitor/Monitor";
import IssueList from "../IssueList/IssueList";
import IssueDetails from "../IssueDetails/IssueDetails"; // create this component
import RegisterIssue from "../RegisterIssue/RegisterIssue";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Monitor />} />
            <Route path="issues" element={<IssueList />} />
            <Route path="issues/:issueId" element={<IssueDetails />} />
            <Route path="register" element={<RegisterIssue />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
