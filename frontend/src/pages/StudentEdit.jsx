// frontend/src/pages/StudentEdit.jsx

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function EditStudent() {
  const { academyCode, id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  /* ===========================
     LOAD STUDENT
  ============================ */
  const loadStudent = async () => {
    try {
      const res = await axios.get(
        `/api/${academyCode}/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setForm(res.data);
    } catch (err) {
      console.error("Error loading student:", err);
      alert("Failed to load student details");
    }
  };

  useEffect(() => {
    loadStudent();
  }, []);

  /* ===========================
     HANDLE INPUT
  ============================ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===========================
     UPDATE STUDENT
  ============================ */
  const updateStudent = async () => {
    try {
      await axios.put(
        `/api/${academyCode}/students/${id}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Student Updated Successfully!");
      navigate(`/${academyCode}/students`);

    } catch (err) {
      console.error(err);
      alert("Error updating student");
    }
  };

  if (!form) return <PageWrapper>Loading...</PageWrapper>;

  return (
    <PageWrapper>
      <div className="students-content-wrapper">

        {/* HEADER */}
        <div className="student-header-row">
          <h2 className="student-page-title">Edit Candidate</h2>
        </div>

        {/* FORM */}
        <div className="register-container">
          <div className="register-form">

            {/* Student Code */}
            <div className="form-row">
              <label>Candidate Code</label>
              <input
                name="studentCode"
                value={form.studentCode || ""}
                readOnly
              />
            </div>

            {/* Name */}
            <div className="form-row">
              <label>Name</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
              />
            </div>

            {/* Contact */}
            <div className="form-row">
              <label>Contact Number</label>
              <input
                name="contactNumber"
                value={form.contactNumber || ""}
                onChange={handleChange}
              />
            </div>

            {/* Emergency */}
            <div className="form-row">
              <label>Emergency Contact</label>
              <input
                name="emergencyContact1"
                value={form.emergencyContact1 || ""}
                onChange={handleChange}
              />
            </div>

            {/* Practice For */}
            <div className="form-row">
              <label>Practice For</label>
              <select
                name="practiceFor"
                value={form.practiceFor || ""}
                onChange={handleChange}
              >
                <option value="Army">Army</option>
                <option value="Police">Police</option>
                <option value="Navy">Navy</option>
                <option value="Airforce">Airforce</option>
                <option value="Talathi">Talathi</option>
                <option value="Saral Seva">Saral Seva</option>
                <option value="Staff Selection">Staff Selection</option>
              </select>
            </div>

            {/* Admission Date */}
            <div className="form-row">
              <label>Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={form.admissionDate?.substring(0, 10) || ""}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="form-row full">
              <label>Address</label>
              <input
                name="address"
                value={form.address || ""}
                onChange={handleChange}
              />
            </div>

            {/* Weight */}
            <div className="form-row">
              <label>Weight</label>
              <input
                name="weight"
                value={form.weight || ""}
                onChange={handleChange}
              />
            </div>

            {/* Height */}
            <div className="form-row">
              <label>Height</label>
              <input
                name="height"
                value={form.height || ""}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="form-row">
              <label>Email</label>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
              />
            </div>




            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button className="student-search-btn" onClick={updateStudent}>
                Save Changes
              </button>

              <button
                className="add-student-btn"
                onClick={() => navigate(`/${academyCode}/students`)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
