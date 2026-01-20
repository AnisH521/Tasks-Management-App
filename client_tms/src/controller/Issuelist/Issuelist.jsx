import React, { useEffect } from "react";

import { API_BASE_URL } from "../../config/config";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Issuelist.css";

function Issuelist() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const bodyData = {};
        // if (filter !== "all") bodyData.status = filter;
        // if (categoryFilter !== "all") bodyData.category = categoryFilter;

        const response = await fetch(`${API_BASE_URL}/api/v1/tickets/get-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...bodyData,
            sortBy: "date",
            limit: 50,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🚀 Fetched Issues:", data);
        setIssues(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filter, categoryFilter]);

  const filteredIssues = issues.filter((issue) =>
    issue.complaintDescription
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "status-open";
      case "closed":
        return "status-closed";
      case "forwarded":
        return "status-forwarded";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="issue-container">
      <h2>All Issue List</h2>

      <div className="filter-search-bar">
        {/* <div className="filter-box">
          <FaFilter style={{ marginRight: "8px", color: "#004080" }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="forwarded">Forwarded</option>
            <option value="rejected">Rejected</option>
          </select>
        </div> */}

        {/* <div className="filter-box">
          <FaFilter style={{ marginRight: "8px", color: "#004080" }} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Safety">Safety</option>
            <option value="Asset-Failure">Asset-Failure</option>
            <option value="Non-Safety">Non-Safety</option>
          </select>
        </div> */}
      </div>

      <div className="table-wrapper">
        <table className="issue-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>SubCategory</th>
              <th>Complaint Description</th>
              <th>Registered By</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <tr
                  key={issue._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/monitor/issues/${issue._id}`)}
                >
                  <td>{issue.category || "-"}</td>
                  <td>{issue.subCategory || "-"}</td>
                  <td>{issue.complaintDescription || "-"}</td>
                  <td>{issue.employeeName || "-"}</td>
                  <td>{issue.remarks || "-"}</td>
                  <td className={getStatusClass(issue.status)}>
                    {issue.status || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Issuelist;
