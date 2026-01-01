import React from "react";
import PageWrapper from "../components/PageWrapper"; // ✅ MISSING IMPORT
import "../styles/dashboard.css";

export default function Classes() {
  return (
    <PageWrapper>
      <div className="dashboard-content">
        <h2>Class Management</h2>
        <p>Here you see all your lectures.</p>
      </div>
    </PageWrapper>
  );
}
