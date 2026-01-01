import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PaymentHistoryModal from "../components/PaymentHistoryModal";
import PageWrapper from "../components/PageWrapper";
import confetti from "canvas-confetti";

import "../styles/myFee.css";

export default function MyFee() {
  const studentId = localStorage.getItem("userId");

  const [billings, setBillings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeBillingId, setActiveBillingId] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    loadData();
  }, [studentId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const billingRes = await api.get(
        `/fees/student/${studentId}/billing`
      );
      setBillings(billingRes.data.data || []);

      const summaryRes = await api.get(
        `/fees/student/${studentId}/summary`
      );
      setSummary(summaryRes.data.data || null);
    } catch (err) {
      console.error("Failed to load fee data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!summary) return;

    const isFullyPaid =
      summary.totalFee > 0 && summary.paidFee === summary.totalFee;

    const confettiKey = `fee_confetti_${studentId}`;

    if (isFullyPaid && !localStorage.getItem(confettiKey)) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2e7d32", "#66bb6a", "#ffd166"],
      });

      localStorage.setItem(confettiKey, "shown");
    }

    if (!isFullyPaid) {
      localStorage.removeItem(confettiKey);
    }
  }, [summary, studentId]);

  return (
    <PageWrapper>
      <div className="my-fee-container">
        <h2 className="my-fee-title">My Fees</h2>

        {loading && <p className="loading">Loading fee details...</p>}

        {!loading && summary && (
          <div className="fee-summary-dashboard">

            <div className="summary-card total">
              <span>Total Fee</span>
              <strong>₹{summary.totalFee}</strong>
            </div>

            <div className="summary-card paid">
              <span>Paid</span>
              <strong>₹{summary.paidFee}</strong>

              {summary.totalFee > 0 &&
                summary.paidFee === summary.totalFee && (
                  <div className="paid-badge">PAID</div>
                )}

              <div className="circle-wrapper">
                <svg className="progress-ring" width="90" height="90">
                  <circle
                    className="progress-ring-bg"
                    strokeWidth="8"
                    r="38"
                    cx="45"
                    cy="45"
                  />
                  <circle
                    className="progress-ring-fill paid"
                    strokeWidth="8"
                    r="38"
                    cx="45"
                    cy="45"
                    style={{
                      strokeDashoffset:
                        summary.totalFee > 0
                          ? 238 - (summary.paidFee / summary.totalFee) * 238
                          : 238,
                    }}
                  />
                </svg>

                <div className="circle-text">
                  {summary.totalFee > 0
                    ? Math.round(
                        (summary.paidFee / summary.totalFee) * 100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="summary-card pending">
              <span>Pending</span>
              <strong>₹{summary.pendingFee}</strong>

              <div className="circle-wrapper">
                <svg className="progress-ring" width="90" height="90">
                  <circle
                    className="progress-ring-bg"
                    strokeWidth="8"
                    r="38"
                    cx="45"
                    cy="45"
                  />
                  <circle
                    className="progress-ring-fill pending"
                    strokeWidth="8"
                    r="38"
                    cx="45"
                    cy="45"
                    style={{
                      strokeDashoffset:
                        238 -
                        (summary.totalFee
                          ? (summary.pendingFee / summary.totalFee) * 238
                          : 0),
                    }}
                  />
                </svg>

                <div className="circle-text">
                  {summary.totalFee
                    ? Math.round(
                        (summary.pendingFee / summary.totalFee) * 100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && billings.length === 0 && (
          <div className="no-fee">No fee records available yet.</div>
        )}

        {!loading && billings.length > 0 && (
          <div className="fee-table-wrapper">
            <table className="fee-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Fee</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>History</th>
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
                    <td>
                      <span className={`status-badge ${b.status}`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {b.paidAmount > 0 ? (
                        <button
                          className="view-btn"
                          onClick={() => {
                            setActiveBillingId(b._id);
                            setHistoryOpen(true);
                          }}
                        >
                          View
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <PaymentHistoryModal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          billingId={activeBillingId}
        />
      </div>
    </PageWrapper>
  );
}
