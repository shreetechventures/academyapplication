import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/superadmin-form.css";


export default function CreateAcademyPage() {
  const navigate = useNavigate();

  // ===============================
  // CREATE / EDIT FORM STATE
  // ===============================
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  // ===============================
  // ACADEMY LIST
  // ===============================
  const [academies, setAcademies] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ===============================
  // CREATE or UPDATE ACADEMY
  // ===============================
  const submitAcademy = async () => {
    try {
      if (editingId) {
        await axios.put(`/superadmin/academy/${editingId}`, {
          name: form.name,
          address: form.address
        });
        setMsg("✅ Academy updated successfully");
      } else {
        await axios.post("/superadmin/create-academy", form);
        setMsg("✅ Academy created successfully");
      }

      resetForm();
      loadAcademies();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  // ===============================
  // LOAD ACADEMIES
  // ===============================
  const loadAcademies = async () => {
    try {
      const res = await axios.get("/superadmin/academies");
      setAcademies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAcademies();
  }, []);

  // ===============================
  // EDIT ACADEMY
  // ===============================
  const editAcademy = (academy) => {
    setEditingId(academy._id);
    setForm({
      name: academy.name,
      code: academy.code,
      address: academy.address || ""
    });
    setMsg("");
  };

  // ===============================
  // DELETE ACADEMY
  // ===============================
  const deleteAcademy = async (id) => {
    if (!window.confirm("Delete this academy?")) return;
    await axios.delete(`/superadmin/academy/${id}`);
    loadAcademies();
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", address: "" });
  };

  return (
    <div className="superadmin-form-container">

    <div style={{ padding: 40 }}>
      <h2>{editingId ? "Edit Academy" : "Create Academy"}</h2>

      <input
        name="name"
        placeholder="Academy Name"
        value={form.name}
        onChange={handleChange}
      />
      <br /><br />

      {/* CODE cannot be edited */}
      <input
        name="code"
        placeholder="Academy Code"
        value={form.code}
        onChange={handleChange}
        disabled={!!editingId}
      />
      <br /><br />

      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={submitAcademy}>
        {editingId ? "Update Academy" : "Create Academy"}
      </button>

      {editingId && (
        <>
          &nbsp;
          <button onClick={resetForm}>Cancel</button>
        </>
      )}

      {msg && <p>{msg}</p>}

      <hr />

      {/* ===============================
          ACADEMY LIST
         =============================== */}
      <h3>All Academies</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {academies.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.code}</td>
              <td>
                <button onClick={() => editAcademy(a)}>✏️ Edit</button>
                &nbsp;
                <button onClick={() => deleteAcademy(a._id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => navigate("/superadmin")}>⬅ Back</button>
    </div>
    </div>
  );
}
