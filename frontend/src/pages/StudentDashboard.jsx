import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import "../styles/studentDashboard.css";

/* ===============================
   💰 CIRCULAR PROGRESS (SHARED)
================================ */
function FeeProgressCircle({ label, value, total, color }) {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="fee-progress">
      <svg width={radius * 2} height={radius * 2}>
        {/* Background */}
        <circle
          stroke="#eee"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="fee-progress-text">
        <strong>{percentage}%</strong>
      </div>
    </div>
  );
}

/* ===============================
   🎓 STUDENT DASHBOARD
================================ */
export default function StudentDashboard() {

  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("userId");
  const studentName = localStorage.getItem("name");

  const [feeSummary, setFeeSummary] = useState(null);
  const [lastExam, setLastExam] = useState(null);
  const [loading, setLoading] = useState(true);

  /* LOAD DATA */
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!studentId || role !== "student") return;

        const [feeRes, examRes] = await Promise.all([
          api.get(`/fees/student/${studentId}/summary`),
          api.get(
            `/assessments/students/${studentId}/last-exam`
          ),
        ]);

        setFeeSummary(feeRes.data.data);
        setLastExam(examRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [academyCode, studentId, role]);

  /* ROLE GUARD */
  if (role !== "student") {
    return <Navigate to={`/login`} replace />;
  }

  return (
    <PageWrapper>
      <div className="student-dashboard">
        <div className="student-dashboard-header">
          <h2>Welcome, {studentName}</h2>
          <p>Your fee and assessment overview</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : feeSummary ? (
          <>
            {/* ===== FEE CARDS (MATCH MY FEES) ===== */}
            <div className="student-fee-summary">

              {/* TOTAL */}
          <div className="summary-card total">
  <span>Total Fee</span>
  <strong>₹{feeSummary.totalFee}</strong>

  <div className="total-fee-percent">
    <span className="paid-text">
      {Math.round((feeSummary.paidFee / feeSummary.totalFee) * 100)}% Paid
    </span>
    <span className="divider">•</span>
    <span className="pending-text">
      {Math.round((feeSummary.pendingFee / feeSummary.totalFee) * 100)}% Pending
    </span>
  </div>
</div>


              {/* PAID */}
              <div className="summary-card paid">
                <span>Paid</span>
                <strong>₹{feeSummary.paidFee}</strong>

                <FeeProgressCircle
                  label="Paid"
                  value={feeSummary.paidFee}
                  total={feeSummary.totalFee}
                  color="#2e7d32"
                />
              </div>

              {/* PENDING */}
              <div className="summary-card pending">
                <span>Pending</span>
                <strong>₹{feeSummary.pendingFee}</strong>

                <FeeProgressCircle
                  label="Pending"
                  value={feeSummary.pendingFee}
                  total={feeSummary.totalFee}
                  color="#d32f2f"
                />
              </div>
            </div>

            {/* WARNING */}
            {feeSummary.pendingFee > 0 && (
              <div className="pending-warning">
                ⚠️ You have pending fees. Please Pay Remaining Fee.
              </div>
            )}
          </>
        ) : (
          <p>No fee data available.</p>
        )}

        {/* LAST EXAM */}
        {lastExam && (
          <div className="last-exam-card">
            <span className="label">Last Assessment</span>
            <h3>{lastExam.assessmentTitle}</h3>
            <div className="exam-value">
              {lastExam.value} {lastExam.unit}
            </div>
            <div className="exam-date">
              {new Date(lastExam.attemptDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
