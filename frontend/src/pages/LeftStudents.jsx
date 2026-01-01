import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";


export default function LeftStudents() {
  const { academyCode } = useParams();
  const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
      const navigate = useNavigate();

    //   const role = localStorage.getItem("role");

  const handleSearch = () => {
    const result = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.contactNumber.includes(search)
    );
    setFiltered(result);
  };
useEffect(() => {
  api.get(`/students/left/all`)
    .then(res => {
      setStudents(res.data);
      setFiltered(res.data);   // ← ADD THIS
    });
}, []);


  return (

<PageWrapper>

      <div className="students-content-wrapper">

        {/* 🔹 Top Section */}
        <div className="student-header-row">
          <h2 className="student-page-title">Left Student </h2>

          <div className="student-search-container">
            <button
              className="add-student-btn"
              onClick={() => navigate(`/students`)}
            >
              Back to Active students
            </button>
          </div>


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
          </tr>
        </thead>
<tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan="4" style={{ textAlign: "center" }}>
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
