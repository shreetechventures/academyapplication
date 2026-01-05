// // DashboardSidebar.jsx
// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faInstagram,
//   faYoutube,
//   faWhatsapp,
//   faFacebook,
// } from "@fortawesome/free-brands-svg-icons";
// import { faGlobe } from "@fortawesome/free-solid-svg-icons";

// export default function DashboardSidebar({ academyCode, open, close }) {
//   const navigate = useNavigate();
//   const path = useLocation().pathname;

//   const role = localStorage.getItem("role");

//   const go = (link) => {
//     navigate(link);
//     close();
//   };

//   // Sidebar Item
//   const Item = ({ icon, label, link }) => (
//     <div
//       className={`sidebar-item ${path === link ? "active" : ""}`}
//       onClick={() => go(link)}
//     >
//       <span className="icon">{icon}</span> {label}
//     </div>
//   );

//   return (
//     <>
//       {/* ================= SIDEBAR ================= */}
//       <div className={`sidebar ${open ? "open" : ""}`}>
//         <h3>Defence Academy</h3>

//         {/* -------- DASHBOARD (ROLE BASED) -------- */}
//         <div className="sidebar-section">
//           {role === "academyAdmin" && (
//             <Item
//               icon="🏠"
//               label="Dashboard"
//               link={`/dashboard/admin`}
//             />
//           )}

//           {role === "teacher" && (
//             <Item
//               icon="🏠"
//               label="Dashboard"
//               link={`/dashboard/teacher`}
//             />
//           )}

//           {role === "student" && (
//             <Item
//               icon="🏠"
//               label="Dashboard"
//               link={`/dashboard/student`}
//             />
//           )}

//           <Item icon="📚" label="Lessons" link={`/lessons`} />
//         </div>

//         <div className="sidebar-separator" />

//         {/* -------- ADMIN + TEACHER -------- */}
//         {(role === "academyAdmin" || role === "teacher") && (
//           <>
//             <div className="sidebar-section">
//               <Item
//                 icon="👨‍🎓"
//                 label="Students"
//                 link={`/students`}
//               />
//               <Item
//                 icon="📝"
//                 label="Assessments"
//                 link={`/teacher-assessments`}
//               />
//               <Item
//                 icon="🧾"
//                 label="Student Fees"
//                 link={`/fees/students`}
//               />
//             </div>
//             <div className="sidebar-separator" />
//           </>
//         )}

//         {/* -------- ADMIN ONLY -------- */}
//         {role === "academyAdmin" && (
//           <>
//             <div className="sidebar-section">
//               <Item
//                 icon="👨‍🏫"
//                 label="Trainers"
//                 link={`/teachers`}
//               />
//               {/* <Item
//                 icon="📂"
//                 label="Left Trainers"
//                 link={`/teachers/left`}
//               /> */}
//             </div>
//             <div className="sidebar-separator" />
//           </>
//         )}

//         {/* -------- STUDENT ONLY -------- */}
//         {role === "student" && (
//           <>
//             <div className="sidebar-section">
//               <Item
//                 icon="📊"
//                 label="My Assessments"
//                 link={`/student-assessments`}
//               />
//               <Item
//                 icon="💰"
//                 label="My Fees"
//                 link={`/fees/my`}
//               />
//             </div>
//             <div className="sidebar-separator" />
//           </>
//         )}

//         {/* -------- CHAMPIONS (ALL) -------- */}
//         <div className="sidebar-section">
//           <Item
//             icon="🏆"
//             label="Our Champions"
//             link={`/our-champions`}
//           />
//         </div>

//         {/* -------- SETTINGS (ADMIN ONLY – BOTTOM) -------- */}
//         {role === "academyAdmin" && (
//           <>
//             <div className="sidebar-separator" />
//             <div className="sidebar-section">
//               <Item
//                 icon="⚙️"
//                 label="Settings"
//                 link={`/settings`}
//               />
//             </div>
//           </>
//         )}

//         {/* -------- SOCIAL LINKS (ABSOLUTE LAST) -------- */}
//         {/* -------- SOCIAL LINKS (ABSOLUTE LAST) -------- */}
//         <div className="sidebar-social">
//           <span
//             className="social-icon"
//             title="Instagram"
//             onClick={() =>
//               window.open("https://www.instagram.com/jobs_genix/", "_blank")
//             }
//           >
//             <FontAwesomeIcon icon={faInstagram} />
//           </span>



//           <span
//             className="social-icon"
//             title="WhatsApp"
//             onClick={() => window.open("https://wa.me/", "_blank")}
//           >
//             <FontAwesomeIcon icon={faWhatsapp} />
//           </span>

//           <span
//             className="social-icon"
//             title="Website"
//             onClick={() => window.open("https://shreegroup.io/", "_blank")}
//           >
//             <FontAwesomeIcon icon={faGlobe} />
//           </span>

//           <span
//             className="social-icon"
//             title="Facebook"
//             onClick={() => window.open("https://facebook.com/", "_blank")}
//           >
//             <FontAwesomeIcon icon={faFacebook} />
//           </span>
//         </div>
//       </div>
//       {/* OVERLAY */}
//       {open && <div className="overlay" onClick={close} />}
//     </>
//   );
// }



// frontend/src/components/DashboardSidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function DashboardSidebar({ open, close }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = localStorage.getItem("role");

  const go = (link) => {
    navigate(link);
    close();
  };

  const Item = ({ icon, label, link }) => (
    <div
      className={`sidebar-item ${pathname === link ? "active" : ""}`}
      onClick={() => go(link)}
    >
      <span className="icon">{icon}</span> {label}
    </div>
  );

  return (
    <>
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h3>Defence Academy</h3>

        {/* -------- DASHBOARD -------- */}
        <div className="sidebar-section">
          {role === "academyAdmin" && (
            <Item icon="🏠" label="Dashboard" link="/dashboard/admin" />
          )}

          {role === "teacher" && (
            <Item icon="🏠" label="Dashboard" link="/dashboard/teacher" />
          )}

          {role === "student" && (
            <Item icon="🏠" label="Dashboard" link="/dashboard/student" />
          )}

          <Item icon="📚" label="Lessons" link="/lessons" />
        </div>

        <div className="sidebar-separator" />

        {/* -------- ADMIN + TEACHER -------- */}
        {(role === "academyAdmin" || role === "teacher") && (
          <>
            <div className="sidebar-section">
              <Item icon="👨‍🎓" label="Students" link="/students" />
              <Item
                icon="📝"
                label="Assessments"
                link="/assessments"
              />
              <Item
                icon="🧾"
                label="Student Fees"
                link="/fees/students"
              />
            </div>
            <div className="sidebar-separator" />
          </>
        )}

        {/* -------- ADMIN ONLY -------- */}
        {role === "academyAdmin" && (
          <>
            <div className="sidebar-section">
              <Item icon="👨‍🏫" label="Trainers" link="/teachers" />
            </div>
            <div className="sidebar-separator" />
          </>
        )}

        {/* -------- STUDENT ONLY -------- */}
        {role === "student" && (
          <>
            <div className="sidebar-section">
              <Item
                icon="📊"
                label="My Assessments"
                link="/student-assessments"
              />
              <Item icon="💰" label="My Fees" link="/fees/my" />
            </div>
            <div className="sidebar-separator" />
          </>
        )}

        {/* -------- CHAMPIONS -------- */}
        <div className="sidebar-section">
          <Item icon="🏆" label="Our Champions" link="/our-champions" />
        </div>

        {/* -------- SETTINGS -------- */}
        {role === "academyAdmin" && (
          <>
            <div className="sidebar-separator" />
            <div className="sidebar-section">
              <Item icon="⚙️" label="Settings" link="/settings" />
            </div>
          </>
        )}

        {/* -------- SOCIAL LINKS -------- */}
        <div className="sidebar-social">
          <span
            className="social-icon"
            title="Instagram"
            onClick={() =>
              window.open("https://www.instagram.com/jobs_genix/", "_blank")
            }
          >
            <FontAwesomeIcon icon={faInstagram} />
          </span>

          <span
            className="social-icon"
            title="WhatsApp"
            onClick={() => window.open("https://wa.me/7378705528", "_blank")}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </span>

          <span
            className="social-icon"
            title="Website"
            onClick={() => window.open("https://shreegroup.io/", "_blank")}
          >
            <FontAwesomeIcon icon={faGlobe} />
          </span>

          <span
            className="social-icon"
            title="Facebook"
            onClick={() => window.open("https://facebook.com/", "_blank")}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </span>
        </div>
      </div>

      {open && <div className="overlay" onClick={close} />}
    </>
  );
}
