// frontend/src/pages/StudentAssessmentDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams } from "react-router-dom";
import AssessmentChart from "../components/AssessmentChart";

export default function StudentAssessmentDashboard() {
  const { academyCode } = useParams();

  // Student ID from login
  const studentId = localStorage.getItem("userId");

  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    loadTypes();
    loadSummary();
  }, [studentId]);

  useEffect(() => {
    if (!studentId || !selectedType) return;
    loadResults(selectedType._id);
  }, [selectedType, studentId]);

  const loadTypes = async () => {
    try {
      const res = await axios.get(`/api/${academyCode}/assessments`);
      setTypes(res.data);

      if (res.data.length > 0 && !selectedType) {
        setSelectedType(res.data[0]);
      }
    } catch (err) {
      console.error("Error loading types:", err);
    }
  };

  const loadResults = async (typeId) => {
    if (!typeId || !studentId) return;

    try {
      const res = await axios.get(
        `/api/${academyCode}/assessments/students/${studentId}/results/${typeId}`
      );

      let list = res.data || [];

      // 🔥 Sort by date DESC (latest first)
      list.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));

      // 🔥 Take ONLY the latest 10 entries
      list = list.slice(0, 10);

      // 🔥 Reverse for timeline flow (old → new)
      list.reverse();

      const formatted = list.map((r) => ({
        date: new Date(r.attemptDate).toLocaleDateString(),
        value: r.value,
        score: r.score,
      }));

      setResults(formatted);
    } catch (err) {
      console.error("Results load error:", err);
    }
  };

  const loadSummary = async () => {
    if (!studentId) return;

    try {
      const res = await axios.get(
        `/api/${academyCode}/assessments/students/${studentId}/summary`
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Summary load error:", err);
    }
  };

  return (
    <PageWrapper>
      <div style={{ padding: 18 }}>
        <h2>Your Assessments</h2>

        {/* TEST BUTTONS */}
        <div style={{ display: "flex", gap: 12, margin: "12px 0", flexWrap: "wrap" }}>
          {types.map((t) => (
            <button
              key={t._id}
              onClick={() => setSelectedType(t)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                background: selectedType?._id === t._id ? "#2563eb" : "#f2f4f7",
                color: selectedType?._id === t._id ? "#fff" : "#222",
                border: "none",
              }}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* CHART SECTION */}
        {selectedType && (
          <>
            <h3>{selectedType.title} — Progress (Latest 10)</h3>

            <AssessmentChart data={results} testTitle={selectedType.title} />

            <h4 style={{ marginTop: 18 }}>Attempts (Latest 10)</h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {results.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    background: "#fff",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <div><strong>{r.date}</strong></div>
                  <div>Value: {r.value} {selectedType.unit}</div>
                  <div>Score: {r.score}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SUMMARY CARDS */}
        <h3 style={{ marginTop: 24 }}>Summary</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 12,
          }}
        >
          {summary.map((s) => (
            <div key={s.assessmentType._id} className="card">
              <h4>{s.assessmentType.title}</h4>
              <div>Avg Score: {Math.round(s.stats.avgScore)}</div>
              <div>Best: {s.stats.bestScore}</div>
              <div>Attempts: {s.stats.attempts}</div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
