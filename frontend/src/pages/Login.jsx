// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getAcademyCodeFromPath } from "../utils/tenant";
import RoleSwitcher from "../components/RoleSwitcher";
import AcademyHeader from "../components/AcademyHeader";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const academyCode = getAcademyCodeFromPath(location.pathname);
  // console.log("ACADEMY:", academyCode);


  const [academy, setAcademy] = useState(null);
  const [role, setRole] = useState("academyAdmin");
  const [identifier, setIdentifier] = useState("");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchAcademy() {
      try {
        if (academyCode) {
          const res = await axios.get(`/api/academy/${academyCode}`);
setAcademy(res.data);


          // const res = await axios.get(`/api/${academyCode}/academy`);
          // const res = await axios.get(`/api/${academyCode}`);



          setAcademy(res.data);
        }
      } catch (err) {
        console.error("Academy load error:", err);
      }
    }
    fetchAcademy();
  }, [academyCode]);

  const validateInput = () => {
    if (!identifier.trim() || !secret.trim()) {
      setErr("All fields are required");
      return false;
    }
    if (role === "student") {
      const emailFormat = identifier.includes("@");
      const mobileFormat = /^[0-9]{10}$/.test(identifier);
      if (!emailFormat && !mobileFormat) {
        setErr("Enter a valid email or 10-digit mobile number.");
        return false;
      }
    } else {
      if (!identifier.includes("@")) {
        setErr("User must login using email only.");
        return false;
      }
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      setErr("");
      if (!validateInput()) return;

      let endpoint = "";
      let payload = {};

      if (role === "student") {
        endpoint = `/api/${academyCode}/students/login`;
        payload = { email: identifier, password: secret };
      } else {
        endpoint = `/api/${academyCode}/auth/login`;
        payload = { email: identifier, password: secret };
      }

      const res = await axios.post(endpoint, payload);

      // Save token and basic data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("academyCode", academyCode);

      // store userId if present (student or other)
      const userId = res.data.userId || res.data.id || res.data._id || null;
      if (userId) localStorage.setItem("userId", userId.toString());

      // navigate to dashboard
      navigate(`/${academyCode}/dashboard`);
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <AcademyHeader academy={academy} />
        <div className="role-switcher-center">
          <RoleSwitcher role={role} setRole={setRole} />
        </div>

        <div className="login-field">
          <label>{role === "student" ? "Email" : "Email"}</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "student" ? "Student email" : "User email"}
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {err && <div className="error-text">{err}</div>}

        <div className="login-buttons">
          <button onClick={handleLogin} className="login-btn primary">Login</button>
          <button className="login-btn secondary" onClick={() => { setIdentifier(""); setSecret(""); setErr(""); }}>
            Cancel
          </button>
        </div>

        <div className="login-footer">Secure Shreenath Academy Login System</div>
      </div>
    </div>
  );
}
