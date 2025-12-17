import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/superadmin.css";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/shreenath/login");
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
