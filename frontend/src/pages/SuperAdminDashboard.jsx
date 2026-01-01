import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import "../styles/superadmin.css";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [academyCount, setAcademyCount] = useState(0);

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login"); // ✅ subdomain-safe
  };

  /* =========================
     LOAD ACADEMY COUNT
  ========================= */
  const loadAcademyCount = async () => {
    try {
      const res = await api.get("/superadmin/academies/count");
      setAcademyCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to load academy count", err);
    }
  };

  useEffect(() => {
    loadAcademyCount();
  }, []);

  return (
    <div className="superadmin-container">
      {/* ================= HEADER ================= */}
      <div className="superadmin-header">
        <h2 className="superadmin-title">SuperAdmin Control Panel</h2>
        <button className="superadmin-logout" onClick={logout}>
          Logout
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="superadmin-stats">
        <div className="stat-card">
          <h3>{academyCount}</h3>
          <p>Registered Academies</p>
        </div>
      </div>

      {/* ================= ACTION CARDS ================= */}
      <div className="superadmin-actions">
        <div
          className="superadmin-card"
          onClick={() => navigate("/superadmin/create-academy")}
        >
          <h3>➕ Create Academy</h3>
          <p>Add a new academy to the system</p>
        </div>

        <div
          className="superadmin-card"
          onClick={() => navigate("/superadmin/create-admin")}
        >
          <h3>➕ Create Admin</h3>
          <p>Create admin access for an academy</p>
        </div>
      </div>
    </div>
  );
}
