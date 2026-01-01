// import React, { useEffect, useState } from "react";
// import {  Navigate } from "react-router-dom";
// import api from "../api/axios";

// import PageWrapper from "../components/PageWrapper";
// import "../styles/dashboardStats.css";

// export default function AdminDashboard() {
// //   const role = localStorage.getItem("role");

//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     leftStudents: 0,
//     totalTrainers: 0,
//   });

//   const [feeSummary, setFeeSummary] = useState({
//     total: 0,
//     received: 0,
//     pending: 0,
//   });

//   const [plan, setPlan] = useState(null);

//   /* =======================
//      LOAD DASHBOARD DATA
//   ======================= */
//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         const active = await api.get(
//           `/dashboard/students/active`
//         );
//         const left = await api.get(`/dashboard/students/left`);
//         const trainers = await api.get(`/dashboard/trainers`);

//         setStats({
//           totalStudents: active.data.count,
//           leftStudents: left.data.count,
//           totalTrainers: trainers.data.count,
//         });

//         // 🔐 ADMIN ONLY
//         if (role === "academyAdmin") {
//           const planRes = await api.get(
//             `/dashboard/subscription-info`
//           );
//           setPlan(planRes.data);
//         }

//         // 💰 FEE SUMMARY (admin + teacher)
//         const feeRes = await api.get(`/fees/summary`);
//         setFeeSummary(feeRes.data);
//       } catch (err) {
//         console.error("Dashboard loading error:", err);
//       }
//     };

//     loadStats();
//   }, [academyCode, role]);

//   /* =======================
//      ROLE GUARD (AFTER HOOKS)
//   ======================= */
//   if (role !== "academyAdmin") {
//     return <Navigate to={`/login`} replace />;
//   }

//   return (
//     // <PageWrapper>
//     //   {/* <div className="dashboard-stats-container"> */}


//     //     <div className="dashboard-fee-summary">
//     //       <div className="stat-card">
//     //         <span>Total Fees</span>
//     //         <strong>₹{feeSummary.total}</strong>
//     //       </div>

//     //       <div className="stat-card">
//     //         <span>Received</span>
//     //         <strong>₹{feeSummary.received}</strong>
//     //       </div>

//     //       <div className="stat-card">
//     //         <span>Pending</span>
//     //         <strong>₹{feeSummary.pending}</strong>
//     //       </div>
//     //     {/* </div> */}

//     //     {/* ===== BASIC STATS ===== */}
//     //     <div className="stat-card">
//     //       <h3>{stats.totalStudents}</h3>
//     //       <p>Active Students</p>
//     //     </div>

//     //     <div className="stat-card warning">
//     //       <h3>{stats.leftStudents}</h3>
//     //       <p>Left Students</p>
//     //     </div>

//     //     <div className="stat-card success">
//     //       <h3>{stats.totalTrainers}</h3>
//     //       <p>Total Trainers</p>
//     //     </div>

//     //     {/* ===== SUBSCRIPTION PLAN ===== */}
//     //     {plan && (
//     //       <div className="stat-card plan">
//     //         <h3>
//     //           {plan.remaining} / {plan.maxStudents}
//     //         </h3>
//     //         <p>Remaining Student Slots</p>

//     //         {/* PROGRESS BAR */}
//     //         <div className="plan-bar">
//     //           <div
//     //             className="plan-bar-fill"
//     //             style={{
//     //               width: `${plan.usagePercent}%`,
//     //               background: plan.usagePercent >= 90 ? "#ef4444" : "#22c55e",
//     //             }}
//     //           />
//     //         </div>

//     //         <small>
//     //           {plan.usagePercent}% used · Expires on{" "}
//     //           {new Date(plan.expiryDate).toLocaleDateString()}
//     //         </small>

//     //         {plan.showWarning && (
//     //           <div className="plan-warning">
//     //             ⚠️ You are close to your student limit. Consider upgrading.
//     //           </div>
//     //         )}
//     //       </div>
//     //     )}
//     //   </div>
//     // </PageWrapper>

//     <PageWrapper>
//   <div className="dashboard-stats-container">

//     {/* ===== FEE SUMMARY ===== */}
//     <div className="stat-card fee total">
//       <span>Total Fees</span>
//       <h3>₹{feeSummary.total}</h3>
//     </div>

//     <div className="stat-card fee success">
//       <span>Received</span>
//       <h3>₹{feeSummary.received}</h3>
//     </div>

//     <div className="stat-card fee warning">
//       <span>Pending</span>
//       <h3>₹{feeSummary.pending}</h3>
//     </div>
//     {/* ===== BASIC STATS ===== */}
//     <div className="stat-card">
//       <h3>{stats.totalStudents}</h3>
//       <p>Active Students</p>
//     </div>

//     <div className="stat-card warning">
//       <h3>{stats.leftStudents}</h3>
//       <p>Left Students</p>
//     </div>

//     <div className="stat-card success">
//       <h3>{stats.totalTrainers}</h3>
//       <p>Total Trainers</p>
//     </div>

//     {/* ===== SUBSCRIPTION PLAN ===== */}
//     {plan && (
//       <div className="stat-card plan">
//         <h3>
//           {plan.remaining} / {plan.maxStudents}
//         </h3>
//         <p>Remaining Student Slots</p>

//         <div className="plan-bar">
//           <div
//             className="plan-bar-fill"
//             style={{
//               width: `${plan.usagePercent}%`,
//               background: plan.usagePercent >= 90 ? "#ef4444" : "#22c55e",
//             }}
//           />
//         </div>

//         <small>
//           {plan.usagePercent}% used · Expires on{" "}
//           {new Date(plan.expiryDate).toLocaleDateString()}
//         </small>

//         {plan.showWarning && (
//           <div className="plan-warning">
//             ⚠️ You are close to your student limit. Consider upgrading.
//           </div>
//         )}
//       </div>
//     )}

//   </div>
// </PageWrapper>

//   );
// }





// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import "../styles/dashboardStats.css";

export default function AdminDashboard() {
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    totalStudents: 0,
    leftStudents: 0,
    totalTrainers: 0,
  });

  const [feeSummary, setFeeSummary] = useState({
    total: 0,
    received: 0,
    pending: 0,
  });

  const [plan, setPlan] = useState(null);

  /* =======================
     LOAD DASHBOARD DATA
  ======================= */
  useEffect(() => {
    async function loadStats() {
      try {
        const active = await api.get("/dashboard/students/active");
        const left = await api.get("/dashboard/students/left");
        const trainers = await api.get("/dashboard/trainers");

        setStats({
          totalStudents: active.data.count,
          leftStudents: left.data.count,
          totalTrainers: trainers.data.count,
        });

        // 🔐 ADMIN ONLY
        if (role === "academyAdmin") {
          const planRes = await api.get("/dashboard/subscription-info");
          setPlan(planRes.data);
        }

        // 💰 FEE SUMMARY
        const feeRes = await api.get("/fees/summary");
        setFeeSummary(feeRes.data);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      }
    }

    loadStats();
  }, [role]);

  return (
    <PageWrapper>
      <div className="dashboard-stats-container">

        {/* ===== FEE SUMMARY ===== */}
        <div className="stat-card fee total">
          <span>Total Fees</span>
          <h3>₹{feeSummary.total}</h3>
        </div>

        <div className="stat-card fee success">
          <span>Received</span>
          <h3>₹{feeSummary.received}</h3>
        </div>

        <div className="stat-card fee warning">
          <span>Pending</span>
          <h3>₹{feeSummary.pending}</h3>
        </div>

        {/* ===== BASIC STATS ===== */}
        <div className="stat-card">
          <h3>{stats.totalStudents}</h3>
          <p>Active Students</p>
        </div>

        <div className="stat-card warning">
          <h3>{stats.leftStudents}</h3>
          <p>Left Students</p>
        </div>

        <div className="stat-card success">
          <h3>{stats.totalTrainers}</h3>
          <p>Total Trainers</p>
        </div>

        {/* ===== SUBSCRIPTION PLAN ===== */}
        {plan && (
          <div className="stat-card plan">
            <h3>
              {plan.remaining} / {plan.maxStudents}
            </h3>
            <p>Remaining Student Slots</p>

            <div className="plan-bar">
              <div
                className="plan-bar-fill"
                style={{
                  width: `${plan.usagePercent}%`,
                  background:
                    plan.usagePercent >= 90 ? "#ef4444" : "#22c55e",
                }}
              />
            </div>

            <small>
              {plan.usagePercent}% used · Expires on{" "}
              {new Date(plan.expiryDate).toLocaleDateString()}
            </small>

            {plan.showWarning && (
              <div className="plan-warning">
                ⚠️ You are close to your student limit. Consider upgrading.
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
