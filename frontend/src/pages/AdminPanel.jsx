// frontend/src/pages/AdminPanel.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [msg, setMsg] = useState("");
  const [academy, setAcademy] = useState(null);

  // 🔹 Load academy info (for display only)
  useEffect(() => {
    async function loadAcademy() {
      try {
        const res = await api.get("/academy");
        setAcademy(res.data);
      } catch (err) {
        console.error("Failed to load academy", err);
      }
    }
    loadAcademy();
  }, []);

  const createTeacher = async () => {
    const name = prompt("Teacher name");
    const email = prompt("Teacher email");
    const password = prompt("Teacher password (min 8 chars)");

    try {
      await api.post("/admin/create-teacher", { name, email, password });
      setMsg("Teacher created");
    } catch (e) {
      setMsg(e.response?.data?.message || "Error");
    }
  };

  const createStudent = async () => {
    const name = prompt("Student name");
    const email = prompt("Student email");
    const password = prompt("Student password");

    try {
      await api.post("/admin/create-student", { name, email, password });
      setMsg("Student created");
    } catch (e) {
      setMsg(e.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Admin Panel{" "}
        {academy ? `- ${academy.name}` : ""}
      </h2>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={createTeacher}>Create Teacher</button>
        <button onClick={createStudent}>Create Student</button>
      </div>

      {msg && <div style={{ marginTop: 12, color: "green" }}>{msg}</div>}
    </div>
  );
}
