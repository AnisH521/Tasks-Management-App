import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/config";
import "./Issuelist.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Issuelist() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Issue detail modal
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueLoading, setIssueLoading] = useState(false);

  // Forward modal
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardTicketId, setForwardTicketId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [forwardLoading, setForwardLoading] = useState(false);
  const [forwardError, setForwardError] = useState("");

  /* ================= FETCH ISSUE LIST ================= */
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/tickets/get-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sortBy: "date" }),
        });

        if (!res.ok) throw new Error("Failed to fetch issues");

        const data = await res.json();
        setIssues(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
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

  /* ================= FORWARD HANDLER ================= */
  const handleForward = async () => {
    if (!targetUserId) {
      setForwardError("Target User ID is required");
      return;
    }

    try {
      setForwardLoading(true);
      setForwardError("");

      const res = await fetch(`${API_BASE_URL}/api/v1/tickets/forward`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ticketId: forwardTicketId,
          targetUserId,
        }),
      });

      const data = await res.json();

      if (!data.status) {
        setForwardError(data.message);
        return;
      }

      toast.success(data.message || "Ticket forwarded successfully");

      // update status in table
      setIssues((prev) =>
        prev.map((i) =>
          i._id === forwardTicketId ? { ...i, status: "forwarded" } : i,
        ),
      );

      setShowForwardModal(false);
      setTargetUserId("");
    } catch {
      setForwardError("Something went wrong");
    } finally {
      setForwardLoading(false);
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
      <h2>All Issue List</h2>

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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue._id}
                style={{ cursor: "pointer" }}
                onClick={() => openIssueModal(issue._id)}
              >
                <td>{issue.category}</td>
                <td>{issue.subCategory}</td>
                <td>{issue.complaintDescription}</td>
                <td>{issue.employeeName}</td>
                <td className={getStatusClass(issue.status)}>{issue.status}</td>

                <td>
                  <button
                    className="forward-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForwardTicketId(issue._id);
                      setShowForwardModal(true);
                    }}
                    disabled={issue.status === "forwarded"} // <-- disable if forwarded
                    style={{
                      cursor:
                        issue.status === "forwarded"
                          ? "not-allowed"
                          : "pointer",
                      opacity: issue.status === "forwarded" ? 0.6 : 1,
                    }}
                  >
                    {issue.status === "forwarded" ? "Forwarded" : "Forward"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ISSUE DETAIL MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowModal(false)}>
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

      {/* ================= FORWARD MODAL ================= */}
      {showForwardModal && (
        <div className="modal-overlay">
          <div className="modal-card small">
            <h3>Forward Ticket</h3>

            <div className="form-group">
              <label>Ticket ID</label>
              <input value={forwardTicketId} disabled />
            </div>

            <div className="form-group">
              <label>Target User ID</label>
              <input
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="Enter Target User ID"
              />
            </div>

            {forwardError && <p className="error-text">{forwardError}</p>}

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowForwardModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={handleForward}
                disabled={forwardLoading}
              >
                {forwardLoading ? "Forwarding..." : "Forward"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Issuelist;
