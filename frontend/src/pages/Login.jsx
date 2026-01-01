// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getAcademyCodeFromPath } from "../utils/tenant";
// import RoleSwitcher from "../components/RoleSwitcher";
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
          const res = await axios.get(`/${academyCode}`);
          // const res = await axios.get(`${academyCode}`);

          setAcademy(res.data);

          // const res = await axios.get(`/api/${academyCode}/academy`);
          // const res = await axios.get(`/api/${academyCode}`);
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
    return true;
  };

  const handleLogin = async () => {
    try {
      setErr("");
      if (!validateInput()) return;

      const academyCode = getAcademyCodeFromPath(location.pathname);
      const email = identifier;
      const password = secret;

      // ================= ADMIN =================
      try {
        const res = await axios.post(`/${academyCode}/auth/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("academyCode", academyCode);
        localStorage.setItem("userId", res.data.userId);

        if (res.data.role === "superadmin") {
          return navigate("/superadmin");
        }

        return navigate(`/${academyCode}/dashboard`);
      } catch {}

      // ================= TEACHER =================
      try {
        const res = await axios.post(`/${academyCode}/teachers/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "teacher");
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("academyCode", academyCode);
        localStorage.setItem("userId", res.data.userId);

        return navigate(`/${academyCode}/dashboard/teacher`);
      } catch {}

      // ================= STUDENT =================
      try {
        const res = await axios.post(`/${academyCode}/students/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "student");
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("academyCode", academyCode);
        localStorage.setItem("userId", res.data.userId);

        return navigate(`/${academyCode}/dashboard/student`);
      } catch {}

      setErr("Invalid email or password");
    } catch {
      setErr("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <AcademyHeader academy={academy} />
        {/* <div className="role-switcher-center">
          <RoleSwitcher role={role} setRole={setRole} />
        </div> */}

        <div className="login-field">
          {/* <label>{role === "student" ? "Email" : "Email"}</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "student" ? "Student email" : "User email"}
          /> */}

          <label>Email</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email"
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
          <button onClick={handleLogin} className="login-btn primary">
            Login
          </button>
          <button
            className="login-btn secondary"
            onClick={() => {
              setIdentifier("");
              setSecret("");
              setErr("");
            }}
          >
            Cancel
          </button>
        </div>

        <div className="login-footer">
          Secure Shreenath Academy Login System
        </div>
      </div>
    </div>
  );
}
