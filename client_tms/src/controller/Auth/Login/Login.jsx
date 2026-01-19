import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // import for redirection
import "./Login.css";

const base_url = "localhost";
const port = "5000";
const API = `http://${base_url}:${port}/api/v1/users`;

function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Login state
  const [loginUserID, setLoginUserID] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [scale, setScale] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate(); // hook for navigation

  // ----- FLIP HANDLER -----
  const handleFlip = (flip) => {
    setIsFlipped(flip);
    setError(""); // clear error on flip
  };

  // ----- LOGIN HANDLER -----
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
        { withCredentials: true } // IMPORTANT
      );

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success(`Welcome ${res.data.name || res.data.userID}`);
      navigate("/dashboard");

      // Clear login inputs
      setLoginUserID("");
      setLoginPassword("");

      // Redirect to Dashboard
      navigate("/dashboard"); // Make sure this route exists
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  // ----- REGISTER HANDLER -----
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let isSrScaleFlag = false;
      let isJrScaleFlag = false;
      let isSrDMEFlag = false;

      // Normalize role for backend
      let normalizedRole = "";
      if (role === "Officer / BO") normalizedRole = "Officer";
      else if (role === "Supervisor/End User") normalizedRole = "Supervisor";
      else if (role === "Controller") normalizedRole = "Controller";

      // Only Officer / BO can have scale options
      if (normalizedRole === "Officer") {
        isSrScaleFlag = scale === "Sr Scale";
        isJrScaleFlag = scale === "Jr Scale";
        isSrDMEFlag = scale === "Sr DME";
      }

      const res = await axios.post(`${API}/register`, {
        name,
        department,
        password,
        role: normalizedRole,
        isSrScale: isSrScaleFlag,
        isJrScale: isJrScaleFlag,
        isSrDME: isSrDMEFlag,
      });

      toast.info(`User Registered! ID: ${res.data.user.userID}`, {
        position: "top-right",
        autoClose: false, // stay until user closes
        closeOnClick: true,
        draggable: true,
      });

      // Reset register form
      setName("");
      setDepartment("");
      setPassword("");
      setRole("");
      setScale("");
      handleFlip(false); // back to login
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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
              type="text"
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
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
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

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setScale("");
              }}
            >
              <option value="">Select Role</option>
              <option>Officer / BO</option>
              <option>Supervisor/End User</option>
              <option>Controller</option>
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
                  />{" "}
                  Sr Scale
                </label>

                <label className="checkbox">
                  <input
                    type="radio"
                    name="scale"
                    value="Jr Scale"
                    checked={scale === "Jr Scale"}
                    onChange={(e) => setScale(e.target.value)}
                  />{" "}
                  Jr Scale
                </label>

                <label className="checkbox">
                  <input
                    type="radio"
                    name="scale"
                    value="Sr DME"
                    checked={scale === "Sr DME"}
                    onChange={(e) => setScale(e.target.value)}
                  />{" "}
                  Sr DME
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
