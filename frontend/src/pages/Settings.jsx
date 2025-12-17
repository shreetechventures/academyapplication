import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

import "../styles/settings.css";


export default function Settings() {
  const { academyCode } = useParams();
  const role = localStorage.getItem("role");

  const [openPassword, setOpenPassword] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updatePassword = async () => {
    if (form.newPassword !== form.confirmNewPassword) {
      alert("❌ New passwords do not match");
      return;
    }

    let endpoint = "";

    if (role === "academyAdmin") {
      endpoint = `/${academyCode}/auth/change-password`;
    } else if (role === "teacher") {
      endpoint = `/${academyCode}/teachers/change-password`;
    } else if (role === "student") {
      endpoint = `/${academyCode}/auth/change-password`;
    }

    try {
      await axios.put(endpoint, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("✅ Password Updated");
      setOpenPassword(false);

    } catch (err) {
      alert(err.response?.data?.message || "❌ Error updating password");
    }
  };

  return (
    <PageWrapper>
      <div className="settings-page">

        {/* CHANGE PASSWORD HEADER ROW */}
        <div 
          className="password-row-header"
          onClick={() => setOpenPassword(!openPassword)}
        >
          <span>Change Password</span>
          {/* <button> change password</button> */}
          {/* <button className="class btn">Change Password</button> */}
          {/* <span>{openPassword ? "▲" : "▼"}</span> */}
        </div>

        {/* COLLAPSIBLE PASSWORD FORM */}
        {openPassword && (
          <div className="settings-section">

            <div className="form-row">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                onChange={handleChange}
              />
            </div>

            <button className="student-search-btn" onClick={updatePassword}>
              Update Password
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
