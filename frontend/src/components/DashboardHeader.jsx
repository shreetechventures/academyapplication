// import React, { useState } from "react";
// import "../styles/dashboard.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";

// export default function DashboardHeader({ academy, onLogout }) {
//   const [open, setOpen] = useState(false);

//   const name = localStorage.getItem("name");
//   const role = localStorage.getItem("role");

//   return (
//     <div className="dashboard-header">
//       <h2 className="dashboard-header-title">
//         {academy?.name || "Academy Dashboard"}
//       </h2>

//       <div className="profile-box" onClick={() => setOpen(!open)}>
//         <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
//         {/* <span className="caret">▼</span> */}

//         {open && (
//           <div className="profile-dropdown">
//             <div className="dropdown-item">
//               <strong>Name:</strong> {name}
//             </div>

//             <div className="dropdown-item">
//               <strong>Role:</strong> {role}
//             </div>

//             <div className="dropdown-item">
//               <strong>Academy:</strong> {academy?.code}
//             </div>

//             <hr />

//             <div className="dropdown-item logout-red" onClick={onLogout}>
//               Logout
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import "../styles/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

export default function DashboardHeader({ academy, onLogout }) {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const { academyCode } = useParams();

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  /* ============================
     CHANGE PASSWORD HANDLERS
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
      endpoint = `/${academyCode}/students/change-password`;
    }

    try {
      await axios.put(endpoint, form);
      alert("✅ Password Updated Successfully");

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

  return (
    <>
      <div className="dashboard-header">
        <h2 className="dashboard-header-title">
          {academy?.name || "Academy Dashboard"}
        </h2>

        <div className="profile-box" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />

          {open && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <strong>Name:</strong> {name}
              </div>

              <div className="dropdown-item">
                <strong>Role:</strong> {role}
              </div>

              <div className="dropdown-item">
                <strong>Academy:</strong> {academy?.code}
              </div>

              <hr />

              {/* 🔑 CHANGE PASSWORD */}
              <div
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  setOpenPassword(true);
                }}
              >
                <FontAwesomeIcon icon={faKey} /> Change Password
              </div>

              <div className="dropdown-item logout-red" onClick={onLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =============================
          CHANGE PASSWORD MODAL
      ============================= */}
      {openPassword && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Change Password</h3>

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

            <div className="modal-actions">
              <button className="student-search-btn" onClick={updatePassword}>
                Update Password
              </button>

              <button
                className="add-student-btn"
                onClick={() => setOpenPassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
