import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import "../styles/dashboardStats.css";

export default function AdminDashboard() {
  const { academyCode } = useParams();
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    totalStudents: 0,
    leftStudents: 0,
    totalTrainers: 0,
  });

  const [plan, setPlan] = useState(null);

  /* =======================
     LOAD DASHBOARD DATA
  ======================= */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const active = await axios.get(
          `/${academyCode}/dashboard/students/active`
        );
        const left = await axios.get(
          `/${academyCode}/dashboard/students/left`
        );
        const trainers = await axios.get(
          `/${academyCode}/dashboard/trainers`
        );

        setStats({
          totalStudents: active.data.count,
          leftStudents: left.data.count,
          totalTrainers: trainers.data.count,
        });

        // 🔐 ADMIN ONLY
        if (role === "academyAdmin") {
          const planRes = await axios.get(
            `/${academyCode}/dashboard/subscription-info`
          );
          setPlan(planRes.data);
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
      }
    };

    loadStats();
  }, [academyCode, role]);

  /* =======================
     ROLE GUARD (AFTER HOOKS)
  ======================= */
  if (role !== "academyAdmin") {
    return <Navigate to={`/${academyCode}/login`} replace />;
  }

  return (
    <PageWrapper>
      <div className="dashboard-stats-container">
        {/* ===== BASIC STATS ===== */}
        <div className="stat-card">
          <h3>{stats.totalStudents}</h3>
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

        {/* ===== SUBSCRIPTION PLAN ===== */}
        {plan && (
          <div className="stat-card plan">
            <h3>
              {plan.remaining} / {plan.maxStudents}
            </h3>
            <p>Remaining Student Slots</p>

            {/* PROGRESS BAR */}
            <div className="plan-bar">
              <div
                className="plan-bar-fill"
                style={{
                  width: `${plan.usagePercent}%`,
                  background:
                    plan.usagePercent >= 90 ? "#ef4444" : "#22c55e",
                }}
              />
            </div>

            <small>
              {plan.usagePercent}% used · Expires on{" "}
              {new Date(plan.expiryDate).toLocaleDateString()}
            </small>

            {plan.showWarning && (
              <div className="plan-warning">
                ⚠️ You are close to your student limit. Consider upgrading.
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
