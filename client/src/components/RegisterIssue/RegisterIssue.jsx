import React, { useState } from "react";
import "./RegisterIssue.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import stations from "../../../stations.json";
import Select from "react-select";

function RegisterIssue() {
  const [category, setCategory] = useState("Safety");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [section, setSection] = useState("");
  const [station, setStation] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [jagAssigned, setJagAssigned] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const options = stations.map(s => ({
  value: s.code,
  label: `${s.code} - ${s.name}`
}));

  // Example role for testing purpose (can be dynamic)
  const userRole = "control"; // can be 'user', 'control', or 'bo'

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 4 - images.length);
    const imagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setImages([...images, ...imagePreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async (e, actionType = "register") => {
    e.preventDefault();
    setLoading(true);

    // API Payload in the required format
    const payload = {
      category,
      complaintDescription,
      location: {
        section,
        station,
        locationAddress,
        landmark,
      },
      sicAssigned: "Sarah", // hidden field for testing
      jagAssigned:
        userRole === "control" || userRole === "bo" ? jagAssigned : "",
      actionType,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tickets/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message || "Complaint registered successfully");

        // Reset form only on register
        if (actionType === "register") {
          setCategory("Safety");
          setComplaintDescription("");
          setSection("");
          setStation("");
          setLocationAddress("");
          setLandmark("");
          setJagAssigned("");
          setImages([]);

          setTimeout(() => {
            navigate("/monitor/issues");
          }, 1500);
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.error("Error submitting issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-issue-container">
      <h2>Register An Issue</h2>
      <form
        className="issue-form"
        onSubmit={(e) => handleSubmit(e, "register")}
      >
        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Safety">Safety</option>
            <option value="Asset-Failure">Asset-Failure</option>
            <option value="Non-Safety">Non-Safety</option>
          </select>
        </div>

        {/* Complaint Description */}
        <div className="form-group">
          <label htmlFor="description">Complaint Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Describe the issue..."
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Location Details */}
        <div className="form-group location-group">
          <label>Location Details</label>

          <input
            type="text"
            placeholder="Section *"
            required
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />

          {/* <select
            required
            value={station}
            onChange={(e) => setStation(e.target.value)}
          >
            <option value="">Select Station *</option>
            <option value="Station A">Station A</option>
            <option value="Station B">Station B</option>
            <option value="Station C">Station C</option>
          </select> */}

          <Select options={options} placeholder="Select Station" isSearchable />

          <input
            type="text"
            placeholder="Location/Address (can be KM)"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
          />

          <input
            type="text"
            placeholder="Landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>

        {/* JAG Assigned (Only visible for control/bo role) */}
        {(userRole === "control" || userRole === "bo") && (
          <div className="form-group">
            <label htmlFor="jagAssigned">BO Assigned</label>
            <input
              type="text"
              id="jagAssigned"
              placeholder="Enter BO name"
              value={jagAssigned}
              onChange={(e) => setJagAssigned(e.target.value)}
            />
          </div>
        )}

        {/* Image Upload */}
        <div className="form-group">
          <label>Upload Images (Max 4)</label>
          <div className="image-upload-container">
            {images.map((img, index) => (
              <div className="image-slot" key={index}>
                <img src={img} alt={`upload-${index}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <div className="image-slot add-slot">
                <label htmlFor="imageUpload">+</label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span className="loader"></span> : "Submit"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default RegisterIssue;
