import React, { useState } from "react";
import api from "../api/axios";

import { useParams } from "react-router-dom";

import "../styles/paymentModal.css";

export default function PaymentModal({ fee, onClose, onSuccess }) {

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("cash");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount) return alert("Enter amount");

    setLoading(true);
    try {
      await api.post(
        `/fees/pay/${fee._id}`,
        { amount: Number(amount), mode }
      );

      alert("Payment recorded");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Pay Fee</h3>

        <p><strong>Student:</strong> {fee.studentId?.name}</p>
        <p><strong>Pending:</strong> ₹{fee.pendingFee}</p>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
          <option value="bank">Bank</option>
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} disabled={loading}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
