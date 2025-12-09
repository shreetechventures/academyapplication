import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { getAcademyCodeFromPath } from "../utils/tenant";
import "../styles/dashboard.css";

export default function DashboardLayout({ academy }) {
  const location = useLocation();
  const academyCode = getAcademyCodeFromPath(location.pathname);

  return (
    <div className="dashboard-container">
      <DashboardSidebar academyCode={academyCode} />
      <div className="main-section">
        <DashboardHeader academy={academy} />
        <div style={{ padding: 20 }}>
          <Outlet /> {/* Child page content will render here */}
        </div>
      </div>
    </div>
  );
}
