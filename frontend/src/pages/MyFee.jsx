import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../styles/myFee.css";

export default function MyFee() {
  const { academyCode } = useParams();
  const studentId = localStorage.getItem("userId");

  const [fee, setFee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    loadMyFee();
  }, [academyCode, studentId]);

  const loadMyFee = async () => {
    try {
      setLoading(true);

      // ✅ STUDENT-ONLY API
      const res = await axios.get(
        `/${academyCode}/fees/student/${studentId}`
      );

      const feeData = res.data.data;
      setFee(feeData);

      if (feeData?._id) {
        loadHistory(feeData._id);
      }
    } catch (err) {
      console.error("Load my fee error:", err);
      setFee(null);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (studentFeeId) => {
    try {
      const res = await axios.get(
        `/${academyCode}/fees/history/${studentFeeId}`
      );
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  if (loading) {
    return <PageWrapper>Loading fee details...</PageWrapper>;
  }

if (!fee) {
  return (
    <PageWrapper>
      <div className="no-fee">No fee assigned yet.</div>
    </PageWrapper>
  );
}


    return (
  <PageWrapper>
    <div className="my-fee-container">

      <h2 className="my-fee-title">My Fee Details</h2>

      {/* Fee Summary */}
      <div className="fee-summary">
        <div className="fee-box fee-total">
          <span>Total Fee</span>
          <strong>₹{fee.totalFee}</strong>
        </div>

        <div className="fee-box fee-paid">
          <span>Paid</span>
          <strong>₹{fee.paidFee}</strong>
        </div>

        <div className="fee-box fee-pending">
          <span>Pending</span>
          <strong>₹{fee.pendingFee}</strong>
        </div>
      </div>

      {/* Payment History */}
      <h3 className="history-title">Payment History</h3>

      {history.length === 0 && (
        <div className="no-fee">No payments made yet.</div>
      )}

      <div className="history-list">
        {history.map((h) => (
          <div key={h._id} className="history-item">
            <div className="history-left">
              <strong>₹{h.amount}</strong>
              <small>{h.month}</small>
            </div>

            <div className="history-right">
              <div>Mode: {h.mode}</div>
              <div>{new Date(h.date).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </PageWrapper>

  );
}
