import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Register.css";

import {
  getMainCategories,
  getSubCategories,
  SECTIONS,
} from "../../constants/ticketMessage";

import "./Register.css";

const API_URL = "http://localhost:5000";

function Register() {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [section, setSection] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [train_NO, setTrainNumber] = useState("");

  const [subCategoryList, setSubCategoryList] = useState([]);

  // Load subcategories when category changes
  useEffect(() => {
    if (category) {
      setSubCategoryList(getSubCategories(category));
      setSubCategory("");
    } else {
      setSubCategoryList([]);
    }
  }, [category]);

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

    // API Payload in the required format
    const payload = {
      category,
      subCategory,
      section,
      train_NO,
      complaintDescription,
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/tickets/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("🚀 Response Data:", data);

      if (data.status) {
        toast.success(data.message || "Complaint registered successfully");
        // Reset all fields after success
        setCategory("");
        setSubCategory("");
        setSection("");
        setComplaintDescription("");
        setTrainNumber("");
        setSubCategoryList([]);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.error("Error submitting issue. Please try again.");
    }
  };

  return (
    <>
      <div className="register-container">
        <h2>Register Complaint</h2>

        <form onSubmit={handleSubmit}>
          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
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

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default Register;
