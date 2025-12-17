import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function TeacherRegister() {

  const { academyCode } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [age, setAge] = useState("");

  /* ==========================
       AUTO AGE CALCULATION
  =========================== */
  useEffect(() => {
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const diff = Date.now() - dob.getTime();
      const calculatedAge = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      setAge(calculatedAge);
    }
  }, [form.dateOfBirth]);

  /* ==========================
       INPUT HANDLER
  =========================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const finalData = {
        ...form,
        age: age
      };

      await axios.post(`/${academyCode}/teachers/create`, finalData);

      alert("Trainer Registered Successfully!");
      navigate(`/${academyCode}/teachers`);

    } catch (err) {
      console.error(err);
      alert("Error registering trainer");
    }
  };

  return (
    <PageWrapper>
      <div className="students-content-wrapper">

        <h2 className="student-page-title">Register Trainer</h2>

        <div className="register-container">
          <div className="register-form">

            {/* Name */}
            <div className="form-row">
              <label>Full Name</label>
              <input name="name" onChange={handleChange} />
            </div>

            {/* Address */}
            <div className="form-row full">
              <label>Address</label>
              <input name="address" onChange={handleChange} />
            </div>

            {/* Height */}
            <div className="form-row">
              <label>Height (cm)</label>
              <input name="height" onChange={handleChange} />
            </div>

            {/* Weight */}
            <div className="form-row">
              <label>Weight (kg)</label>
              <input name="weight" onChange={handleChange} />
            </div>

            {/* Contact */}
            <div className="form-row">
              <label>Contact Number</label>
              <input name="contactNumber" onChange={handleChange} />
            </div>

            {/* DOB */}
            <div className="form-row">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" onChange={handleChange} />
            </div>

            {/* Age */}
            <div className="form-row">
              <label>Age</label>
              <input value={age} readOnly />
            </div>

            {/* Emergency Contact */}
            <div className="form-row">
              <label>Emergency Contact</label>
              <input name="emergencyContact1" onChange={handleChange} />
            </div>
{/* 
            <div className="form-row">
              <label>Emergency Contact 2</label>
              <input name="emergencyContact2" onChange={handleChange} />
            </div> */}

            {/* Father Contact */}
            <div className="form-row">
              <label>Father Contact</label>
              <input name="fatherContact" onChange={handleChange} />
            </div>

            {/* Joining Date */}
            <div className="form-row">
              <label>Joining Date</label>
              <input type="date" name="joiningDate" onChange={handleChange} />
            </div>

            {/* Email */}
            <div className="form-row">
              <label>Email</label>
              <input name="email" onChange={handleChange} />
            </div>

            {/* Experience */}
            <div className="form-row">
              <label>Experience (Years)</label>
              <input name="experience" onChange={handleChange} />
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


            {/* Password */}

            <div className="form-row">
            <label>Password</label>
            <input
                type="password"
                name="password"
                onChange={handleChange}
            />
            </div>


            {/* Confirm Password */}

            <div className="form-row">
            <label>Confirm Password</label>
            <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
            />
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button className="student-search-btn" onClick={submit}>
                Register Trainer
              </button>
              <button
                className="add-student-btn"
                onClick={() => navigate(`/${academyCode}/teachers`)}
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
