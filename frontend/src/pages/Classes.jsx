// frontend/src/pages/Classes.jsx
import React from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";

import { useParams } from "react-router-dom";
import "../styles/dashboard.css";

export default function Students() {

  return (

    <div className="dashboard-container">
      <DashboardSidebar academyCode={academyCode} />

      <div className="main-section">
         <DashboardHeader />
        <div className="dashboard-content">
          <h2>class Management</h2>
          <p>Here you see all your lectures.</p>
        </div>
               
      </div>

      
    </div>
  );
}


