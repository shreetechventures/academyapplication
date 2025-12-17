import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../styles/adminAssignFee.css";

export default function AdminAssignFee() {
  const { academyCode } = useParams();

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [totalFee, setTotalFee] = useState("");

  const [assignedFee, setAssignedFee] = useState(null); // 👈 NEW: store assigned fee

  useEffect(() => {
    loadStudents();
  }, [academyCode]);

  const loadStudents = async () => {
    try {
      const res = await axios.get(`/${academyCode}/students`);
      setStudents(res.data.data || res.data);
    } catch (err) {
      console.error("Load students error:", err);
    }
  };

  // ---------------------------------------
  // Load assigned fee when student changes
  // ---------------------------------------
  useEffect(() => {
    if (!studentId) return;
    fetchAssignedFee(studentId);
  }, [studentId]);

  const fetchAssignedFee = async (sid) => {
    try {
      const res = await axios.get(`/${academyCode}/fees/student/${sid}`);

      if (res.data?.data) {
        setAssignedFee(res.data.data); // student already has fee
      } else {
        setAssignedFee(null);
      }
    } catch (err) {
      setAssignedFee(null); // 404 should mean "not assigned"
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/${academyCode}/fees/assign`, {
        studentId,
        totalFee: Number(totalFee),
      });

      alert("Fee assigned successfully!");
      setTotalFee("");
      fetchAssignedFee(studentId); // reload assigned fee
    } catch (err) {
      console.error("Assign error:", err);
      alert(err?.response?.data?.message || "Assign failed");
    }
  };

  return (
    <PageWrapper>
      <div className="assign-fee-container">
        <h2 className="assign-title">Assign Fee to Student</h2>

        {/* --- Select Student --- */}
        <div className="form-group">
          <label>Student</label>
          <select
            className="input-field"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — {s.className}
              </option>
            ))}
          </select>
        </div>

        {/* ---------------------------
            SHOW ASSIGNED FEE (If exists)
        ---------------------------- */}
        {assignedFee && (
          <div className="assigned-box">
            <h3>Fee Already Assigned</h3>

            <p><strong>Total Fee:</strong> ₹{assignedFee.totalFee}</p>
            <p><strong>Paid:</strong> ₹{assignedFee.paidFee}</p>
            <p><strong>Pending:</strong> ₹{assignedFee.pendingFee}</p>

            <div className="assigned-note">
              Fee already assigned to this student.
            </div>
          </div>
        )}

        {/* ---------------------------
            SHOW ASSIGN FORM ONLY IF NO FEE EXISTS
        ---------------------------- */}
        {!assignedFee && studentId && (
          <form onSubmit={handleAssign} className="assign-form">
            <div className="form-group">
              <label>Total Fee</label>
              <input
                className="input-field"
                type="number"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                required
              />
            </div>

            <button className="assign-btn" type="submit">
              Assign Fee
            </button>
          </form>
        )}
      </div>
    </PageWrapper>
  );
}
