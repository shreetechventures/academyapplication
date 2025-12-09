import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function LeftTeachers() {
  const { academyCode } = useParams();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);

  // Load Left Teachers
  const loadTeachers = async () => {
    try {
      const res = await axios.get(`/api/${academyCode}/teachers/left/all`);
      setTeachers(res.data);
    } catch (err) {
      console.error("Error loading teachers:", err);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Restore Teacher
  const restoreTeacher = async (id) => {
    try {
      await axios.put(`/api/${academyCode}/teachers/${id}/restore`);
      alert("Teacher restored to Active!");
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Error restoring teacher");
    }
  };

  return (
    <PageWrapper>
      <div className="students-content-wrapper">

        <div className="student-header-row">
          <h2 className="student-page-title">Left Trainers</h2>

          <div className="student-search-container">
            <button
              className="add-student-btn"
              onClick={() => navigate(`/${academyCode}/teachers`)}
            >
              Back to Active Trainers
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="student-table-section">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
                <th>Designation</th>
                <th>Experience</th>

                {/* <th style={{ textAlign: "center" }}>Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No Left Trainers Found
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t._id}>
                    <td data-label="">{t.name}</td>
                    <td data-label="">{t.contactNumber}</td>
                    <td data-label="">{t.email}</td>
                    <td data-label="">Left</td>
                    <td data-label="">{t.designation}</td>

                    <td data-label="">{t.experience}</td>
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
