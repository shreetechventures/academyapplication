import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import "../styles/studentDashboard.css";

export default function StudentDashboard() {
  const { academyCode } = useParams();

  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("userId");
  const studentName = localStorage.getItem("name");

  const [feeSummary, setFeeSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastExam, setLastExam] = useState(null);

  /* ✅ HOOKS FIRST — ALWAYS */
  useEffect(() => {
    const loadFeeSummary = async () => {
      if (role !== "student" || !studentId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(
          `/${academyCode}/fees/student/${studentId}/summary`
        );
        setFeeSummary(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const loadLastExam = async () => {
      try {
        const res = await api.get(
          `/${academyCode}/assessments/students/${studentId}/last-exam`
        );
        setLastExam(res.data);
      } catch (err) {
        console.error("Last exam load error:", err);
      }
    };
    loadLastExam();

    loadFeeSummary();
  }, [academyCode, studentId, role]);

  /* ✅ ROLE GUARD AFTER HOOKS */
  if (role !== "student") {
    return <Navigate to={`/${academyCode}/login`} replace />;
  }

  return (
    <PageWrapper>
      <div className="student-dashboard">
        <h2>Welcome, {studentName}</h2>

        {loading ? (
          <p>Loading...</p>
        ) : feeSummary ? (
          <div className="student-fee-summary">
            <div className="summary-card">
              <span>Total</span>
              <strong>₹{feeSummary.totalFee}</strong>
            </div>

            <div className="summary-card paid">
              <span>Paid</span>
              <strong>₹{feeSummary.paidFee}</strong>
            </div>

            <div className="summary-card pending">
              <span>Pending</span>
              <strong>₹{feeSummary.pendingFee}</strong>
            </div>
          </div>
        ) : (
          <p>No fee data</p>
        )}

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
