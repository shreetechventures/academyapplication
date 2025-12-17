// frontend/src/pages/TeacherFeeDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import "../styles/teacherFee.css";

export default function TeacherFeeDashboard() {
  const [studentsFees, setStudentsFees] = useState([]);
  const [loading, setLoading] = useState(true);

  // selection state
  const [selected, setSelected] = useState(null); // studentFee object
  const [showPayModal, setShowPayModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // pay form
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [payMonth, setPayMonth] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/${academyCode}/fees/all`); // if you rely on :academyCode param, compute path accordingly
      // res.data.data expected to be array
      setStudentsFees(res.data.data || []);
    } catch (err) {
      console.error("Failed to load student fees", err);
      alert("Failed to load student fees");
    } finally {
      setLoading(false);
    }
  };

  // helper to open selected student
  const openStudent = (s) => {
    setSelected(s);
    setShowPayModal(false);
    setShowUpdateModal(false);
  };

  // record payment (uses studentFee._id)
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!payAmount) return alert("Enter amount");
    const amt = Number(payAmount);
    if (isNaN(amt) || amt <= 0) return alert("Enter valid amount");

    try {
      const res = await axios.post(
        `/${academyCode}/fees/${selected._id}/pay`,
        {
          amount: amt,
          mode: payMode,
          month: payMonth
        }
      );

      alert("Payment recorded");
      // update selected and refresh list
      const updatedFee = res.data.data.fee;
      setSelected(updatedFee);
      fetchAll();
      // clear form
      setPayAmount("");
      setPayMode("cash");
      setPayMonth("");
      setShowPayModal(false);
    } catch (err) {
      console.error("Pay error:", err);
      alert(err?.response?.data?.message || "Payment failed");
    }
  };

  // update total fee
  const handleUpdateTotalFee = async (e) => {
    e.preventDefault();
    const newTotal = Number(e.target.totalFee.value);
    if (isNaN(newTotal) || newTotal < 0) return alert("Enter valid fee");

    try {
      const res = await axios.put(`/${academyCode}/fees/${selected._id}`, {
        totalFee: newTotal
      });
      alert("Total fee updated");
      setSelected(res.data.data);
      fetchAll();
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Update fee error:", err);
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <PageWrapper>
      <div style={{ padding: 18, display: "flex", gap: 18 }}>
        <div style={{ flex: 1 }}>
          <h2>Student Fees</h2>

          {loading ? (
            <p>Loading...</p>
          ) : studentsFees.length === 0 ? (
            <p>No student fees found. Assign some via Admin → Assign Fee</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentsFees.map((s) => (
                  <tr
                    key={s._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => openStudent(s)}
                    className={selected?._id === s._id ? "selected-row" : ""}
                  >
                    <td>{s.studentId?.name || "Unknown"}</td>
                    <td>{s.studentId?.className || "-"}</td>
                    <td>₹{s.totalFee}</td>
                    <td>₹{s.paidFee}</td>
                    <td>₹{s.pendingFee}</td>
                    <td>
                      <button onClick={(ev) => { ev.stopPropagation(); openStudent(s); setShowPayModal(true); }}>
                        Pay
                      </button>
                      <button onClick={(ev) => { ev.stopPropagation(); openStudent(s); setShowUpdateModal(true); }} style={{ marginLeft: 8 }}>
                        Update Total
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 420 }}>
          {selected ? (
            <div className="card">
              <h3>{selected.studentId?.name || "Student Detail"}</h3>
              <div><strong>Total:</strong> ₹{selected.totalFee}</div>
              <div><strong>Paid:</strong> ₹{selected.paidFee}</div>
              <div><strong>Pending:</strong> ₹{selected.pendingFee}</div>

              <div style={{ marginTop: 12 }}>
                <button onClick={() => setShowPayModal(true)}>Record Payment</button>
                <button onClick={() => setShowUpdateModal(true)} style={{ marginLeft: 8 }}>Update Total Fee</button>
              </div>

              <h4 style={{ marginTop: 16 }}>Payment History</h4>
              <FeeHistory studentFeeId={selected._id} />
            </div>
          ) : (
            <div className="card">
              <h3>Select a student to view details</h3>
              <p>Click any row on the left to open the fee details panel.</p>
            </div>
          )}
        </div>
      </div>

      {/* PAY MODAL (simple) */}
      {showPayModal && selected && (
        <div className="modal">
          <div className="modal-body">
            <h3>Record Payment — {selected.studentId?.name}</h3>
            <form onSubmit={handleRecordPayment}>
              <div>
                <label>Pending: ₹{selected.pendingFee}</label>
              </div>
              <div style={{ marginTop: 8 }}>
                <input
                  type="number"
                  placeholder="Amount"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <select value={payMode} onChange={(e) => setPayMode(e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="gpay">GPay</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginTop: 8 }}>
                <input placeholder="Month (optional) — e.g. December 2025" value={payMonth} onChange={(e) => setPayMonth(e.target.value)} />
              </div>

              <div style={{ marginTop: 12 }}>
                <button type="submit">Record</button>
                <button type="button" onClick={() => setShowPayModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE TOTAL MODAL */}
      {showUpdateModal && selected && (
        <div className="modal">
          <div className="modal-body">
            <h3>Update Total Fee — {selected.studentId?.name}</h3>
            <form onSubmit={handleUpdateTotalFee}>
              <div>
                <input name="totalFee" type="number" defaultValue={selected.totalFee} required />
              </div>
              <div style={{ marginTop: 12 }}>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowUpdateModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

// small component to fetch & display fee history
function FeeHistory({ studentFeeId }) {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get(`/${academyCode}/fees/history/${studentFeeId}`);
        if (mounted) setHistory(res.data.data || []);
      } catch (err) {
        console.error("history fetch error", err);
      }
    }
    if (studentFeeId) load();
    return () => (mounted = false);
  }, [studentFeeId]);

  if (!history || history.length === 0) return <div>No payments yet.</div>;

  return (
    <div style={{ marginTop: 8 }}>
      {history.map((h) => (
        <div key={h._id} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
          <div><strong>₹{h.amount}</strong> — {h.mode} — {h.month || new Date(h.date).toLocaleDateString()}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{new Date(h.date).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
