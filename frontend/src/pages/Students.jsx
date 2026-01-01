// frontend/src/pages/Students.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function Students() {
  const { academyCode, type } = useParams();
  const navigate = useNavigate();

  const mode = type === "left" ? "left" : "active";
  const role = localStorage.getItem("role");

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [counts, setCounts] = useState({
    active: 0,
    left: 0,
  });

  /* =======================
     LOAD COUNTS (BADGES)
  ======================= */
  const loadCounts = async () => {
    try {
      const activeRes = await api.get(
        `/dashboard/students/active`
      );
      const leftRes = await api.get(
        `/dashboard/students/left`
      );

      setCounts({
        active: activeRes.data.count,
        left: leftRes.data.count,
      });
    } catch (err) {
      console.error("Count loading failed", err);
    }
  };

  /* =======================
     LOAD STUDENTS
  ======================= */
  const loadStudents = async () => {
    try {
      const url =
        mode === "left"
          ? `/students/left/all`
          : `/students`;

      const res = await api.get(url);
      setStudents(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Student loading failed", err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadCounts();
  }, [academyCode, mode]);

  /* =======================
     SEARCH
  ======================= */
  const handleSearch = () => {
    const result = students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.contactNumber.includes(search)
    );
    setFiltered(result);
  };

  /* =======================
     MARK AS LEFT
  ======================= */
  const markAsLeft = async (id) => {
    try {
      await api.put(`/students/${id}/leave`);
      loadStudents();
      loadCounts();
    } catch {
      alert("Error updating student status");
    }
  };

  return (
    <PageWrapper>
      <div className="students-content-wrapper page-scroll">

        {/* ===== HEADER + TABS ===== */}
        <div className="student-header-row">
          <h2 className="student-page-title">Students</h2>

          <div className="student-tabs">
            <button
              className={`tab-btn ${mode === "active" ? "active" : ""}`}
              onClick={() => navigate(`/students`)}
            >
              Active
              <span className="badge">{counts.active}</span>
            </button>

            <button
              className={`tab-btn ${mode === "left" ? "active" : ""}`}
              onClick={() => navigate(`/students/left`)}
            >
              Left
              <span className="badge warning">{counts.left}</span>
            </button>
          </div>
        </div>

        {/* ===== SEARCH + ADD ===== */}
        <div className="student-search-container">
          <input
            type="text"
            placeholder="Search by Name / Code / Mobile"
            className="student-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="student-search-btn" onClick={handleSearch}>
            Search
          </button>

          {mode === "active" &&
            (role === "academyAdmin" || role === "teacher") && (
              <button
                className="add-student-btn"
                onClick={() =>
                  navigate(`/students/add`)
                }
              >
                + Add Student
              </button>
            )}
        </div>

        {/* ===== TABLE ===== */}
        <div className="student-table-section">
          <table className="student-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Practice</th>

                {mode === "active" && <th>Admission Date</th>}
                {mode === "active" && <th>Emergency Contact</th>}
                {mode === "active" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentCode}</td>
                    <td>{s.name}</td>
                    <td>{s.contactNumber}</td>
                    <td>{s.practiceFor}</td>

                    {mode === "active" && (
                      <>
                        <td>
                          {s.admissionDate
                            ? new Date(s.admissionDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>{s.emergencyContact1}</td>
                        <td>
                          <button
                            className="student-edit-btn"
                            onClick={() =>
                              navigate(
                                `/students/edit/${s._id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="student-leave-btn"
                            onClick={() => markAsLeft(s._id)}
                          >
                            Left
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
