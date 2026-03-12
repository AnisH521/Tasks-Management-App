import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/config";
import "./Issuelist.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Issuelist() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueLoading, setIssueLoading] = useState(false);

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardTicketId, setForwardTicketId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [forwardLoading, setForwardLoading] = useState(false);
  const [forwardError, setForwardError] = useState("");

  const [forwardUsers, setForwardUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTicketId, setReplyTicketId] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [closeLoading, setCloseLoading] = useState(false);

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

  /* ================= FETCH FORWARDABLE USERS ================= */
  const fetchForwardUsers = async (ticketId) => {
    try {
      setUsersLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/v1/users/getForwardableUsers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ticketId }),
        },
      );

      const data = await res.json();
      // console.log("Forwardable Users:", data);
      setForwardUsers(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

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
      setForwardError("Target User is required");
      return;
    }

    try {
      setForwardLoading(true);
      setForwardError("");

      // console.log("Ticket ID:", forwardTicketId);
      // console.log("Target User ID:", targetUserId);

      const res = await fetch(`${API_BASE_URL}/api/v1/tickets/forward`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ticketId: forwardTicketId,
          targetUserId: targetUserId,
        })
      });

      const data = await res.json();

      if (!data.status) {
        setForwardError(data.message);
        return;
      }

      toast.success(data.message || "Ticket forwarded successfully");

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

  /* ================= REPLY HANDLER ================= */
  const handleReply = async () => {
    if (!replyMessage) {
      setReplyError("Reply message is required");
      return;
    }

    try {
      setReplyLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/v1/tickets/add-remarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ticketId: replyTicketId,
          message: replyMessage,
        }),
      });

      const data = await res.json();

      if (!data.status) {
        setReplyError(data.message);
        return;
      }

      toast.success("Reply added successfully");
      setShowReplyModal(false);
      setReplyMessage("");
    } catch {
      setReplyError("Something went wrong");
    } finally {
      setReplyLoading(false);
    }
  };

  /* ================= CLOSE HANDLER ================= */
  const handleCloseTicket = async (ticketId) => {
    try {
      setCloseLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/v1/tickets/update/${ticketId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "closed" }),
        },
      );

      const data = await res.json();

      if (!data.status) return;

      toast.success("Ticket closed successfully");

      setIssues((prev) =>
        prev.map((i) => (i._id === ticketId ? { ...i, status: "closed" } : i)),
      );
    } finally {
      setCloseLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "status-open";
      case "closed":
        return "status-closed";
      case "forwarded":
        return "status-forwarded";
      default:
        return "";
    }
  };
   
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="issue-container">
      <ToastContainer />
      <h2>All Issue List</h2>

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
            {issues.map((issue) => {
              const isClosed = issue.status?.toLowerCase() === "closed";
              const isForwarded = issue.status?.toLowerCase() === "forwarded";

              return (
                <tr
                  key={issue._id}
                  onClick={() => openIssueModal(issue._id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{issue.category}</td>
                  <td>{issue.subCategory}</td>
                  <td>{issue.complaintDescription}</td>
                  <td>{issue.employeeName}</td>
                  <td className={getStatusClass(issue.status)}>
                    {issue.status}
                  </td>

                  <td>
                    {/* Forward */}
                    <button
                      className="forward-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForwardTicketId(issue._id);
                        setShowForwardModal(true);
                        fetchForwardUsers(issue._id);
                      }}
                      disabled={isClosed || isForwarded}
                      style={{
                        cursor:
                          isClosed || isForwarded ? "not-allowed" : "pointer",
                        opacity: isClosed || isForwarded ? 0.6 : 1,
                      }}
                    >
                      {isClosed
                        ? "Closed"
                        : isForwarded
                          ? "Forwarded"
                          : "Forward"}
                    </button>

                    {/* Reply */}
                    <button
                      className="reply-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyTicketId(issue._id);
                        setShowReplyModal(true);
                      }}
                      disabled={isClosed}
                      style={{
                        cursor: isClosed ? "not-allowed" : "pointer",
                        opacity: isClosed ? 0.6 : 1,
                      }}
                    >
                      Reply
                    </button>

                    {/* Close */}
                    <button
                      className="close-ticket-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTicket(issue._id);
                      }}
                      disabled={isClosed || closeLoading}
                      style={{
                        cursor: isClosed ? "not-allowed" : "pointer",
                        opacity: isClosed ? 0.6 : 1,
                      }}
                    >
                      {isClosed ? "Closed" : "Close"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
              <label>Select User</label>

              {usersLoading ? (
                <p>Loading users...</p>
              ) : (
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                >
                  <option value="">Select User</option>
                  {forwardUsers.map((user) => (
                    <option key={user._id} value={user.userID}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              )}
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
