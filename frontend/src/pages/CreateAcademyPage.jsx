import React, { useEffect, useState } from "react";
import api from "../api/axios";

import { useNavigate } from "react-router-dom";
import "../styles/superadmin-form.css";

export default function CreateAcademyPage() {
  const navigate = useNavigate();

  // ===============================
  // ACADEMY FORM STATE
  // ===============================
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
  });

  // ===============================
  // SUBSCRIPTION STATE
  // ===============================
  const [subscription, setSubscription] = useState({
    durationMonths: 3,
    maxStudents: 30,
    // amount: 0,
    remark: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  const [subscriptionMap, setSubscriptionMap] = useState({});

  // ===============================
  // ACADEMY LIST
  // ===============================
  const [academies, setAcademies] = useState([]);

  // ===============================
  // SUBSCRIPTION META STATE
  // ===============================
  const [subStatus, setSubStatus] = useState(null); // active / expired / null
  const [subHistory, setSubHistory] = useState([]); // payment history
  const [academyActive, setAcademyActive] = useState(true); // enabled / disabled

  // ===============================
  // HANDLERS
  // ===============================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubChange = (e) => {
    const { name, value, type } = e.target;

    setSubscription({
      ...subscription,
      // [e.target.name]: Number(e.target.value),
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // ===============================
  // CREATE / UPDATE ACADEMY
  // ===============================
  const submitAcademy = async () => {
    try {
      if (editingId) {
        // Update academy basic info
        await api.put(`/superadmin/academy/${editingId}`, {
          name: form.name,
          address: form.address,
        });

        // Update / extend subscription
        await api.post("/superadmin/subscription/mark-paid", {
          academyCode: form.code,
          durationMonths: subscription.durationMonths,
          maxStudents: subscription.maxStudents,
          // amount: subscription.amount,
          remark: subscription.remark, // ✅ ADD THIS
        });

        setMsg("✅ Academy & subscription updated successfully");
      } else {
        // Create academy with subscription
        await api.post("/superadmin/create-academy", {
          ...form,
          durationMonths: subscription.durationMonths,
          maxStudents: subscription.maxStudents,
          // amount: subscription.amount,
          remark: subscription.remark, // ✅ ADD
        });

        setMsg("✅ Academy created with subscription");
      }

      resetForm();
      loadAcademies();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const loadAcademies = async () => {
    try {
      const res = await api.get("/superadmin/academies");
      setAcademies(res.data);

      const subs = {};

      for (const a of res.data) {
        try {
          const s = await api.get(`/superadmin/subscription/${a.code}`);
          subs[a.code] = s.data;
        } catch (err) {
          if (err.response?.status === 404) {
            // ✅ No subscription is VALID state
            subs[a.code] = null;
          } else {
            console.error("Subscription fetch error:", err);
          }
        }
      }

      setSubscriptionMap(subs);
    } catch (err) {
      console.error("Academy load error:", err);
    }
  };

  useEffect(() => {
    loadAcademies();
  }, []);

  // ===============================
  // EDIT ACADEMY (LOAD SUBSCRIPTION)
  // ===============================
  const editAcademy = async (academy) => {
    setEditingId(academy._id);

    setForm({
      name: academy.name,
      code: academy.code,
      address: academy.address || "",
    });

    setAcademyActive(academy.isActive);

    // 🔹 Load subscription
    try {
      const subRes = await api.get(`/superadmin/subscription/${academy.code}`);

      setSubscription({
        durationMonths: subRes.data.durationMonths || 3,
        maxStudents: subRes.data.maxStudents || 30,
        // amount: 0,
        remark: subRes.data.remark || "", // ✅ ADD
      });

      setSubStatus(subRes.data.status);
    } catch (err) {
      if (err.response?.status === 404) {
        // No subscription yet
        setSubscription({
          durationMonths: 3,
          maxStudents: 30,
          // amount: 0,
          remark: "",
        });
        setSubStatus(null);
      } else {
        console.error(err);
      }
    }

    // 🔹 Load subscription payment history
    try {
      const histRes = await api.get(
        `/superadmin/subscription/${academy.code}/history`
      );
      setSubHistory(histRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setSubHistory([]);
      } else {
        console.error(err);
      }
    }
  };

  // ===============================
  // DELETE ACADEMY
  // ===============================
  const deleteAcademy = async (id) => {
    if (!window.confirm("Delete this academy?")) return;
    await api.delete(`/superadmin/academy/${id}`);
    loadAcademies();
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", address: "" });
    setSubscription({
      durationMonths: 3,
      maxStudents: 30,
      // amount: 0,
      remark: "",
    });
  };

  // ===============================
  // SUBSCRIPTION EXPIRY PREVIEW
  // ===============================
  const subscriptionEndDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + Number(subscription.durationMonths));
    return d.toDateString();
  })();

  return (
    <div className="superadmin-form-container">
      <div style={{ padding: 40 }}>
        <h2>{editingId ? "Edit Academy" : "Create Academy"}</h2>

        {/* ===============================
            ACADEMY DETAILS
        =============================== */}
        <input
          name="name"
          placeholder="Academy Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="code"
          placeholder="Academy Code"
          value={form.code}
          onChange={handleChange}
          disabled={!!editingId}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        {/* <hr /> */}

        {/* ===============================
            SUBSCRIPTION SETUP
        =============================== */}
        {/* <h3>📦 Subscription Setup</h3> */}

        {subStatus && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 12,
              fontSize: 13,
              background:
                subStatus === "active"
                  ? "#ecfdf5"
                  : subStatus === "expired"
                  ? "#fff7ed"
                  : "#fef2f2",
              color:
                subStatus === "active"
                  ? "#065f46"
                  : subStatus === "expired"
                  ? "#9a3412"
                  : "#991b1b",
            }}
          >
            Status: <strong>{subStatus.toUpperCase()}</strong>
          </div>
        )}

        <input
          type="number"
          name="durationMonths"
          placeholder="Duration (months)"
          value={subscription.durationMonths}
          onChange={handleSubChange}
        />

        <p>
          Subscription will expire on <strong>{subscriptionEndDate}</strong>
        </p>

        {/* Student presets */}
        <label>
          <strong>Max Students</strong>
        </label>
        <div style={{ display: "flex", gap: 10, margin: 12 }}>
          {[30, 45, 60, 75].map((num) => (
            <button
              key={num}
              type="button"
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border:
                  subscription.maxStudents === num
                    ? "2px solid #2563eb"
                    : "1px solid #d1d5db",
                background:
                  subscription.maxStudents === num ? "#eff6ff" : "#fff",
                cursor: "pointer",
              }}
              onClick={() =>
                setSubscription({ ...subscription, maxStudents: num })
              }
            >
              {num}
            </button>
          ))}
        </div>

        <input
          type="number"
          name="maxStudents"
          placeholder="Custom student limit"
          value={subscription.maxStudents}
          onChange={handleSubChange}
        />

        <input
          type="text"
          name="remark"
          placeholder="Add Remark if Any"
          value={subscription.remark}
          onChange={handleSubChange}
        />

        {/* <input
          type="number"
          name="amount"
          placeholder="Payment Amount (optional)"
          value={subscription.amount}
          onChange={handleSubChange}
        /> */}

        {/* ===============================
            ACTIONS
        =============================== */}
        <button onClick={submitAcademy}>
          {editingId ? "Update Academy & Subscription" : "Create Academy"}
        </button>

        {editingId && (
          <>
            <br />
            <button onClick={resetForm}>Cancel</button>
          </>
        )}

        {msg && <p>{msg}</p>}

        {subHistory.length > 0 && (
          <>
            <h4>📜 Subscription History</h4>
            <table border="1" cellPadding="8" width="100%">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Months</th>
                  {/* <th>Amount</th> */}
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {subHistory.map((p) => (
                  <tr key={p._id}>
                    {/* <td>
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "—"}
                    </td> */}
                    <td>
                      {p.paidOn
                        ? new Date(p.paidOn).toLocaleDateString()
                        : p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>{p.durationMonths}</td>
                    {/* <td>₹ {p.amount}</td> */}
                    <td>{p.remark || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

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
              <th>Subscription</th>
              <th>Max Students</th>
              <th>Remark</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {academies.map((a) => (
              <tr key={a._id}>
                <td data-label="Name">
                  {a.name}
                  {!a.isActive && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {" "}
                      (Disabled)
                    </span>
                  )}
                </td>

                <td data-label="Code">{a.code}</td>

                <td data-label="Subscription">
                  {subscriptionMap?.[a.code]?.status
                    ? subscriptionMap[a.code].status.toUpperCase()
                    : "—"}
                </td>

                <td data-label="Max Students">
                  {subscriptionMap?.[a.code]?.maxStudents ?? "—"}
                </td>

                <td data-label="Remark">
                  {subscriptionMap?.[a.code]?.remark || "—"}
                </td>

                <td data-label="Expiry">
                  {subscriptionMap?.[a.code]?.endDate
                    ? new Date(
                        subscriptionMap[a.code].endDate
                      ).toLocaleDateString()
                    : "—"}
                </td>

                <td data-label="Actions" className="actions">
                  <button onClick={() => editAcademy(a)}>✏️ Edit</button>
                  <button onClick={() => deleteAcademy(a._id)}>🗑 Delete</button>
                  <button
                    onClick={async () => {
                      await api.put(`/superadmin/academy/${a._id}/toggle`);
                      loadAcademies();
                    }}
                  >
                    {a.isActive ? "🚫 Disable" : "✅ Enable"}
                  </button>
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
