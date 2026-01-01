import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function TeacherEdit() {
  const { academyCode, id } = useParams();
  const navigate = useNavigate();
  // const { academyCode } = useParams();

  const [form, setForm] = useState({});
  const [age, setAge] = useState("");

  /* ===========================
     LOAD TEACHER DATA
  ============================ */
  const loadTeacher = async () => {
    try {
      const res = await api.get(`/teachers/${id}`);
      setForm(res.data);

      // calculate age initially
      if (res.data.dateOfBirth) {
        const dob = new Date(res.data.dateOfBirth);
        const diff = Date.now() - dob.getTime();
        setAge(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
      }

    } catch (err) {
      console.error(err);
      alert("Error loading teacher details");
    }
  };

  useEffect(() => {
    loadTeacher();
  }, []);

  /* ===========================
      AGE AUTO UPDATE
  ============================ */
  useEffect(() => {
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const diff = Date.now() - dob.getTime();
      setAge(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
    }
  }, [form.dateOfBirth]);


  /* ===========================
      HANDLE INPUT
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


  /* ===========================
      UPDATE TEACHER
  ============================ */
  const updateTeacher = async () => {
    try {
      const updated = {
        ...form,
        age: age,
      };

      await axios.put(`/teachers/${id}`, updated);

      alert("Teacher Updated Successfully!");
      navigate(`/teachers`);

    } catch (err) {
      console.error(err);
      alert("Error updating teacher");
    }
  };


  return (
    <PageWrapper>
      <div className="students-content-wrapper">

        {/* HEADER */}
        <div className="student-header-row">
          <h2 className="student-page-title">Edit Teacher</h2>
        </div>

        {/* FORM */}
        <div className="register-container">
          <div className="register-form">

            {/* Name */}
            <div className="form-row">
              <label>Name</label>
              <input
                name="name"
                value={form.name || ""}
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

            {/* DOB */}
            <div className="form-row">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth?.substring(0, 10) || ""}
                onChange={handleChange}
              />
            </div>

            {/* Age */}
            <div className="form-row">
              <label>Age</label>
              <input value={age} readOnly />
            </div>

            {/* Height */}
            <div className="form-row">
              <label>Height (cm)</label>
              <input
                name="height"
                value={form.height || ""}
                onChange={handleChange}
              />
            </div>

            {/* Weight */}
            <div className="form-row">
              <label>Weight (kg)</label>
              <input
                name="weight"
                value={form.weight || ""}
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

            {/* Emergency 1 */}
            <div className="form-row">
              <label>Emergency Contact 1</label>
              <input
                name="emergencyContact1"
                value={form.emergencyContact1 || ""}
                onChange={handleChange}
              />
            </div>


            {/* Father Contact */}
            <div className="form-row">
              <label>Father's Contact Number</label>
              <input
                name="fatherContact"
                value={form.fatherContact || ""}
                onChange={handleChange}
              />
            </div>

            {/* Joining Date */}
            <div className="form-row">
              <label>Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate?.substring(0, 10) || ""}
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

            {/* Experience */}
            <div className="form-row">
              <label>Experience (years)</label>
              <input
                name="experience"
                value={form.experience || ""}
                onChange={handleChange}
              />
            </div>

                        {/*Designation*/}
            <div className="form-row">
                <label>Designation</label>
                <input
                    name="designation"
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <button className="student-search-btn" onClick={updateTeacher}>
                Save Changes
              </button>

              <button
                className="add-student-btn"
                onClick={() => navigate(`/teachers`)}
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
