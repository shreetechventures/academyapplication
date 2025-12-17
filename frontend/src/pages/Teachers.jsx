import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css"; // SAME STYLE

export default function Teachers() {

  const { academyCode } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Load Teachers
  const loadTeachers = async () => {
    const res = await axios.get(`/${academyCode}/teachers`);
    setTeachers(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    if (role !== "academyAdmin") return; // Only admin can view
    loadTeachers();
  }, []);

  const markAsLeft = async (id) => {
    await axios.put(`/${academyCode}/teachers/${id}/leave`);
    setFiltered(prev => prev.filter(t => t._id !== id));
  };

  const handleSearch = () => {
    const result = teachers.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.contactNumber.includes(search)
    );
    setFiltered(result);
  };

  if (role !== "academyAdmin") {
    return (
      <PageWrapper>
        <h3>You do not have permission to view Teachers</h3>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>

      <div className="students-content-wrapper">

        {/* Header */}
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
              onClick={() => navigate(`/${academyCode}/teachers/add`)}
            >
              + Add Trainer
            </button>

          </div>
        </div>

        {/* Table */}
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
              {filtered.map((t) => (
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
                      onClick={() => navigate(`/${academyCode}/teachers/edit/${t._id}`)}
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
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </PageWrapper>
  );
}
