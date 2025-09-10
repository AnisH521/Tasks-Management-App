import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaArrowRight } from "react-icons/fa";
import "./IssueList.css";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State for modal and selected issue details
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // const bodyData = filter === "all" ? {} : { status: filter };

        const bodyData = {};
        if (filter !== "all") bodyData.status = filter;
        if (categoryFilter !== "all") bodyData.category = categoryFilter;

        const response = await fetch(
          "http://localhost:5000/api/v1/tickets/get-all",
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
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filter, categoryFilter]);

  const fetchIssueDetails = async (issueId) => {
    setModalLoading(true);
    setModalError("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/tickets/get/${issueId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedIssue(data.data);
      setModalOpen(true);
    } catch (err) {
      setModalError(err.message || "Failed to fetch issue details");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) =>
    issue.complaintDescription?.toLowerCase().includes(searchTerm.toLowerCase())
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
  if (!issues.length) return <p>No issues found.</p>;

  return (
    <div className="issue-container">
      <h2>All Issue List</h2>

      <div className="filter-search-bar">
        <div className="filter-box">
          <FaFilter style={{ marginRight: "8px", color: "#004080" }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="forwarded">Forwarded</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {/* Category Filter */}
        <div className="filter-box">
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
        </div>

        {/* <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
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
              <tr
                key={issue._id}
                onClick={() => fetchIssueDetails(issue._id)}
                style={{ cursor: "pointer" }}
              >
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

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            // Close modal only if the click is on the overlay, not inside modal-content
            if (e.target.classList.contains("modal-overlay")) {
              setModalOpen(false);
            }
          }}
        >
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>
            {modalLoading ? (
              <p>Loading...</p>
            ) : modalError ? (
              <p>Error: {modalError}</p>
            ) : selectedIssue ? (
              <div>
                <h3>Issue Details</h3>

                <div className="form-group">
                  <label>Building</label>
                  <p>{selectedIssue.location?.building || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Floor</label>
                  <p>{selectedIssue.location?.floor || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Room</label>
                  <p>{selectedIssue.location?.room || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <p>{selectedIssue.category || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <p>{selectedIssue.complaintDescription || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Employee Name</label>
                  <p>{selectedIssue.employeeName || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Employee Email</label>
                  <p>{selectedIssue.employeeEmail || "-"}</p>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <p>{selectedIssue.status || "-"}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                  }}
                >
                  <button
                    className="forward-button"
                    onClick={() => {
                      alert("Forward action triggered");
                    }}
                    style={{
                      backgroundColor: "#4dd125ff",
                      borderColor: "#070807ff",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px", // space between text and icon
                      cursor: "pointer",
                    }}
                  >
                    Forward <FaArrowRight />
                  </button>
                </div>

                {/* <div className="form-group">
                  <label>Created At</label>
                  <p>{new Date(selectedIssue.createdAt).toLocaleString()}</p>
                </div>

                <div className="form-group">
                  <label>Updated At</label>
                  <p>{new Date(selectedIssue.updatedAt).toLocaleString()}</p>
                </div> */}
              </div>
            ) : (
              <p>No details available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueList;
