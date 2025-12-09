// PageWrapper.jsx
import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { getAcademyCodeFromPath } from "../utils/tenant";
import axios from "../api/axios";
import "../styles/dashboard.css";

export default function PageWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const academyCode = getAcademyCodeFromPath(location.pathname);
  const [academy, setAcademy] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`/api/academy/${academyCode}`);
        setAcademy(res.data);
      } catch (err) {
        console.error("Academy load error:", err);
      }
    }
    load();
  }, [academyCode]);

  const logout = () => {
    localStorage.clear();
    navigate(`/${academyCode}/login`);
  };

  return (
    <>
      {/* Hamburger */}
      <div className="hamburger" onClick={() => setSidebarOpen(true)}>
        ☰
      </div>

      <div className="dashboard-container">
        <DashboardSidebar
          academyCode={academyCode}
          open={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        <div className="main-section">
          <DashboardHeader academy={academy} onLogout={logout} />

          <div className="dashboard-content">{children}</div>
        </div>
      </div>
    </>
  );
}
