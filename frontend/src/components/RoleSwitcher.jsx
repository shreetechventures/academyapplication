import React from "react";

export default function RoleSwitcher({ role, setRole }) {
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      
      <button
        type="button"
        onClick={() => setRole("academyAdmin")}
        className={role === "academyAdmin" ? "active" : ""}
      >
        Admin
      </button>

      <button
        type="button"
        onClick={() => setRole("teacher")}
        className={role === "teacher" ? "active" : ""}
      >
        Teacher
      </button>

      <button
        type="button"
        onClick={() => setRole("student")}
        className={role === "student" ? "active" : ""}
      >
        Student
      </button>

    </div>
  );
}
