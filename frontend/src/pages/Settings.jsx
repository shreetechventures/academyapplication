// import React, { useState, useEffect } from "react";
// import PageWrapper from "../components/PageWrapper";
// import axios from "../api/axios";
// import { useParams } from "react-router-dom";

// import "../styles/settings.css";

// export default function Settings() {
//   const { academyCode } = useParams();
//   const role = localStorage.getItem("role");

//   const [openPassword, setOpenPassword] = useState(false);
//   const [allowTrainerFeeManagement, setAllowTrainerFeeManagement] =
//     useState(false);

//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   /* ============================
//      LOAD ACADEMY SETTINGS
//   ============================ */
//   useEffect(() => {
//     const loadSettings = async () => {
//       if (role !== "academyAdmin") return;

//       try {
//         const res = await axios.get(`/${academyCode}/settings`);
//         setAllowTrainerFeeManagement(
//           res.data.settings?.allowTrainerFeeManagement || false
//         );
//       } catch (err) {
//         console.error("Failed to load settings", err);
//       }
//     };

//     loadSettings();
//   }, [academyCode, role]);

//   /* ============================
//      PASSWORD HANDLING
//   ============================ */
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const updatePassword = async () => {
//     if (form.newPassword !== form.confirmNewPassword) {
//       alert("❌ New passwords do not match");
//       return;
//     }

//     let endpoint = "";

//     if (role === "academyAdmin") {
//       endpoint = `/${academyCode}/auth/change-password`;
//     } else if (role === "teacher") {
//       endpoint = `/${academyCode}/teachers/change-password`;
//     } else if (role === "student") {
//       endpoint = `/${academyCode}/auth/change-password`;
//     }

//     try {
//       await axios.put(endpoint, form);
//       alert("✅ Password Updated");
//       setOpenPassword(false);
//     } catch (err) {
//       alert(err.response?.data?.message || "❌ Error updating password");
//     }
//   };

//   /* ============================
//      UPDATE FEE PERMISSION
//   ============================ */
//   const toggleFeePermission = async (value) => {
//     try {
//       setAllowTrainerFeeManagement(value);

//       await axios.put(`/${academyCode}/settings/fee-permission`, {
//         allowTrainerFeeManagement: value,
//       });
//     } catch (err) {
//       alert("❌ Failed to update fee permission");
//       setAllowTrainerFeeManagement(!value); // rollback UI
//     }
//   };

//   return (
//     <PageWrapper>
//       <div className="settings-page">
//         {/* =============================
//             CHANGE PASSWORD SECTION
//         ============================= */}
//         <div
//           className="password-row-header"
//           onClick={() => setOpenPassword(!openPassword)}
//         >
//           <span>Change Password</span>
//         </div>

//         {openPassword && (
//           <div className="settings-section">
//             <div className="form-row">
//               <label>Current Password</label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-row">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 name="newPassword"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-row">
//               <label>Confirm New Password</label>
//               <input
//                 type="password"
//                 name="confirmNewPassword"
//                 onChange={handleChange}
//               />
//             </div>

//             <button className="student-search-btn" onClick={updatePassword}>
//               Update Password
//             </button>
//           </div>
//         )}

//         {/* =============================
//             ADMIN → FEE PERMISSION
//         ============================= */}
//         {role === "academyAdmin" && (
//           <div className="settings-section">
//             <div className="toggle-row">
//               <span>Allow trainers to manage student fees</span>

//               <input
//                 type="checkbox"
//                 checked={allowTrainerFeeManagement}
//                 onChange={(e) => toggleFeePermission(e.target.checked)}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </PageWrapper>
//   );
// }



import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

import "../styles/settings.css";

export default function Settings() {
  const { academyCode } = useParams();
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
  ============================ */
  useEffect(() => {
    const loadSettings = async () => {
      if (role !== "academyAdmin") return;

      try {
        const res = await axios.get(`/${academyCode}/settings`);

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
  }, [academyCode, role]);

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
      endpoint = `/${academyCode}/auth/change-password`;
    } else if (role === "teacher") {
      endpoint = `/${academyCode}/teachers/change-password`;
    } else if (role === "student") {
      endpoint = `/${academyCode}/auth/change-password`;
    }

    try {
      await axios.put(endpoint, form);
      alert("✅ Password Updated");
      setOpenPassword(false);
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error updating password");
    }
  };

  /* ============================
     UPDATE PERMISSIONS
  ============================ */
  const togglePermission = async (key, value) => {
    const previous = { ...permissions };

    try {
      setPermissions((prev) => ({ ...prev, [key]: value }));

      await axios.put(`/${academyCode}/settings/permissions`, {
        ...permissions,
        [key]: value,
      });
    } catch (err) {
      alert("❌ Failed to update permission");
      setPermissions(previous); // rollback
    }
  };

  return (
    <PageWrapper>
      <div className="settings-page">
        {/* =============================
            CHANGE PASSWORD
        ============================= */}
        {/* <div
          className="password-row-header"
          onClick={() => setOpenPassword(!openPassword)}
        >
          <span>Change Password</span>
        </div> */}

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

        {/* =============================
            ADMIN → PERMISSIONS
        ============================= */}
        {role === "academyAdmin" && (
          <div className="settings-section">
            {/* FEE PERMISSION */}
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

            {/* STUDENT REGISTRATION PERMISSION */}
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

