import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { API_BASE_URL } from "../../../config/config";

const API = `${API_BASE_URL}/api/v1/users`;

function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  // -------- LOGIN STATE --------
  const [loginUserID, setLoginUserID] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // -------- REGISTER STATE --------
  const [name, setName] = useState("");
  const [phoneNO, setPhoneNO] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [scale, setScale] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  // -------- FLIP HANDLER --------
  const handleFlip = (flip) => {
    setIsFlipped(flip);
    setError("");
  };

  // -------- LOGIN HANDLER --------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API}/login`,
        {
          userID: loginUserID,
          password: loginPassword,
        },
        { withCredentials: true },
      );

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success(`Welcome ${res.data.name || res.data.userID}`);
      navigate("/dashboard");

      setLoginUserID("");
      setLoginPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  // -------- REGISTER HANDLER --------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let isSrScaleFlag = false;
      let isJrScaleFlag = false;

      let normalizedRole = role;

      if (role === "Officer / BO") normalizedRole = "Officer";
      else if (role === "Supervisor/End User") normalizedRole = "Supervisor";
      else if (role === "Controller") normalizedRole = "Controller";

      if (normalizedRole === "Officer") {
        isSrScaleFlag = scale === "Sr Scale";
        isJrScaleFlag = scale === "Jr Scale";
      }

      const res = await axios.post(`${API}/register`, {
        name,
        phoneNO,
        department,
        password,
        role: normalizedRole,
        isSrScale: isSrScaleFlag,
        isJrScale: isJrScaleFlag,
      });

      toast.info(`User Registered! ID: ${res.data.user.userID}`, {
        autoClose: false,
      });

      // Reset form
      setName("");
      setPhoneNO("");
      setDepartment("");
      setPassword("");
      setRole("");
      setScale("");

      handleFlip(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  // -------- DEPARTMENT CHANGE HANDLER --------
  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setDepartment(selectedDept);

    if (selectedDept === "Administration") {
      setRole("Admin");
      setScale("");
    } else {
      setRole("");
      setScale("");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-inner">
          {/* ---------- LOGIN ---------- */}
          <div className="flip-card-front login wrap">
            <div className="h1">Login</div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
              placeholder="User ID"
              value={loginUserID}
              onChange={(e) => setLoginUserID(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button className="btn" onClick={handleLogin}>
              Login
            </button>

            <p>
              Are you a new user?{" "}
              <span onClick={() => handleFlip(true)}>Register</span>
            </p>
          </div>

          {/* ---------- REGISTER ---------- */}
          <div className="flip-card-back login wrap">
            <div className="h1">Register</div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Phone Number"
              type="tel"
              maxLength={10}
              value={phoneNO}
              onChange={(e) => setPhoneNO(e.target.value.replace(/\D/g, ""))}
            />

            <select value={department} onChange={handleDepartmentChange}>
              <option value="">Select Department</option>
              <option>Administration</option>
              <option>Operating</option>
              <option>Commercial</option>
              <option>Engineering</option>
              <option>Mechanical (C & W)</option>
              <option>Mechanical (D & DM)</option>
              <option>EnHM</option>
              <option>Electrical/TRS</option>
              <option>Electrical /TRD</option>
              <option>Electrical/OP</option>
              <option>Electrical /Genl</option>
              <option>Signal and Telecom</option>
              <option>Medical</option>
              <option>Personnel</option>
              <option>Accounts</option>
              <option>Railway Protection Force</option>
              <option>Store</option>
              <option>RAJBHASHA</option>
            </select>

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* ROLE DROPDOWN (Admin hidden) */}
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setScale("");
              }}
              disabled={department === "Administration"}
            >
              <option value="">
                {department === "Administration"
                  ? "Admin (Auto Selected)"
                  : "Select Role"}
              </option>

              {department !== "Administration" && (
                <>
                  <option>Officer / BO</option>
                  <option>Supervisor/End User</option>
                  <option>Controller</option>
                </>
              )}
            </select>

            {role === "Officer / BO" && (
              <div className="scale-options">
                <label className="checkbox">
                  <input
                    type="radio"
                    name="scale"
                    value="Sr Scale"
                    checked={scale === "Sr Scale"}
                    onChange={(e) => setScale(e.target.value)}
                  />
                  Sr Scale
                </label>

                <label className="checkbox">
                  <input
                    type="radio"
                    name="scale"
                    value="Jr Scale"
                    checked={scale === "Jr Scale"}
                    onChange={(e) => setScale(e.target.value)}
                  />
                  Jr Scale
                </label>
              </div>
            )}

            <button className="btn" onClick={handleRegister}>
              Register
            </button>

            <p>
              Already registered?{" "}
              <span onClick={() => handleFlip(false)}>Back to Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
