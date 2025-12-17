import React, { useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function AddStudent() {
  const { academyCode } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    address: "",
    emergencyContact1: "",
    fatherContact: "",
    admissionDate: "",
    practiceFor: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/${academyCode}/students/create`, form);
      alert("✅ Student registered successfully!");
      navigate(`/${academyCode}/students`);
    } catch (err) {
      alert(err.response?.data?.message || "Error registering student");
    }
  };

  return (
    <PageWrapper>
      <h2 className="student-page-title">Register New Candidate</h2>

      <div className="student-form">
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="contactNumber" placeholder="Mobile Number" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="date" name="dateOfBirth" onChange={handleChange} />
        
        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="height" type="number" placeholder="Height (cm)" onChange={handleChange} />
        <input name="weight" type="number" placeholder="Weight (kg)" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="emergencyContact1" placeholder="Emergency Contact" onChange={handleChange} />
        <input name="fatherContact" placeholder="Father Contact" onChange={handleChange} />
        <input type="date" name="admissionDate" onChange={handleChange} />

        <select name="practiceFor" onChange={handleChange}>
          <option value="">Practice For</option>
          <option>Police</option>
          <option>Army</option>
          <option>Navy</option>
          <option>Airforce</option>
          <option>Talathi</option>
          <option>Saral Seva</option>
          <option>Staff Selection</option>
        </select>

        <button className="student-action-btn" onClick={handleSubmit}>
          Register Student
        </button>
      </div>
    </PageWrapper>
  );
}
