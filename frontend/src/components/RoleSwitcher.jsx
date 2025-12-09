// frontend/src/components/RoleSwitcher.jsx
import React from 'react';

// frontend/src/components/RoleSwitcher.jsx

export default function RoleSwitcher({ role, setRole }) {
  const roles = [
    // { key: "academyAdmin", label: "Login Here"}


    // { key: "academyAdmin", label: "Admin" },
    // { key: "teacher", label: "Teacher" },
    // { key: "student", label: "Student" }
  ]; 

  return (
    <div className="role-switcher">
      {roles.map(r => (
        <button
          key={r.key}
          className={`role-btn ${role === r.key ? "active" : ""}`}
          onClick={() => setRole(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
