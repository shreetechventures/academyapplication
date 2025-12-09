// frontend/src/components/MultiTestAssessmentForm.jsx
import React, { useState } from "react";
import axios from "../api/axios";

export default function MultiTestAssessmentForm({
  academyCode,
  selectedStudent,
  onAfterSave, // callback to refresh results/charts
}) {
  const [testDate, setTestDate] = useState("");
  const [hundredMeterTime, setHundredMeterTime] = useState("");
  const [sixteenHundredMeterTime, setSixteenHundredMeterTime] = useState("");
  const [pushUps, setPushUps] = useState("");
  const [sitUps, setSitUps] = useState("");
  const [pullUps, setPullUps] = useState("");
  const [longJump, setLongJump] = useState("");
  const [highJump, setHighJump] = useState("");
  const [golaFek, setGolaFek] = useState("");
  const [writtenScore, setWrittenScore] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = !selectedStudent;

  const commonPayload = (sendWhatsApp) => ({
    studentId: selectedStudent?._id,
    testDate,
    hundredMeterTime,
    sixteenHundredMeterTime,
    pushUps: pushUps || null,
    sitUps: sitUps || null,
    pullUps: pullUps || null,
    longJump: longJump || null,
    highJump: highJump || null,
    golaFek: golaFek || null,
    writtenScore: writtenScore || null,
    sendWhatsApp,
  });

  const handleSubmit = async (sendWhatsApp) => {
    if (!selectedStudent) {
      alert("Please select a student first.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `/api/${academyCode}/assessments/multi`,
        commonPayload(sendWhatsApp)
      );

      if (onAfterSave) onAfterSave();

      if (sendWhatsApp) {
        alert("Saved and WhatsApp sent (if configured).");
      } else {
        alert("Results saved successfully.");
      }

      // reset values but keep date
      setHundredMeterTime("");
      setSixteenHundredMeterTime("");
      setPushUps("");
      setSitUps("");
      setPullUps("");
      setLongJump("");
      setHighJump("");
      setGolaFek("");
      setWrittenScore("");

    } catch (err) {
      console.error("Multi-test save error:", err);
      alert("Error saving multi-test assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multi-test-card">
      <h4>Multi-Test Assessment</h4>

      {!selectedStudent && (
        <p className="info-text">Select a student to start entering results.</p>
      )}

      <div className="multi-test-grid">
        <div className="field">
          <label>Test Date</label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>100 Meter (time)</label>
          <input
            type="text"
            placeholder="e.g. 12.5 sec"
            value={hundredMeterTime}
            onChange={(e) => setHundredMeterTime(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>1600 Meter (time)</label>
          <input
            type="text"
            placeholder="e.g. 6 min 20 sec"
            value={sixteenHundredMeterTime}
            onChange={(e) => setSixteenHundredMeterTime(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Push-Ups (count)</label>
          <input
            type="number"
            value={pushUps}
            onChange={(e) => setPushUps(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Sit-Ups (count)</label>
          <input
            type="number"
            value={sitUps}
            onChange={(e) => setSitUps(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Pull-Ups (count)</label>
          <input
            type="number"
            value={pullUps}
            onChange={(e) => setPullUps(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Long Jump (meters)</label>
          <input
            type="number"
            step="0.01"
            value={longJump}
            onChange={(e) => setLongJump(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>High Jump (meters)</label>
          <input
            type="number"
            step="0.01"
            value={highJump}
            onChange={(e) => setHighJump(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Gola Fek / Shot Put (meters)</label>
          <input
            type="number"
            step="0.01"
            value={golaFek}
            onChange={(e) => setGolaFek(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Written Exam Score</label>
          <input
            type="number"
            value={writtenScore}
            onChange={(e) => setWrittenScore(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="multi-test-actions">
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={disabled || loading}
        >
          💾 Save Only
        </button>

        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={disabled || loading}
        >
          💾📲 Save & Send WhatsApp
        </button>
      </div>
    </div>
  );
}
