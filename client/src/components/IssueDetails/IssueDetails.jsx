import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowRight, FaReply, FaExchangeAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./IssueDetails.css";
import { API_BASE_URL } from "../../config";

function IssueDetails() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Add this to get logged-in user
  const [user, setUser] = useState(null);

  // Forward modal state
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [jagEmail, setJagEmail] = useState("");
  const [forwardLoading, setForwardLoading] = useState(false);

  // Close modal state
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  // ✅ Load user info
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/tickets/get/${issueId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch details");
        const data = await res.json();
        setIssue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [issueId]);

  // Forward submit
  const handleForwardSubmit = async () => {
    if (!department || !jagEmail) {
      toast.error("Please fill in all fields");
      return;
    }
    setForwardLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/tickets/forward/${issueId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ department, JAGEmail: jagEmail }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to forward ticket");

      toast.success("Ticket forwarded successfully");
      navigate("/monitor/issues");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForwardLoading(false);
    }
  };

  // Temporary handlers
  const handleReply = () => toast.info("Reply clicked (feature coming soon)");
  const handleTransfer = () =>
    toast.info("Transfer clicked (feature coming soon)");
  const handleClose = () => toast.info("Close clicked (feature coming soon)");

  const handleCloseConfirm = async () => {
    setCloseLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/tickets/close/${issueId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close ticket");

      toast.success("Ticket closed successfully");
      navigate("/monitor/issues");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCloseLoading(false);
      setIsCloseModalOpen(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!issue) return <p>No issue found.</p>;

  // ✅ Check if user is supervisor
  const isSupervisor = user?.department?.toLowerCase() === "supervisor";

  return (
    <div className="issue-details-container">
      <ToastContainer />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Issue Details</h2>

      <div>
        <strong>Building:</strong> {issue.location?.building || "-"}
      </div>
      <div>
        <strong>Floor:</strong> {issue.location?.floor || "-"}
      </div>
      <div>
        <strong>Room:</strong> {issue.location?.room || "-"}
      </div>
      <div>
        <strong>Category:</strong> {issue.category || "-"}
      </div>
      <div>
        <strong>Description:</strong> {issue.complaintDescription || "-"}
      </div>
      <div>
        <strong>Employee Name:</strong> {issue.employeeName || "-"}
      </div>
      <div>
        <strong>Employee Email:</strong> {issue.employeeEmail || "-"}
      </div>
      <div>
        <strong>Status:</strong> {issue.status || "-"}
      </div>
      <div>
        <strong>BO Assigned:</strong> {issue.jagAssigned || "-"}
      </div>
      <div>
        <strong>BO Email:</strong> {issue.jagEmail || "-"}
      </div>

      {/* ✅ Conditional Action Buttons */}
      <div className="buttons-container">
        {isSupervisor ? (
          // Only reply button if supervisor
          <button className="reply-button" onClick={handleReply}>
            Reply <FaReply style={{ marginLeft: "5px" }} />
          </button>
        ) : (
          // Otherwise show all buttons
          <>
            <button className="reply-button" onClick={handleReply}>
              Reply <FaReply style={{ marginLeft: "5px" }} />
            </button>
            <button
              className="forward-button"
              onClick={() => setIsForwardModalOpen(true)}
            >
              Forward <FaArrowRight style={{ marginLeft: "5px" }} />
            </button>
            <button className="transfer-button" onClick={handleTransfer}>
              Transfer <FaExchangeAlt style={{ marginLeft: "5px" }} />
            </button>
            <button className="close" onClick={handleClose}>
              Close Ticket
            </button>
          </>
        )}
      </div>

      {/* Forward Modal */}
      {isForwardModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Forward Ticket</h3>
            <label>
              Department:
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </label>
            <label>
              BO Email:
              <input
                type="email"
                value={jagEmail}
                onChange={(e) => setJagEmail(e.target.value)}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={() => setIsForwardModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleForwardSubmit} disabled={forwardLoading}>
                {forwardLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Ticket Modal */}
      {isCloseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Close Ticket</h3>
            <p>Are you sure you want to close this ticket?</p>
            <div className="modal-buttons">
              <button onClick={() => setIsCloseModalOpen(false)}>Cancel</button>
              <button onClick={handleCloseConfirm} disabled={closeLoading}>
                {closeLoading ? "Closing..." : "Yes, Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueDetails;
