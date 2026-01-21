import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./Register.css";
import { API_BASE_URL } from "../../config/config";

import {
  getMainCategories,
  getSubCategories,
  SECTIONS,
} from "../../constants/ticketMessage";

function Register() {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [section, setSection] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [train_NO, setTrainNumber] = useState("");

  const [subCategoryList, setSubCategoryList] = useState([]);

  // 🔹 Image state
  const [images, setImages] = useState([]);

  // 🔹 Ref for file input
  const fileInputRef = useRef(null);

  // Load subcategories when category changes
  useEffect(() => {
    if (category) {
      setSubCategoryList(getSubCategories(category));
      setSubCategory("");
    } else {
      setSubCategoryList([]);
    }
  }, [category]);

  // 🔹 Image upload handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 4 - images.length);
    const imagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setImages([...images, ...imagePreviews]);
    e.target.value = null; // Reset input
  };

  // 🔹 Remove image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // 🔹 Trigger file input when clicking an image slot
  const handleSlotClick = () => {
    if (images.length < 4 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !category ||
      !subCategory ||
      !section ||
      !complaintDescription ||
      !train_NO
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      category,
      subCategory,
      section,
      train_NO,
      complaintDescription,
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

        // Reset form
        setCategory("");
        setSubCategory("");
        setSection("");
        setComplaintDescription("");
        setTrainNumber("");
        setSubCategoryList([]);
        setImages([]);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error submitting issue. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register Complaint</h2>

      <form onSubmit={handleSubmit}>
        {/* CATEGORY */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {getMainCategories().map((cat) => (
            <option key={cat.code} value={cat.code}>
              {cat.code} - {cat.description}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          disabled={!category}
        >
          <option value="">Select Sub Category</option>
          {subCategoryList.map((sub) => (
            <option key={sub.code} value={sub.code}>
              {sub.code} - {sub.description}
            </option>
          ))}
        </select>

        {/* SECTION */}
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Select Section</option>
          {SECTIONS.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        {/* TRAIN NO */}
        <textarea
          placeholder="Train No"
          value={train_NO}
          onChange={(e) => setTrainNumber(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Complaint Description"
          value={complaintDescription}
          onChange={(e) => setComplaintDescription(e.target.value)}
        />

        {/* 🔹 IMAGE UPLOAD */}
        <div className="form-group">
          <label>Upload Images (Max 4)</label>

          <div className="image-upload-container">
            {images.map((img, index) => (
              <div className="image-slot" key={index} onClick={handleSlotClick}>
                <img src={img} alt={`upload-${index}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering file input
                    removeImage(index);
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <div className="image-slot add-slot" onClick={handleSlotClick}>
                <label>+</label>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;
