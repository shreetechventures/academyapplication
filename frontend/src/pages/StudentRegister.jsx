// frontend/src/pages/StudentRegister.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function StudentRegister() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [academySettings, setAcademySettings] = useState(null);

  const [form, setForm] = useState({
    studentCode: "",
    practiceFor: [],
  });

  const [age, setAge] = useState("");

  /* =======================
     LOAD PERMISSIONS
  ======================== */
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const res = await api.get("/settings/permissions");
        setAcademySettings(res.data);
      } catch (err) {
        console.error("Failed to load permissions");
      }
    };

    loadPermissions();
  }, []);

  /* =======================
     GENERATE STUDENT CODE
     (subdomain based)
  ======================== */
  useEffect(() => {
    const academyCode = localStorage.getItem("academyCode");
    if (!academyCode) return;

    const random = Math.floor(1000 + Math.random() * 9000);
    const prefix = academyCode.toUpperCase();

    setForm((prev) => ({
      ...prev,
      studentCode: `${prefix}-${random}`,
    }));
  }, []);

  /* =======================
     AUTO AGE CALCULATION
  ======================== */
  useEffect(() => {
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const diff = Date.now() - dob.getTime();
      const calculatedAge = Math.floor(
        diff / (1000 * 60 * 60 * 24 * 365.25)
      );
      setAge(calculatedAge);
    }
  }, [form.dateOfBirth]);

  /* =======================
     INPUT HANDLER
  ======================== */
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === "practiceFor") {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setForm({ ...form, practiceFor: selectedValues });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* =======================
     SUBMIT FORM
  ======================== */
  const submit = async () => {
    // 🔐 Permission check (ONLY HERE)
    if (
      role === "teacher" &&
      academySettings &&
      !academySettings.allowTrainerStudentRegistration
    ) {
      alert("❌ You are not allowed to register students");
      return;
    }

    if (!form.name || !form.contactNumber || !form.practiceFor.length) {
      alert("Please fill all required fields");
      return;
    }

    if (!form.password || !form.confirmPassword) {
      alert("Password & Confirm Password are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    try {
      const finalData = {
        ...form,
        age,
      };

      console.log("➡️ CALLING API: /students/create", finalData);

      await api.post("/students/create", finalData);

      alert("✅ Student Registered Successfully!");
      navigate("/students");
    } catch (err) {
      console.error("BACKEND ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Error while registering student");
    }
  };

  return (
    <PageWrapper>
      <div className="students-content-wrapper">
        <div className="student-header-row">
          <h2 className="student-page-title">Register New Candidate</h2>
        </div>

        <div className="register-container">
          <div className="register-form">
            <div className="form-row">
              <label>Student Code</label>
              <input value={form.studentCode} readOnly />
            </div>

            <div className="form-row">
              <label>Full Name</label>
              <input name="name" onChange={handleChange} />
            </div>

            <div className="form-row full">
              <label>Address</label>
              <input name="address" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Gender</label>
              <select name="gender" onChange={handleChange}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-row">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Age</label>
              <input value={age} readOnly />
            </div>

            <div className="form-row">
              <label>Height (cm)</label>
              <input name="height" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Weight (kg)</label>
              <input name="weight" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Contact Number</label>
              <input name="contactNumber" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Emergency Contact</label>
              <input name="emergencyContact1" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Father's Contact</label>
              <input name="fatherContact" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Admission Date</label>
              <input type="date" name="admissionDate" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input name="email" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>

            <div className="form-row full">
              <label>Practice For (Multiple)</label>
              <select
                name="practiceFor"
                multiple
                value={form.practiceFor}
                onChange={handleChange}
              >
                <option value="Police">Police</option>
                <option value="Army">Army</option>
                <option value="Navy">Navy</option>
                <option value="Airforce">Airforce</option>
                <option value="Talathi">Talathi</option>
                <option value="Saral Seva">Saral Seva</option>
                <option value="Staff Selection">Staff Selection</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="student-search-btn" onClick={submit}>
                Register Candidate
              </button>

              <button
                className="add-student-btn"
                onClick={() => navigate("/students")}
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
