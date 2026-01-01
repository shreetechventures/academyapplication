import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import { useParams } from "react-router-dom";
import "../styles/dashboardStats.css";

export default function Dashboard() {
  const { academyCode } = useParams();

  const [stats, setStats] = useState({
    totalStudents: 0,
    leftStudents: 0,
    totalTrainers: 0
  });

  const loadStats = async () => {
    try {
      const active = await api.get(`/dashboard/students/active`);
      const left = await api.get(`/dashboard/students/left`);
      const trainers = await api.get(`/dashboard/trainers`);

      setStats({
        totalStudents: active.data.count,
        leftStudents: left.data.count,
        totalTrainers: trainers.data.count
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <PageWrapper>
      <div className="dashboard-stats-container">

        <div className="stat-card">
          <h3>{stats.totalStudents}</h3>
          <p>Total Students</p>
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
