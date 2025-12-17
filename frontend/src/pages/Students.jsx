// frontend/src/pages/Students.jsx

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/student.css";

export default function Students() {
  const { academyCode } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const role = localStorage.getItem("role");

  const loadStudents = async () => {
    try {
      const res = await axios.get(`/${academyCode}/students`);
      setStudents(res.data);
      

      setFiltered(res.data);
    } catch (err) {
      console.error("Loading students failed:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [academyCode]);

  const handleSearch = () => {
    const result = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.contactNumber.includes(search)
    );
    setFiltered(result);
  };

  const markAsLeft = async (id) => {
    try {
      await axios.put(`/${academyCode}/students/${id}/leave`);
      setFiltered(prev => prev.filter(s => s._id !== id));
    } catch {
      alert("Error updating status");
    }
  };

  return (
    <PageWrapper>

<div className="students-content-wrapper page-scroll">

        {/* 🔹 Top Section */}
        <div className="student-header-row">
          <h2 className="student-page-title">Candidate List</h2>

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

            {(role === "academyAdmin" || role === "teacher") && (
              <button 
                className="add-student-btn"
                onClick={() => navigate(`/${academyCode}/students/add`)}
              >
                + Add Student
              </button>
            )}
          </div>
        </div>

        {/* 🔹 Table */}
        <div className="student-table-section">
          <table className="student-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Practice</th>
                <th>Admission Date </th>
                <th>Emergency Contant</th>
                {(role === "academyAdmin" || role === "teacher") && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No candidates found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id}>
                    {/* <td>{s._id}</td> */}
                    <td>{s.studentCode}</td>
                    <td>{s.name}</td>
                    <td>{s.contactNumber}</td>
                    <td>{s.practiceFor}</td>
                    <td>
                      {s.admissionDate
                        ? new Date(s.admissionDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{s.emergencyContact1}</td>

                    {(role === "academyAdmin" || role === "teacher") && (
                      <td>
                        <button 
                          className="student-edit-btn"
                          onClick={() => navigate(`/${academyCode}/students/edit/${s._id}`)}
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
