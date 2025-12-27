import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { getAcademyCodeFromPath } from "../utils/tenant";
import SubscriptionWarning from "../components/SubscriptionWarning"; // ✅ ADD
import "../styles/dashboard.css";

export default function DashboardLayout({ academy }) {
  const location = useLocation();
  const academyCode = getAcademyCodeFromPath(location.pathname);

  return (
    <div className="dashboard-container">
      <DashboardSidebar academyCode={academyCode} />

      <div className="main-section">
        <DashboardHeader academy={academy} />

        {/* 🔔 Subscription warning (global, non-blocking) */}
        <SubscriptionWarning />

        <div style={{ padding: 20 }}>
          <Outlet /> {/* Child page content will render here */}
        </div>
      </div>
    </div>
  );
}
