
// DashboardSidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function DashboardSidebar({ academyCode, open, close }) {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const role = localStorage.getItem("role");

  const go = (link) => {
    navigate(link);
    close();
  };

  // Helper: Sidebar Item Component
  const Item = ({ icon, label, link }) => (
    <div
      className={`sidebar-item ${path === link ? "active" : ""}`}
      onClick={() => go(link)}
    >
      <span className="icon">{icon}</span> {label}
    </div>
  );

  return (
    <>
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h3>Defence Academy</h3>

        {/* ---------------- BASE MENU ---------------- */}
        <div className="sidebar-section">
          <Item icon="🏠" label="Dashboard" link={`/${academyCode}/dashboard`} />
          <Item icon="📚" label="Lessons" link={`/${academyCode}/lessons`} />
        </div>

        <div className="sidebar-separator"></div>

        {/* ---------------- ADMIN + TEACHER ---------------- */}
        {(role === "academyAdmin" || role === "teacher") && (
          <div className="sidebar-section">
            <Item icon="👨‍🎓" label="Students" link={`/${academyCode}/students`} />
            <Item icon="📁" label="Left Students" link={`/${academyCode}/students/left`} />
            <Item icon="📝" label="Assessments" link={`/${academyCode}/teacher-assessments`} />
          </div>
        )}

        {(role === "academyAdmin" || role === "teacher") && (
          <div className="sidebar-separator"></div>
        )}

        {/* ---------------- ADMIN ONLY ---------------- */}
        {role === "academyAdmin" && (
          <div className="sidebar-section">
            <Item icon="👨‍🏫" label="Trainers" link={`/${academyCode}/teachers`} />
            <Item icon="📂" label="Left Trainers" link={`/${academyCode}/teachers/left`} />
          </div>
        )}

        {role === "academyAdmin" && <div className="sidebar-separator"></div>}

        {/* ---------------- STUDENT ONLY ---------------- */}
        {role === "student" && (
          <>
            <div className="sidebar-section">
              <Item icon="📊" label="My Assessments" link={`/${academyCode}/student-assessments`} />
            </div>
            <div className="sidebar-separator"></div>
          </>
        )}

        {/* ---------------- CHAMPIONS (ALL ROLES) ---------------- */}
        <div className="sidebar-section">
          <Item icon="🏆" label="Our Champions" link={`/${academyCode}/our-champions`} />
        </div>

        <div className="sidebar-separator"></div>

        {/* ---------------- SETTINGS (ALL ROLES) ---------------- */}
        <div className="sidebar-section">
          <Item icon="⚙️" label="Settings" link={`/${academyCode}/settings`} />
        </div>
      </div>

      {open && <div className="overlay" onClick={close} />}
    </>
  );
}
