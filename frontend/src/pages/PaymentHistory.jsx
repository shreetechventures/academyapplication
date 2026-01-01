import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function PaymentHistory({ studentFeeId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!studentFeeId) return;

    (async () => {
      const res = await api.get(`/fees/history/${studentFeeId}`);
      setHistory(res.data.data || []);
    })();
  }, [studentFeeId]);

  return (
    <div>
      <h4>Payment History</h4>

      {history.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        history.map((h) => (
          <div key={h._id}>
            ₹{h.amount} —{" "}
            {h.month || new Date(h.date).toLocaleDateString()} —{" "}
            {h.mode}
          </div>
        ))
      )}
    </div>
  );
}
