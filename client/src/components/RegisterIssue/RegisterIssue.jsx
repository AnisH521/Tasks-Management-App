import React, { useState } from "react";
import "./RegisterIssue.css";
import { toast } from "react-toastify";

function RegisterIssue() {
  const [category, setCategory] = useState("Safety");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [jagAssigned, setJagAssigned] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 4 - images.length); // limit to max 4
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
      jagAssigned,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/tickets/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status) {
        toast.success(
          `Success: ${data.message}\nTicket ID: ${data.data.ticketId}`
        );
        console.log("Registered Ticket ID:", data.data.ticketId);

        // Clear form
        setCategory("Safety");
        setComplaintDescription("");
        setBuilding("");
        setFloor("");
        setRoom("");
        setJagAssigned("");
        setImages([]);
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
              name="building"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
            <input
              type="text"
              placeholder="Floor"
              name="floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room"
              name="room"
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
            name="complaintDescription"
            rows="4"
            placeholder="Describe the issue..."
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
          ></textarea>
        </div>

        {/* JAG Assigned */}
        <div className="form-group">
          <label htmlFor="jagAssigned">JAG Assigned</label>
          <input
            type="text"
            id="jagAssigned"
            name="jagAssigned"
            value={jagAssigned}
            onChange={(e) => setJagAssigned(e.target.value)}
          />
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

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default RegisterIssue;
