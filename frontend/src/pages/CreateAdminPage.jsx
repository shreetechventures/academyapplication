import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateAdminPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    academyCode: ""
  });

  const [admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const loadAdmins = async () => {
    const res = await axios.get("/superadmin/admins");
    setAdmins(res.data);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      if (editingId) {
        await axios.put(`/superadmin/admin/${editingId}`, form);
        setMsg("✅ Admin updated");
      } else {
        await axios.post("/superadmin/create-admin", form);
        setMsg("✅ Admin created");
      }

      setForm({ name: "", email: "", password: "", academyCode: "" });
      setEditingId(null);
      loadAdmins();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    await axios.delete(`/superadmin/admin/${id}`);
    loadAdmins();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/shreenath/login");
  };

  return (
    <div className="superadmin-form-container">
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Manage Academy Admins</h2>
        {/* <button onClick={logout}>Logout</button> */}
      </div>

      <hr />

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br /><br />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />
      {!editingId && (
        <>
          <input
            name="academyCode"
            placeholder="Academy Code"
            value={form.academyCode}
            onChange={handleChange}
          />
          <br /><br />
        </>
      )}

      <button onClick={submit}>
        {editingId ? "Update Admin" : "Create Admin"}
      </button>

      {msg && <p>{msg}</p>}

      <hr />

      <h3>Existing Admins</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Academy</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(a => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.academyCode}</td>
              <td>
                <button onClick={() => {
                  setEditingId(a._id);
                  setForm({
                    name: a.name,
                    email: a.email,
                    password: "",
                    academyCode: a.academyCode
                  });
                }}>Edit</button>
                &nbsp;
                <button onClick={() => remove(a._id)}>Delete</button>
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
