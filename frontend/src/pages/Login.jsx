// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import AcademyHeader from "../components/AcademyHeader";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     🔐 LOGIN HANDLER (SUPERADMIN + ACADEMY USERS)
  ===================================================== */
  const handleLogin = async () => {
    setErr("");

    if (!identifier.trim() || !secret.trim()) {
      setErr("Email and password are required");
      return;
    }

    // 🚫 BLOCK www usage
    const host = window.location.hostname;
    if (host.startsWith("www.")) {
      window.location.replace(
        window.location.protocol +
          "//" +
          host.replace("www.", "") +
          window.location.pathname
      );
      return;
    }

    try {
      setLoading(true);

      const isSuperAdmin = identifier === "superadmin@careeracademy.com";

      const res = await api.post(
        isSuperAdmin ? "/auth/superadmin/login" : "/auth/login",
        {
          email: identifier.trim(),
          password: secret,
        }
      );

      const { token, role, name, userId, academyCode } = res.data;

      // 🔐 STORE SESSION
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("userId", userId);

      if (academyCode) {
        localStorage.setItem("academyCode", academyCode);
      } else {
        localStorage.removeItem("academyCode");
      }

      // 🚦 ROLE BASED REDIRECT
      if (role === "superadmin") {
        navigate("/superadmin");
      } else if (role === "academyAdmin") {
        navigate("/dashboard/admin");
      } else if (role === "teacher") {
        navigate("/dashboard/teacher");
      } else if (role === "student") {
        navigate("/dashboard/student");
      } else {
        setErr("Unknown role");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <AcademyHeader academy={null} />

        <div className="login-field">
          <label>Email</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        {err && <div className="error-text">{err}</div>}

        <div className="login-buttons">
          <button
            onClick={handleLogin}
            className="login-btn primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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

        <div className="login-footer">Secure Academy Login System</div>
      </div>
    </div>
  );
}
