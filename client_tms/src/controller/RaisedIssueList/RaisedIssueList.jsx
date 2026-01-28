import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/config";
import "../Issuelist/Issuelist.css";

function RaisedIssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Issue detail modal
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueLoading, setIssueLoading] = useState(false);

  /* ================= FETCH RAISED ISSUES ================= */
  useEffect(() => {
    const fetchRaisedIssues = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/tickets/get-registered-complaints`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch raised complaints");

        const data = await res.json();
        setIssues(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRaisedIssues();
  }, []);

  /* ================= OPEN ISSUE MODAL ================= */
  const openIssueModal = async (issueId) => {
    try {
      setShowModal(true);
      setIssueLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/v1/tickets/get/${issueId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setSelectedIssue(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIssueLoading(false);
    }
  };

  /* ================= STATUS CLASS ================= */
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
      <h2>Raised Issues</h2>

      {/* ================= TABLE ================= */}
      <div className="table-wrapper">
        <table className="issue-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Description</th>
              <th>Registered By</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr
                  key={issue._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => openIssueModal(issue._id)}
                >
                  <td>{issue.category}</td>
                  <td>{issue.subCategory}</td>
                  <td>{issue.complaintDescription}</td>
                  <td>{issue.employeeName}</td>
                  <td className={getStatusClass(issue.status)}>
                    {issue.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ISSUE DETAIL MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button
              className="close-modal-btn"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {issueLoading ? (
              <p>Loading...</p>
            ) : selectedIssue ? (
              <>
                <h2>
                  {selectedIssue.category} / {selectedIssue.subCategory}
                </h2>

                <span
                  className={`status-badge ${getStatusClass(
                    selectedIssue.status,
                  )}`}
                >
                  {selectedIssue.status.toUpperCase()}
                </span>

                <div className="info-grid">
                  <div>
                    <strong>Section:</strong> {selectedIssue.section}
                  </div>
                  <div>
                    <strong>Department:</strong> {selectedIssue.department}
                  </div>
                  <div>
                    <strong>Train No:</strong> {selectedIssue.train_NO}
                  </div>
                  <div>
                    <strong>Employee:</strong> {selectedIssue.employeeName}
                  </div>
                  <div>
                    <strong>Assigned:</strong> {selectedIssue.assignedUser}
                  </div>
                </div>

                <div className="description-box">
                  <strong>Description</strong>
                  <p>{selectedIssue.complaintDescription}</p>
                </div>

                <h3>Action Roadmap</h3>
                <div className="timeline">
                  {selectedIssue.replies?.length ? (
                    selectedIssue.replies.map((r, i) => (
                      <div className="timeline-item" key={i}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <p className="timeline-user">
                            {r.sender} ({r.senderRole})
                          </p>
                          <p>{r.message}</p>
                          <span className="timeline-time">
                            {new Date(r.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No replies yet</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default RaisedIssueList;
