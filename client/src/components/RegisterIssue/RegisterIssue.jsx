import React, { useState } from "react";
import "./RegisterIssue.css";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

function RegisterIssue() {
  const [category, setCategory] = useState("Safety");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      category,
      complaintDescription,
      location: {
        building,
        floor,
        room,
      },
      jagAssigned: "", // blank
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tickets/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status) {
        toast.success("Registered successfully.");

        // Reset form
        setCategory("Safety");
        setComplaintDescription("");
        setBuilding("");
        setFloor("");
        setRoom("");
        setImages([]);

        // redirect
        setTimeout(() => {
          navigate("/monitor/issues");
        }, 1500);
      } else {
        toast.error(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error registering issue:", error);
      toast.error("Error registering issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-issue-container">
      <h2>Register An Issue</h2>
      <form className="issue-form" onSubmit={handleSubmit}>
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

          {/* Location */}
          <div className="form-group location-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Building"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
            <input
              type="text"
              placeholder="Floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
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

        {/* Submit Button with Loader */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="loader"></span> // loader spinner
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {/* Add ToastContainer here */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default RegisterIssue;
