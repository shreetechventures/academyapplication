import React, { useState } from "react";
import "../styles/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function DashboardHeader({ academy, onLogout }) {
  const [open, setOpen] = useState(false);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard-header">
      <h2 className="dashboard-header-title">
        {academy?.name || "Academy Dashboard"}
      </h2>

      <div className="profile-box" onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
        {/* <span className="caret">▼</span> */}

        {open && (
          <div className="profile-dropdown">
            <div className="dropdown-item">
              <strong>Name:</strong> {name}
            </div>

            <div className="dropdown-item">
              <strong>Role:</strong> {role}
            </div>

            <div className="dropdown-item">
              <strong>Academy:</strong> {academy?.code}
            </div>

            <hr />

            <div className="dropdown-item logout-red" onClick={onLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
