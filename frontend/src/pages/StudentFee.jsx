// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import {  Navigate } from "react-router-dom";
// import PaymentHistoryModal from "../components/PaymentHistoryModal";
// import PageWrapper from "../components/PageWrapper";
// import "../styles/abc.css";
// export default function StudentFee() {
//   const role = localStorage.getItem("role");

//   /* =======================
//      STATE
//   ======================= */
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [billings, setBillings] = useState([]);

//   const [totals, setTotals] = useState({
//     total: 0,
//     paid: 0,
//     pending: 0,
//   });

//   // shared
//   const [activeBillingId, setActiveBillingId] = useState(null);

//   // set fee
//   const [setFeeModalOpen, setSetFeeModalOpen] = useState(false);
//   const [feeAmount, setFeeAmount] = useState("");

//   // pay
//   const [payModalOpen, setPayModalOpen] = useState(false);
//   const [payAmount, setPayAmount] = useState("");
//   const [payMode, setPayMode] = useState("cash");

//   // discount
//   const [discountModalOpen, setDiscountModalOpen] = useState(false);
//   const [discountAmount, setDiscountAmount] = useState("");

//   // search
//   const [search, setSearch] = useState("");

//   // history
//   const [historyOpen, setHistoryOpen] = useState(false);

//   /* =======================
//      LOAD STUDENTS
//   ======================= */
//   useEffect(() => {
//     api.get(`/students`).then((res) => {
//       setStudents(res.data || []);
//     });
//   }, []);

//   if (role === "student") {
//     return <Navigate to={`/fees/my`} replace />;
//   }

//   /* =======================
//      LOAD BILLINGS
//   ======================= */
//   const openStudent = async (student) => {
//     setSelectedStudent(student);
//     const res = await api.get(
//       `/fees/student/${student._id}/billing`
//     );

//     const data = res.data.data || [];
//     setBillings(data);

//     const total = data.reduce((s, b) => s + (b.finalFee || 0), 0);
//     const paid = data.reduce((s, b) => s + (b.paidAmount || 0), 0);

//     setTotals({
//       total,
//       paid,
//       pending: Math.max(total - paid, 0),
//     });
//   };

//   /* =======================
//      API ACTIONS
//   ======================= */
//   const saveFee = async () => {
//     if (!feeAmount || feeAmount <= 0) return alert("Invalid fee");

//     await api.put(`/fees/billing/${activeBillingId}/amount`, {
//       finalFee: Number(feeAmount),
//     });

//     setSetFeeModalOpen(false);
//     setFeeAmount("");
//     openStudent(selectedStudent);
//   };

//   const handlePayFee = async () => {
//     if (!payAmount || payAmount <= 0) return alert("Invalid amount");

//     await api.post(`/fees/billing/${activeBillingId}/pay`, {
//       amount: Number(payAmount),
//       mode: payMode,
//     });

//     setPayModalOpen(false);
//     setPayAmount("");
//     setPayMode("cash");
//     openStudent(selectedStudent);
//   };

//   const applyDiscount = async () => {
//     if (!discountAmount || discountAmount <= 0)
//       return alert("Invalid discount");

//     await api.put(`/fees/billing/${activeBillingId}/discount`, {
//       discountAmount: Number(discountAmount),
//     });

//     setDiscountModalOpen(false);
//     setDiscountAmount("");
//     openStudent(selectedStudent);
//   };

//   const filteredStudents = students.filter((s) =>
//     `${s.name} ${s.studentCode}`.toLowerCase().includes(search.toLowerCase())
//   );

//   /* =======================
//      UI
//   ======================= */
//   return (
//     <PageWrapper>
//       {/* ===== SUMMARY ===== */}
//       <div className="fee-summary-dashboard">
//         <div className="summary-card total">
//           <span>Total Fee</span>
//           <strong>₹{totals.total}</strong>
//         </div>

//         <div className="summary-card paid">
//           <span>Paid</span>
//           <strong>₹{totals.paid}</strong>
//         </div>

//         <div className="summary-card pending">
//           <span>Pending</span>
//           <strong>₹{totals.pending}</strong>
//         </div>
//       </div>

//       <div className="student-search">
//         <input
//           type="text"
//           placeholder="Search student by name or code..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* ===== STUDENTS ===== */}
//       <div className="student-list">
//         <h3 className="section-title">Students</h3>
//         {/* {students.map((s) => ( */}
//         {filteredStudents.map((s) => (

//           <div
//             key={s._id}
//             className={`student-card ${
//               selectedStudent?._id === s._id ? "active" : ""
//             }`}
//             onClick={() => openStudent(s)}
//           >
//             <div className="student-avatar">
//               {s.name?.charAt(0)?.toUpperCase()}
//             </div>
//             <div className="student-info">
//               <strong>{s.name}</strong>
//               <span>{s.studentCode}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ===== BILLINGS ===== */}
//       {selectedStudent && (
//         <div className="student-fee-table">
//           <h3>
//             Fees – {selectedStudent.name} ({selectedStudent.studentCode})
//           </h3>

//           <div className="fee-table-wrapper">
//             <table className="fee-table">
//               <thead>
//                 <tr>
//                   <th>Period</th>
//                   <th>Fee</th>
//                   <th>Paid</th>
//                   <th>Pending</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {billings.map((b) => (
//                   <tr key={b._id}>
//                     <td className="cell">
//                       <span className="cell-label">Date : </span>
//                       <span className="cell-value">
//                         {new Date(b.periodStart).toLocaleDateString()} –{" "}
//                         {new Date(b.periodEnd).toLocaleDateString()}
//                       </span>
//                     </td>

//                     <td className="cell">
//                       <span className="cell-label">Total Fee : </span>
//                       <span className="cell-value">₹{b.finalFee}</span>

//                       {b.discountAmount > 0 && (
//                         <span className="cell-sub green">
//                           Discount: -₹{b.discountAmount}
//                         </span>
//                       )}
//                     </td>

//                     <td className="cell">
//                       <span className="cell-label">Paid Fee : </span>
//                       <span className="cell-value">₹{b.paidAmount}</span>
//                     </td>

//                     <td className="cell">
//                       <span className="cell-label">Pending Fee : </span>
//                       <span className="cell-value red">
//                         ₹{Math.max(b.finalFee - b.paidAmount, 0)}
//                       </span>
//                     </td>

//                     <td className="cell">
//                       <span className="cell-label">Status : </span>
//                       <span className={`status-badge ${b.status}`}>
//                         {b.status.toUpperCase()}
//                       </span>
//                     </td>

//                     <td>
//                       <div className="fee-actions">
//                         <button
//                           className="btn btn-set"
//                           onClick={() => {
//                             setActiveBillingId(b._id);
//                             setFeeAmount(b.finalFee);
//                             setSetFeeModalOpen(true);
//                           }}
//                         >
//                           Set Fee
//                         </button>

//                         {b.status !== "paid" && (
//                           <button
//                             className="btn btn-pay"
//                             onClick={() => {
//                               setActiveBillingId(b._id);
//                               setPayModalOpen(true);
//                             }}
//                           >
//                             Pay
//                           </button>
//                         )}

//                         {role === "academyAdmin" && (
//                           <button
//                             className="btn btn-discount"
//                             onClick={() => {
//                               setActiveBillingId(b._id);
//                               setDiscountModalOpen(true);
//                             }}
//                           >
//                             Discount
//                           </button>
//                         )}

//                         {b.paidAmount > 0 && (
//                           <button
//                             className="btn btn-history"
//                             onClick={() => {
//                               setActiveBillingId(b._id);
//                               setHistoryOpen(true);
//                             }}
//                           >
//                             History
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ===== SET FEE MODAL ===== */}
//       {setFeeModalOpen && (
//         <div className="payment-overlay">
//           <div className="payment-modal">
//             <div className="payment-modal-header">Set Fee</div>
//             <div className="payment-modal-body">
//               <label>set fee</label>

//               <input
//                 className="fee-input"
//                 type="number"
//                 value={feeAmount}
//                 onChange={(e) => setFeeAmount(e.target.value)}
//               />
//             </div>
//             <div className="payment-modal-footer">
//               <button className="btn btn-pay" onClick={saveFee}>
//                 Save
//               </button>
//               <button
//                 className="btn btn-history"
//                 onClick={() => setSetFeeModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ===== PAY MODAL ===== */}
//       {payModalOpen && (
//         <div className="payment-overlay">
//           <div className="payment-modal">
//             <div className="payment-modal-header">Pay Fee</div>
//             <div className="payment-modal-body">
//               <label>Amount</label>
//               <input
//                 className="fee-input"
//                 type="number"
//                 value={payAmount}
//                 onChange={(e) => setPayAmount(e.target.value)}
//               />
//               <label>Mode of Payment</label>

//               <select
//                 value={payMode}
//                 onChange={(e) => setPayMode(e.target.value)}
//               >
//                 <option value="cash">Cash</option>
//                 <option value="online">Online</option>
//                 <option value="bank">Bank</option>
//               </select>
//             </div>
//             <div className="payment-modal-footer">
//               <button className="btn btn-pay" onClick={handlePayFee}>
//                 Confirm
//               </button>
//               <button
//                 className="btn btn-history"
//                 onClick={() => setPayModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ===== DISCOUNT MODAL ===== */}
//       {discountModalOpen && (
//         <div className="payment-overlay">
//           <div className="payment-modal">
//             <div className="payment-modal-header">Discount</div>
//             <div className="payment-modal-body">
//               <label> Discount Amount </label>

//               <input
//                 className="fee-input"
//                 type="number"
//                 value={discountAmount}
//                 onChange={(e) => setDiscountAmount(e.target.value)}
//               />
//             </div>
//             <div className="payment-modal-footer">
//               <button className="btn btn-pay" onClick={applyDiscount}>
//                 Apply
//               </button>
//               <button
//                 className="btn btn-history"
//                 onClick={() => setDiscountModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ===== HISTORY ===== */}
//       <PaymentHistoryModal
//         open={historyOpen}
//         onClose={() => setHistoryOpen(false)}
//         academyCode={academyCode}
//         billingId={activeBillingId}
//       />
//     </PageWrapper>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate } from "react-router-dom";
import PaymentHistoryModal from "../components/PaymentHistoryModal";
import PageWrapper from "../components/PageWrapper";
import "../styles/abc.css";

export default function StudentFee() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "academyAdmin";

  /* =======================
     STATE
  ======================= */
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [billings, setBillings] = useState([]);

  const [totals, setTotals] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });

  const [activeBillingId, setActiveBillingId] = useState(null);

  // Modals
  const [setFeeModalOpen, setSetFeeModalOpen] = useState(false);
  const [feeAmount, setFeeAmount] = useState("");

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");

  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");

  const [historyOpen, setHistoryOpen] = useState(false);

  const [search, setSearch] = useState("");

  /* =======================
     LOAD STUDENTS
  ======================= */
  useEffect(() => {
    api.get("/students").then((res) => {
      setStudents(res.data || []);
    });
  }, []);

  if (role === "student") {
    return <Navigate to="/fees/my" replace />;
  }

  /* =======================
     LOAD BILLINGS
  ======================= */
  const openStudent = async (student) => {
    setSelectedStudent(student);

    const res = await api.get(`/fees/student/${student._id}/billing`);

    const data = res.data.data || [];
    setBillings(data);

    const total = data.reduce((s, b) => s + (b.finalFee || 0), 0);
    const paid = data.reduce((s, b) => s + (b.paidAmount || 0), 0);

    setTotals({
      total,
      paid,
      pending: Math.max(total - paid, 0),
    });
  };

  /* =======================
     ACTIONS
  ======================= */
  const saveFee = async () => {
    if (!feeAmount || feeAmount <= 0) return alert("Invalid fee");

    await api.put(`/fees/billing/${activeBillingId}/amount`, {
      finalFee: Number(feeAmount),
    });

    setSetFeeModalOpen(false);
    setFeeAmount("");
    openStudent(selectedStudent);
  };

  const handlePayFee = async () => {
    if (!payAmount || payAmount <= 0) return alert("Invalid amount");

    await api.post(`/fees/billing/${activeBillingId}/pay`, {
      amount: Number(payAmount),
      mode: payMode,
    });

    setPayModalOpen(false);
    setPayAmount("");
    setPayMode("cash");
    openStudent(selectedStudent);
  };

  const applyDiscount = async () => {
    if (!discountAmount || discountAmount <= 0)
      return alert("Invalid discount");

    await api.put(`/fees/billing/${activeBillingId}/discount`, {
      discountAmount: Number(discountAmount),
    });

    setDiscountModalOpen(false);
    setDiscountAmount("");
    openStudent(selectedStudent);
  };

  const filteredStudents = students.filter((s) =>
    `${s.name} ${s.studentCode}`.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     UI
  ======================= */
  return (
    <PageWrapper>
      {/* SUMMARY */}
      <div className="fee-summary-dashboard">
        <div className="summary-card total">
          <span>Total Fee</span>
          <strong>₹{totals.total}</strong>
        </div>

        <div className="summary-card paid">
          <span>Paid</span>
          <strong>₹{totals.paid}</strong>
        </div>

        <div className="summary-card pending">
          <span>Pending</span>
          <strong>₹{totals.pending}</strong>
        </div>
      </div>

      {/* SEARCH */}
      <div className="student-search">
        <input
          placeholder="Search student by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* STUDENT LIST */}
      <div className="student-list">
        <h3 className="section-title">Students</h3>

        {filteredStudents.map((s) => (
          <div
            key={s._id}
            className={`student-card ${
              selectedStudent?._id === s._id ? "active" : ""
            }`}
            onClick={() => openStudent(s)}
          >
            <div className="student-avatar">
              {s.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="student-info">
              <strong>{s.name}</strong>
              <span>{s.studentCode}</span>
            </div>
          </div>
        ))}
      </div>

      {/* BILLINGS */}
      {selectedStudent && (
        <div className="student-fee-table">
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

                    <td>₹{b.finalFee}</td>
                    <td>₹{b.paidAmount}</td>
                    <td>₹{Math.max(b.finalFee - b.paidAmount, 0)}</td>

                    <td>
                      <span className={`status-badge ${b.status}`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="fee-actions">
                        <button
                          className="btn btn-set"
                          onClick={() => {
                            setActiveBillingId(b._id);
                            setFeeAmount(b.finalFee);
                            setSetFeeModalOpen(true);
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

                        {isAdmin && (
                          <button
                            className="btn btn-discount"
                            onClick={() => {
                              setActiveBillingId(b._id);
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
        </div>
      )}

      {/* ===== SET FEE MODAL ===== */}
      {setFeeModalOpen && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">Set Fee</div>
            <input
              className="fee-input"
              type="number"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
            />
            <div className="payment-modal-footer">
              <button className="btn btn-pay" onClick={saveFee}>
                Save
              </button>
              <button
                className="btn btn-history"
                onClick={() => setSetFeeModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PAY MODAL ===== */}
      {payModalOpen && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">Pay Fee</div>

            <input
              className="fee-input"
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />

            <select
              value={payMode}
              onChange={(e) => setPayMode(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="bank">Bank</option>
            </select>

            <div className="payment-modal-footer">
              <button className="btn btn-pay" onClick={handlePayFee}>
                Confirm
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

      {/* ===== DISCOUNT MODAL ===== */}
      {discountModalOpen && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">Discount</div>
            <input
              className="fee-input"
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            />
            <div className="payment-modal-footer">
              <button className="btn btn-pay" onClick={applyDiscount}>
                Apply
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
        billingId={activeBillingId}
      />
    </PageWrapper>
  );
}
