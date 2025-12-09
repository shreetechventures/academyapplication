// frontend/src/components/PerformanceSummary.jsx
import React from "react";
import "../styles/teacherAssessment.css";

export default function PerformanceSummary({ metrics, chartData }) {
  if (!metrics) return null;

  return (
    <div className="performance-summary">
      <div className="ps-item">
        <div className="ps-label">Avg Score</div>
        <div className="ps-value">{metrics.avg}</div>
      </div>

      <div className="ps-item">
        <div className="ps-label">Best</div>
        <div className="ps-value">{metrics.best}</div>
      </div>

      <div className="ps-item">
        <div className="ps-label">Attempts</div>
        <div className="ps-value">{metrics.attempts}</div>
      </div>

    </div>
  );
}
