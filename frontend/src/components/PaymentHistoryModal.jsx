import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/paymentModal.css";

export default function PaymentHistoryModal({
  open,
  onClose,
  academyCode,
  billingId
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && billingId) {
      loadHistory();
    }
  }, [open, billingId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/${academyCode}/fees/billing/${billingId}/history`
      );
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          Fee History
        </div>

        <div className="payment-modal-body">
          {loading ? (
            <p>Loading...</p>
          ) : history.length === 0 ? (
            <p>No history available.</p>
          ) : (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Mode / Note</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => {
                  const isDiscount = h.type === "discount";

                  return (
                    <tr key={h._id}>
                      <td>
                        {new Date(h.createdAt).toLocaleDateString()}{" "}
                        {new Date(h.createdAt).toLocaleTimeString()}
                      </td>

                      <td>
                        {isDiscount ? (
                          <span style={{ color: "#ff9800", fontWeight: 600 }}>
                            Discount
                          </span>
                        ) : (
                          <span style={{ color: "green", fontWeight: 600 }}>
                            Payment
                          </span>
                        )}
                      </td>

                      <td>
                        {isDiscount ? (
                          <span style={{ color: "#ff9800" }}>
                            -₹{h.amount}
                          </span>
                        ) : (
                          <span>₹{h.amount}</span>
                        )}
                      </td>

                      <td>
                        {isDiscount
                          ? h.note || "Discount applied"
                          : h.mode}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="payment-modal-footer">
          <button className="payment-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
