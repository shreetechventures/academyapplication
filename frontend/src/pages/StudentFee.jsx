import React, { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import PaymentModal from "../components/PaymentModal";

import "../styles/studentFeeList.css";

export default function StudentFee() {
  const { academyCode } = useParams();

  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFee, setSelectedFee] = useState(null);

  useEffect(() => {
    loadFees();
  }, [academyCode]);

  const loadFees = async () => {
    const res = await axios.get(`/${academyCode}/fees/all`);
    setFees(res.data.data || []);
  };

  // ===============================
  // 🔍 SEARCH FILTER
  // ===============================
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const name = f.studentId?.name?.toLowerCase() || "";
      const cls = f.studentId?.className?.toLowerCase() || "";
      return (
        name.includes(search.toLowerCase()) ||
        cls.includes(search.toLowerCase())
      );
    });
  }, [fees, search]);

  // ===============================
  // 📊 TOTAL CALCULATIONS
  // ===============================
  const totalPaid = useMemo(
    () => filteredFees.reduce((sum, f) => sum + (f.paidFee || 0), 0),
    [filteredFees]
  );

  const totalPending = useMemo(
    () => filteredFees.reduce((sum, f) => sum + (f.pendingFee || 0), 0),
    [filteredFees]
  );

  return (
    <PageWrapper>
      <h2>Student Fees</h2>

      {/* ===============================
          SUMMARY BOX
      ================================ */}
      <div className="fee-summary-admin">
        <div className="summary-box paid">
          <span>Total Paid</span>
          <strong>₹{totalPaid}</strong>
        </div>

        <div className="summary-box pending">
          <span>Total Pending</span>
          <strong>₹{totalPending}</strong>
        </div>
      </div>

      {/* ===============================
          SEARCH
      ================================ */}
      <input
        type="text"
        placeholder="Search student name or class..."
        className="fee-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ===============================
          TABLE
      ================================ */}
      <table className="fee-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Pending</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredFees.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                No students found
              </td>
            </tr>
          )}

          {filteredFees.map((f) => (
            <tr key={f._id}>
              <td>
                {f.studentId?.name}
                <br />
                <small>{f.studentId?.className}</small>
              </td>
              <td>₹{f.totalFee}</td>
              <td>₹{f.paidFee}</td>
              <td className={f.pendingFee > 0 ? "pending" : "paid"}>
                ₹{f.pendingFee}
              </td>
              <td>
                {f.pendingFee > 0 && (
                  <button
                    className="pay-btn"
                    onClick={() => setSelectedFee(f)}
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===============================
          PAY MODAL
      ================================ */}
      {selectedFee && (
        <PaymentModal
          fee={selectedFee}
          onClose={() => setSelectedFee(null)}
          onSuccess={loadFees}
        />
      )}
    </PageWrapper>
  );
}
