// frontend/src/pages/TeacherDashboard.jsx

import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import "../styles/dashboardStats.css";

export default function TeacherDashboard() {
  const { academyCode } = useParams();
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    activeStudents: 0,
    leftStudents: 0,
    totalTrainers: 0,
  });

  /* =======================
     LOAD DASHBOARD STATS
  ======================= */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const activeRes = await api.get(
          `/dashboard/students/active`
        );
        const leftRes = await api.get(
          `/dashboard/students/left`
        );
        const trainersRes = await api.get(
          `/dashboard/trainers`
        );

        setStats({
          activeStudents: activeRes.data.count,
          leftStudents: leftRes.data.count,
          totalTrainers: trainersRes.data.count,
        });
      } catch (err) {
        console.error("Teacher dashboard load error:", err);
      }
    };

    loadStats();
  }, [academyCode]);

  /* =======================
     ROLE GUARD
  ======================= */
  if (role !== "teacher") {
    return <Navigate to={`/login`} replace />;
  }

  return (
    <PageWrapper>
      <div className="dashboard-stats-container">

        <div className="stat-card">
          <h3>{stats.activeStudents}</h3>
          <p>Active Students</p>
        </div>

        <div className="stat-card warning">
          <h3>{stats.leftStudents}</h3>
          <p>Left Students</p>
        </div>

        <div className="stat-card success">
          <h3>{stats.totalTrainers}</h3>
          <p>Total Trainers</p>
        </div>

      </div>
    </PageWrapper>
  );
}
