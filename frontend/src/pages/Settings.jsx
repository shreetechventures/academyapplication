// frontend/src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";

import "../styles/settings.css";

export default function Settings() {
  const role = localStorage.getItem("role");

  const [openPassword, setOpenPassword] = useState(false);

  // 🔐 PERMISSIONS
  const [permissions, setPermissions] = useState({
    allowTrainerFeeManagement: false,
    allowTrainerStudentRegistration: false,
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  /* ============================
     LOAD ACADEMY SETTINGS
     (academy resolved by subdomain)
  ============================ */
  useEffect(() => {
    const loadSettings = async () => {
      if (role !== "academyAdmin") return;

      try {
        const res = await api.get("/settings");

        setPermissions({
          allowTrainerFeeManagement:
            res.data.settings?.allowTrainerFeeManagement || false,
          allowTrainerStudentRegistration:
            res.data.settings?.allowTrainerStudentRegistration || false,
        });
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    loadSettings();
  }, [role]);

  /* ============================
     PASSWORD HANDLING
  ============================ */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

    if (!endpoint) {
      alert("❌ Invalid role");
      return;
    }

    try {
      await api.put(endpoint, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("✅ Password Updated");
      setOpenPassword(false);
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error updating password");
    }
  };

  /* ============================
     UPDATE PERMISSIONS
  ============================ */
  // const togglePermission = async (key, value) => {
  //   const previous = { ...permissions };

  //   try {
  //     setPermissions((prev) => ({ ...prev, [key]: value }));

  //     await api.put("/settings/permissions", {
  //       ...permissions,
  //       [key]: value,
  //     });
  //   } catch (err) {
  //     alert("❌ Failed to update permission");
  //     setPermissions(previous); // rollback
  //   }
  // };

//   const togglePermission = async (key, value) => {
//   const updated = {
//     ...permissions,
//     [key]: value,
//   };

//   const previous = { ...permissions };

//   try {
//     setPermissions(updated);

//     await api.put("/settings/permissions", updated);
//   } catch (err) {
//     alert("❌ Failed to update permission");
//     setPermissions(previous); // rollback
//   }
// };


const togglePermission = async (key, value) => {
  const updated = { ...permissions, [key]: value };
  const previous = { ...permissions };

  try {
    setPermissions(updated);

    await api.put("/settings/permissions", updated);

    // ✅ FORCE RELOAD FROM DB
    const res = await api.get("/settings");
    setPermissions(res.data.settings || {});
  } catch (err) {
    alert("❌ Failed to update permission");
    setPermissions(previous);
  }
};

  return (
    <PageWrapper>
      <div className="settings-page">

        {/* =============================
            CHANGE PASSWORD
        ============================= */}
        {openPassword && (
          <div className="settings-section">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              onChange={handleChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              onChange={handleChange}
            />

            <button onClick={updatePassword}>Update Password</button>
          </div>
        )}

        {/* =============================
            ADMIN → PERMISSIONS
        ============================= */}
        {role === "academyAdmin" && (
          <div className="settings-section">
            <div className="toggle-row">
              <span>Allow trainers to manage student fees</span>
              <input
                type="checkbox"
                checked={permissions.allowTrainerFeeManagement}
                onChange={(e) =>
                  togglePermission(
                    "allowTrainerFeeManagement",
                    e.target.checked
                  )
                }
              />
            </div>

            <hr />

            <div className="toggle-row">
              <span>Allow trainers to register students</span>
              <input
                type="checkbox"
                checked={permissions.allowTrainerStudentRegistration}
                onChange={(e) =>
                  togglePermission(
                    "allowTrainerStudentRegistration",
                    e.target.checked
                  )
                }
              />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
