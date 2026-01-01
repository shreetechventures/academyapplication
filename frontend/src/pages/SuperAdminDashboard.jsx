import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/superadmin.css";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [academyCount, setAcademyCount] = useState(0);

  const logout = () => {
    localStorage.clear();
    navigate("/shreenath/login");
  };

  // 🔥 Load academy count
  useEffect(() => {
    loadAcademyCount();
  }, []);

  const loadAcademyCount = async () => {
    try {
      const res = await axios.get("/superadmin/academies/count");
      setAcademyCount(res.data.count);
    } catch (err) {
      console.error("Failed to load academy count");
    }
  };

  return (
    <div className="superadmin-container">
      
      {/* Header */}
      <div className="superadmin-header">
        <h2 className="superadmin-title">SuperAdmin Control Panel</h2>
        <button className="superadmin-logout" onClick={logout}>
          Logout
        </button>
      </div>

      {/* 📊 Stats Section */}
      <div className="superadmin-stats">
        <div className="stat-card">
          <h3>{academyCount}</h3>
          <p>Registered Academies</p>
        </div>
      </div>

      {/* Action Cards */}
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
