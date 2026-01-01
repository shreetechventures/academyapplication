import React, { useState } from "react";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";

export default function ChangePassword() {
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updatePassword = async () => {
    if (form.newPassword !== form.confirmNewPassword) {
      alert("❌ New passwords do not match");
      return;
    }

    let endpoint = "";

    if (role === "academyAdmin") {
      endpoint = "/auth/change-password";
    } else if (role === "teacher") {
      endpoint = "/teachers/change-password";
    } else if (role === "student") {
      endpoint = "/students/self/change-password";
    }

    try {
      await api.put(endpoint, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("✅ Password Updated Successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
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
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
              />
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
