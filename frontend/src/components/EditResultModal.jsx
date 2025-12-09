// frontend/src/components/EditResultModal.jsx
import React, { useEffect, useState } from "react";
import "../styles/teacherAssessment.css";

export default function EditResultModal({ open, dayResults, onClose, onSave }) {
  const [localResults, setLocalResults] = useState([]);
  const [dayDate, setDayDate] = useState("");

  useEffect(() => {
    if (open && Array.isArray(dayResults) && dayResults.length > 0) {
      // clone results into local editable copy
      const cloned = dayResults.map((r) => {
        const dt = r.attemptDate ? new Date(r.attemptDate) : new Date();
        const isoLocal = new Date(
          dt.getTime() - dt.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16); // yyyy-MM-ddTHH:mm

        return {
          ...r,
          value: r.value ?? "",
          note: r.note ?? "",
          attemptDateLocal: isoLocal,
        };
      });

      setLocalResults(cloned);

      // use first result's date as day date
      setDayDate(cloned[0].attemptDateLocal);
    } else {
      setLocalResults([]);
      setDayDate("");
    }
  }, [open, dayResults]);

  if (!open) return null;

  const handleValueChange = (id, newValue) => {
    setLocalResults((prev) =>
      prev.map((r) =>
        r._id === id
          ? {
              ...r,
              value: newValue,
            }
          : r
      )
    );
  };

  const handleNoteChange = (id, newNote) => {
    setLocalResults((prev) =>
      prev.map((r) =>
        r._id === id
          ? {
              ...r,
              note: newNote,
            }
          : r
      )
    );
  };

  const handleSave = () => {
    if (!localResults.length) return;

    // one ISO date for whole day
    const attemptIso = dayDate
      ? new Date(dayDate).toISOString()
      : new Date().toISOString();

    const payload = localResults.map((r) => ({
      _id: r._id,
      value: r.value,
      note: r.note || "",
      attemptDate: attemptIso,
    }));

    onSave(payload);
  };

  const displayDate =
    localResults[0]?.attemptDateLocal?.slice(0, 10) || "Selected Day";

  return (
    <div className="modal-overlay">
      <div className="modal-card wide">
        <h3>Edit Results — {displayDate}</h3>

        <label style={{ marginTop: "8px" }}>Test Date & Time</label>
        <input
          type="datetime-local"
          value={dayDate}
          onChange={(e) => setDayDate(e.target.value)}
        />

        <div className="day-edit-table-wrapper">
          <table className="day-edit-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Value</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {localResults.map((r) => (
                <tr key={r._id}>
                  <td>{r.assessmentTypeId?.title || "-"}</td>
                  <td>
                    <input
                      type="text"
                      value={r.value}
                      onChange={(e) =>
                        handleValueChange(r._id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={r.note || ""}
                      onChange={(e) => handleNoteChange(r._id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button className="btn btn-muted" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save All
          </button>
        </div>
      </div>
    </div>
  );
}
