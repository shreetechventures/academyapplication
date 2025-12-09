import React, { useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams } from "react-router-dom";

export default function ChangePassword() {
  const { academyCode } = useParams();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const updatePassword = async () => {
  if (form.newPassword !== form.confirmNewPassword) {
    alert("❌ New passwords do not match");
    return;
  }

  try {
    const role = localStorage.getItem("role"); // 👈 detect role

    let endpoint = "";

    if (role === "academyAdmin") {
      endpoint = `/api/${academyCode}/auth/change-password`;
    } else if (role === "teacher") {
      endpoint = `/api/${academyCode}/teachers/change-password`;
    } else if (role === "student") {
      endpoint = `/api/${academyCode}/students/change-password`;
    }

    await axios.put(
      endpoint,
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("✅ Password Updated Successfully!");

  } catch (err) {
    alert(err.response?.data?.message || "❌ Error updating password");
  }
};


  return (
    <PageWrapper>
      <div className="students-content-wrapper">

        <div className="student-header-row">
          <h2 className="student-page-title">Change Password</h2>
        </div>

        <div className="register-container">
          <div className="register-form">

            <div className="form-row">
              <label>Current Password</label>
              <input type="password" name="currentPassword" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>New Password</label>
              <input type="password" name="newPassword" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Confirm New Password</label>
              <input type="password" name="confirmNewPassword" onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button className="student-search-btn" onClick={updatePassword}>
                Update Password
              </button>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
