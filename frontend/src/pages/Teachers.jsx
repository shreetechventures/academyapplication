import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import "../styles/student.css"; // SAME STYLE

export default function Teachers() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  /* =======================
     LOAD TEACHERS
  ======================= */
  const loadTeachers = async () => {
    try {
      const res = await api.get(`/teachers`);
      setTeachers(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to load teachers", err);
    }
  };

  useEffect(() => {
    if (role !== "academyAdmin") return; // Only admin allowed
    loadTeachers();
  }, [role]);

  /* =======================
     MARK AS LEFT
  ======================= */
  const markAsLeft = async (id) => {
    try {
      await api.put(`/teachers/${id}/leave`);
      setFiltered((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Error updating trainer status");
    }
  };

  /* =======================
     SEARCH
  ======================= */
  const handleSearch = () => {
    const result = teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.contactNumber.includes(search)
    );
    setFiltered(result);
  };

  /* =======================
     ROLE GUARD
  ======================= */
  if (role !== "teacher") {
    return (
      <PageWrapper>
        <h3>You do not have permission to view Trainers</h3>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="students-content-wrapper">

        {/* HEADER */}
        <div className="student-header-row">
          <h2 className="student-page-title">Trainer List</h2>

          <div className="student-search-container">
            <input
              type="text"
              placeholder="Search Trainer"
              className="student-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="student-search-btn" onClick={handleSearch}>
              Search
            </button>

            <button
              className="add-student-btn"
              onClick={() => navigate(`/teachers/add`)}
            >
              + Add Trainer
            </button>

            <button
              className="add-student-btn"
              onClick={() => navigate(`/teachers/left`)}
            >
              Left Trainer
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="student-table-section">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No trainers found
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>{t.contactNumber}</td>
                    <td>{t.email}</td>
                    <td>{t.experience} yrs</td>
                    <td>{t.status}</td>
                    <td>{t.designation}</td>
                    <td>
                      <button
                        className="student-edit-btn"
                        onClick={() => navigate(`/teachers/edit/${t._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="student-leave-btn"
                        onClick={() => markAsLeft(t._id)}
                      >
                        Left
                      </button>
                    </td>
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
