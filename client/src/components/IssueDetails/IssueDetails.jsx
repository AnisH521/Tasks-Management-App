import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowRight, FaEdit } from "react-icons/fa";
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

  // Forward modal state
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [jagEmail, setJagEmail] = useState("");
  const [forwardLoading, setForwardLoading] = useState(false);

  // Update status modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

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

      toast.success("Status updated successfully");
      navigate("/monitor/issues"); // ✅ redirect after success
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForwardLoading(false);
    }
  };

  // Update status submit
  const handleUpdateSubmit = async () => {
    if (!message || !status) {
      toast.error("Please fill in all fields");
      return;
    }
    setUpdateLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/tickets/update/${issueId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message, status }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update ticket");

      toast.success("Status updated successfully");
      navigate("/monitor/issues"); // ✅ redirect after success
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!issue) return <p>No issue found.</p>;

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
        <strong>JAG Assigned:</strong> {issue.jagAssigned || "-"}
      </div>
      <div>
        <strong>JAG Email:</strong> {issue.jagEmail || "-"}
      </div>

      <div className="buttons-container">
        <button
          className="update-button"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          Update Status <FaEdit style={{ marginLeft: "5px" }} />
        </button>
        <button
          className="forward-button"
          onClick={() => setIsForwardModalOpen(true)}
        >
          Forward <FaArrowRight style={{ marginLeft: "5px" }} />
        </button>
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
              JAG Email:
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

      {/* Update Status Modal */}
      {isUpdateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Status</h3>
            <label>
              Message:
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <label>
              Status:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">-- Select Status --</option>
                <option value="open">Open</option>
                <option value="forwarded">Forwarded</option>
                <option value="rejected">Rejected</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleUpdateSubmit} disabled={updateLoading}>
                {updateLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueDetails;
