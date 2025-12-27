import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Navigate } from "react-router-dom";
import PaymentHistoryModal from "../components/PaymentHistoryModal";
import PageWrapper from "../components/PageWrapper";

export default function StudentFee() {
  const { academyCode } = useParams();
  const role = localStorage.getItem("role");

  /* =======================
     STATE
  ======================= */
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [billings, setBillings] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingBillings, setLoadingBillings] = useState(false);

  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");

  // totals (OPTION B)
  const [totals, setTotals] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });

  // set fee
  const [editBillingId, setEditBillingId] = useState(null);
  const [feeAmount, setFeeAmount] = useState("");

  // pay fee modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [activeBillingId, setActiveBillingId] = useState(null);

  // history
  const [historyOpen, setHistoryOpen] = useState(false);

  /* =======================
     LOAD STUDENTS
  ======================= */
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await api.get(`/${academyCode}/students`);
        setStudents(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };
    loadStudents();
  }, [academyCode]);

  /* =======================
     ROLE GUARD
  ======================= */
  if (role === "student") {
    return <Navigate to={`/${academyCode}/fees/my`} replace />;
  }

  /* =======================
     FUNCTIONS
  ======================= */
  const openStudent = async (student) => {
    setSelectedStudent(student);
    setBillings([]);

    try {
      setLoadingBillings(true);
      const res = await api.get(
        `/${academyCode}/fees/student/${student._id}/billing`
      );

      const data = res.data.data || [];
      setBillings(data);

      // ✅ FRONTEND TOTALS
      const total = data.reduce((s, b) => s + (b.finalFee || 0), 0);
      const paid = data.reduce((s, b) => s + (b.paidAmount || 0), 0);

      setTotals({
        total,
        paid,
        pending: Math.max(total - paid, 0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBillings(false);
    }
  };

  const saveFee = async (billingId) => {
    if (!feeAmount || feeAmount <= 0) return alert("Invalid fee");

    await api.put(`/${academyCode}/fees/billing/${billingId}/amount`, {
      finalFee: Number(feeAmount),
    });

    setEditBillingId(null);
    setFeeAmount("");
    openStudent(selectedStudent);
  };

  const handlePayFee = async () => {
    if (!payAmount || payAmount <= 0) return alert("Invalid amount");

    await api.post(`/${academyCode}/fees/billing/${activeBillingId}/pay`, {
      amount: Number(payAmount),
      mode: payMode,
    });

    setPayModalOpen(false);
    setPayAmount("");
    setPayMode("cash");
    openStudent(selectedStudent);
  };

  /* =======================
     UI
  ======================= */
  return (
    <PageWrapper>
      {/* ===== SUMMARY ===== */}
      <div className="fee-summary-admin">
        <div className="summary-box">
          <span>Total Fee</span>
          <strong>₹{totals.total}</strong>
        </div>

        <div className="summary-box paid">
          <span>Paid</span>
          <strong>₹{totals.paid}</strong>
        </div>

        <div className="summary-box pending">
          <span>Pending</span>
          <strong>₹{totals.pending}</strong>
        </div>
      </div>

      <div>
        {/* ===== STUDENTS ===== */}
        <div>
          <h3>Students</h3>
          {students.map((s) => (
            <div
              key={s._id}
              onClick={() => openStudent(s)}
              style={{
                padding: 10,
                marginBottom: 6,
                cursor: "pointer",
                background:
                  selectedStudent?._id === s._id ? "#eef5ff" : "#f9f9f9",
                border: "1px solid #ddd",
              }}
            >
              <strong>{s.name}</strong>
              <div style={{ fontSize: 12 }}>{s.studentCode}</div>
            </div>
          ))}
        </div>

        {/* ===== BILLINGS ===== */}
        <div style={{ flex: 1 }}>
          {!selectedStudent && <p>Select a student</p>}

          {selectedStudent && (
            <>
              <h3>
                Fees – {selectedStudent.name} ({selectedStudent.studentCode})
              </h3>
              <div className="fee-table-wrapper">
                <table className="fee-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Fee</th>
                      <th>Paid</th>
                      <th>Pending</th>

                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {billings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          {new Date(b.periodStart).toLocaleDateString()} –{" "}
                          {new Date(b.periodEnd).toLocaleDateString()}
                        </td>

                        {/* Fee */}
                        <td>
                          {editBillingId === b._id ? (
                            <>
                              <input
                                type="number"
                                value={feeAmount}
                                onChange={(e) => setFeeAmount(e.target.value)}
                                className="pay-input"
                              />
                              <button
                                className="pay-save"
                                onClick={() => saveFee(b._id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-history"
                                onClick={() => {
                                  setEditBillingId(null);
                                  setFeeAmount("");
                                }}
                                style={{ marginLeft: 6 }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <div>
                              <div>Base: ₹{b.baseFee}</div>
                              {b.discountAmount > 0 && (
                                <div style={{ color: "green", fontSize: 12 }}>
                                  Discount: -₹{b.discountAmount}
                                </div>
                              )}
                              <strong>Final: ₹{b.finalFee}</strong>
                            </div>
                          )}
                        </td>
                        <td>₹{b.paidAmount}</td>

                        <td
                          style={{
                            fontWeight: 600,
                            color:
                              b.finalFee - b.paidAmount > 0
                                ? "#d32f2f"
                                : "green",
                          }}
                        >
                          ₹{Math.max(b.finalFee - b.paidAmount, 0)}
                        </td>

                        <td>
                          <span className={`status-${b.status}`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="fee-actions">
                            <button
                              className="btn btn-set"
                              onClick={() => {
                                setEditBillingId(b._id);
                                setFeeAmount(b.finalFee);
                              }}
                            >
                              Set Fee
                            </button>

                            {b.status !== "paid" && (
                              <button
                                className="btn btn-pay"
                                onClick={() => {
                                  setActiveBillingId(b._id);
                                  setPayModalOpen(true);
                                }}
                              >
                                Pay
                              </button>
                            )}
                            {role === "academyAdmin" && (
                              <button
                                className="btn btn-discount"
                                onClick={() => {
                                  setActiveBillingId(b._id);
                                  setDiscountAmount("");
                                  setDiscountModalOpen(true);
                                }}
                              >
                                Discount
                              </button>
                            )}

                            {b.paidAmount > 0 && (
                              <button
                                className="btn btn-history"
                                onClick={() => {
                                  setActiveBillingId(b._id);
                                  setHistoryOpen(true);
                                }}
                              >
                                History
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== PAY MODAL ===== */}
      {payModalOpen && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">Pay Fee</div>

            <div className="payment-modal-body">
              <label>Amount</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />

              <label>Payment Mode</label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            <div className="payment-modal-footer">
              <button className="btn btn-pay" onClick={handlePayFee}>
                Confirm Payment
              </button>
              <button
                className="btn btn-history"
                onClick={() => setPayModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {discountModalOpen && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">Give Discount</div>

            <div className="payment-modal-body">
              <label>Discount Amount (₹)</label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>

            <div className="payment-modal-footer">
              <button
                className="btn btn-pay"
                onClick={async () => {
                  if (!discountAmount || discountAmount <= 0)
                    return alert("Invalid discount");

                  await api.put(
                    `/${academyCode}/fees/billing/${activeBillingId}/discount`,
                    { discountAmount: Number(discountAmount) }
                  );

                  setDiscountModalOpen(false);
                  openStudent(selectedStudent);
                }}
              >
                Apply Discount
              </button>

              <button
                className="btn btn-history"
                onClick={() => setDiscountModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HISTORY ===== */}
      <PaymentHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        academyCode={academyCode}
        billingId={activeBillingId}
      />
    </PageWrapper>
  );
}
