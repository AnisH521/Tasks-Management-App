import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import "./IssueList.css";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const bodyData = filter === "all" ? {} : { status: filter };

        const response = await fetch(
          "http://localhost:3000/api/v1/tickets/get-all",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...bodyData,
              sortBy: "date",
              limit: 50,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setIssues(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filter]);

  const filteredIssues = issues.filter((issue) =>
    issue.complaintDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!issues.length) return <p>No issues found.</p>;

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="issue-container">
      <h2>All Issue List</h2>

      <div className="filter-search-bar">
        <div className="filter-box">
          <FaFilter style={{ marginRight: "8px", color: "#004080" }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="forwarded">Forwarded</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="issue-table">
          <thead>
            <tr>
              <th>Building</th>
              <th>Category</th>
              <th>Complaint Description</th>
              <th>Employee Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.location?.building || "-"}</td>
                <td>{issue.category || "-"}</td>
                <td>{issue.complaintDescription || "-"}</td>
                <td>{issue.employeeName || "-"}</td>
                <td className={getStatusClass(issue.status)}>
                  {issue.status || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IssueList;
