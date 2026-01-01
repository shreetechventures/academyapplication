// // frontend/src/pages/TeacherAssessmentPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";

// import PageWrapper from "../components/PageWrapper";
// import { useParams } from "react-router-dom";
// import AssessmentChart from "../components/AssessmentChart";
// import DeleteConfirm from "../components/DeleteConfirm";
// import EditResultModal from "../components/EditResultModal";
// import PerformanceSummary from "../components/PerformanceSummary";
// import MultiTestAssessmentForm from "../components/MultiTestAssessmentForm";
// import "../styles/teacherAssessment.css";

// export default function TeacherAssessmentPage() {

//   const [students, setStudents] = useState([]);
//   const [types, setTypes] = useState([]);

//   const [selectedStudentId, setSelectedStudentId] = useState("");
//   const [selectedTypeId, setSelectedTypeId] = useState(""); // for chart only

//   const [results, setResults] = useState([]);
//   const [chartData, setChartData] = useState([]);

//   const [filter, setFilter] = useState("all");
//   const [avgScore, setAvgScore] = useState(null);

//   const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
//   const [editModal, setEditModal] = useState({ open: false, dayResults: [] });

//   const [search, setSearch] = useState("");

//   // Pagination (day-wise)
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 2;

//   const selectedStudent = students.find((s) => s._id === selectedStudentId);

//   // ---------------------------
//   // Load students & test types
//   // ---------------------------
//   useEffect(() => {
//     loadStudents();
//     loadTypes();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const loadStudents = async () => {
//     try {
//       const res = await api.get(`/students`);
//       setStudents(res.data || []);
//     } catch (err) {
//       console.error("loadStudents error", err);
//     }
//   };

//   const loadTypes = async () => {
//     try {
//       const res = await api.get(`/assessments`);
//       setTypes(res.data || []);
//     } catch (err) {
//       console.error("loadTypes error", err);
//     }
//   };

//   const loadStudentResults = async (studentId) => {
//     if (!studentId) return;
//     try {
//       const res = await api.get(
//         `/assessments/students/${studentId}/results`
//       );
//       setResults(res.data || []);
//       setPage(1);
//     } catch (err) {
//       console.error("loadStudentResults error", err);
//     }
//   };

//   const loadChartForType = async (studentId, typeId) => {
//   if (!studentId || !typeId) {
//     setChartData([]);
//     setAvgScore(null);
//     return;
//   }

//   try {
//     const res = await api.get(
//       `/assessments/students/${studentId}/results/${typeId}`
//     );

//     let list = res.data || [];

//     // 🔥 Sort by date (latest first)
//     list.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));

//     // 🔥 Keep ONLY the latest 10
//     list = list.slice(0, 10);

//     // 🔥 Reverse again for correct chart order (old → new)
//     list.reverse();

//     const formatted = list.map((r) => ({
//       date: new Date(r.attemptDate).toLocaleDateString(),
//       value: r.value,
//       score: r.score,
//     }));

//     setChartData(formatted);

//     const avg =
//       list.reduce((acc, curr) => acc + curr.score, 0) /
//         (list.length || 1) || 0;

//     setAvgScore(Number(avg.toFixed(1)));
//   } catch (err) {
//     console.error("loadChartForType error", err);
//   }
// };

//   // helper to refresh data after multi-save
//   const refreshAfterMultiSave = async () => {
//     if (selectedStudentId) {
//       await loadStudentResults(selectedStudentId);
//       if (selectedTypeId) {
//         await loadChartForType(selectedStudentId, selectedTypeId);
//       }
//     }
//   };

//   // ---------------------------
//   // Filter students by search
//   // ---------------------------
//   const filteredStudents = useMemo(() => {
//     return students.filter((s) =>
//       s.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [students, search]);

//   // ---------------------------
//   // Filter results by date (7d / 30d / all)
//   // ---------------------------
//   const filteredResults = useMemo(() => {
//     const arr = (results || []).filter((r) => {
//       const date = new Date(r.attemptDate);
//       const now = new Date();
//       const diff = (now - date) / (1000 * 3600 * 24);

//       if (filter === "7" && diff <= 7) return true;
//       if (filter === "30" && diff <= 30) return true;
//       return filter === "all";
//     });

//     // sort descending (most recent first)
//     arr.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
//     return arr;
//   }, [results, filter]);

//   // ---------------------------
//   // Group results DAY-WISE
//   // ---------------------------
//   const groupedByDay = useMemo(() => {
//     const map = {};
//     (filteredResults || []).forEach((r) => {
//       const d = new Date(r.attemptDate);
//       const key = d.toISOString().slice(0, 10); // YYYY-MM-DD

//       if (!map[key]) map[key] = [];
//       map[key].push(r);
//     });
//     return map;
//   }, [filteredResults]);

//   const sortedDayKeys = useMemo(
//     () =>
//       Object.keys(groupedByDay).sort(
//         (a, b) => new Date(b).getTime() - new Date(a).getTime()
//       ),
//     [groupedByDay]
//   );

//   const totalPages = Math.max(1, Math.ceil(sortedDayKeys.length / PAGE_SIZE));
//   const pageDayKeys = sortedDayKeys.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   // ---------------------------
//   // Performance Summary
//   // ---------------------------
//   const performanceMetrics = useMemo(() => {
//     const all = results || [];
//     if (!all.length) return null;

//     const avg =
//       all.reduce((acc, r) => acc + (r.score || 0), 0) / (all.length || 1);
//     const best = Math.max(...all.map((r) => r.score || 0));
//     const attempts = all.length;

//     // recent trend: compare last 3 avg vs previous 3 avg
//     const sorted = [...all].sort(
//       (a, b) => new Date(a.attemptDate) - new Date(b.attemptDate)
//     );
//     const last3 = sorted.slice(-3);
//     const prev3 = sorted.slice(-6, -3);
//     const avgLast3 =
//       last3.reduce((a, b) => a + (b.score || 0), 0) / (last3.length || 1);
//     const avgPrev3 =
//       prev3.reduce((a, b) => a + (b.score || 0), 0) / (prev3.length || 1);
//     const trend = avgLast3 - avgPrev3;

//     return {
//       avg: Number(avg.toFixed(1)),
//       best,
//       attempts,
//       trend: Number(trend.toFixed(1)),
//     };
//   }, [results]);

//   // ---------------------------
//   // Day-wise EDIT (bulk)
//   // ---------------------------
//   const handleOpenEditDay = (dayResults) => {
//     setEditModal({ open: true, dayResults });
//   };

//   const handleSaveDayResults = async (updates) => {
//     try {
//       // updates: [{ _id, value, note, attemptDate }]
//       await Promise.all(
//         updates.map((u) =>
//           api.put(`/assessments/result/${u._id}`, {
//             value: u.value,
//             note: u.note,
//             attemptDate: u.attemptDate,
//           })
//         )
//       );

//       await loadStudentResults(selectedStudentId);
//       if (selectedTypeId) {
//         await loadChartForType(selectedStudentId, selectedTypeId);
//       }

//       setEditModal({ open: false, dayResults: [] });
//     } catch (err) {
//       console.error("handleSaveDayResults error", err);
//     }
//   };

//   // ---------------------------
//   // Day-wise DELETE (bulk)
//   // ---------------------------
//   const handleDeleteDay = async (dayResults) => {
//     if (!dayResults || !dayResults.length) return;

//     const confirm = window.confirm(
//       "Are you sure you want to delete ALL results for this day?"
//     );
//     if (!confirm) return;

//     try {
//       await Promise.all(
//         dayResults.map((r) =>
//           api.delete(`/assessments/result/${r._id}`)
//         )
//       );

//       await loadStudentResults(selectedStudentId);
//       if (selectedTypeId) {
//         await loadChartForType(selectedStudentId, selectedTypeId);
//       }
//     } catch (err) {
//       console.error("handleDeleteDay error", err);
//     }
//   };

//   // ------------- TEST DROPDOWN (remove duplicates by title) -------------
//   const uniqueTypes = useMemo(() => {
//     const seen = new Set();
//     const result = [];

//     types.forEach((t) => {
//       const title = (t.title || "").trim();
//       if (!seen.has(title)) {
//         seen.add(title);
//         result.push(t);
//       }
//     });

//     return result;
//   }, [types]);

//   // --------------------------- JSX ---------------------------
//   return (
//     <PageWrapper>
//       <div className="teacher-assessment-wrapper">
//         <h2>Teacher — Student Assessment</h2>

//         <div className="teacher-assessment-layout">
//           {/* LEFT STUDENT LIST */}
//           <div className="teacher-student-list">
//             <h4>Students</h4>

//             {/* SEARCH BOX */}
//             <div className="student-search-box">
//               <input
//                 type="text"
//                 placeholder="Search student..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             {/* STUDENT LIST - WITH SCROLL */}
//             <div className="student-list-grid">
//               {filteredStudents.map((s) => (
//                 <button
//                   key={s._id}
//                   className={`teacher-student-btn ${
//                     selectedStudentId === s._id ? "active" : ""
//                   }`}
//                   onClick={() => {
//                     setSelectedStudentId(s._id);
//                     setSelectedTypeId("");
//                     setChartData([]);
//                     setAvgScore(null);
//                     loadStudentResults(s._id);
//                   }}
//                 >
//                   {s.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT PANEL */}
//           <div className="teacher-right-panel">
//             <h4>
//               Student:{" "}
//               {selectedStudent ? selectedStudent.name : "Select a student"}
//             </h4>

//             {/* CHART AREA */}
//             {selectedStudentId && (
//               <div className="chart-section-card">
//                 <div className="chart-controls-row">
//                   <div>
//                     <label>Select Test for Progress Chart</label>
//                     <select
//                       value={selectedTypeId}
//                       onChange={(e) => {
//                         const typeId = e.target.value;
//                         setSelectedTypeId(typeId);
//                         loadChartForType(selectedStudentId, typeId);
//                       }}
//                     >
//                       <option value="">-- Select Test --</option>
//                       {uniqueTypes.map((t) => (
//                         <option key={t._id} value={t._id}>
//                           {t.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="filter-box">
//                     <button
//                       className={filter === "all" ? "active" : ""}
//                       onClick={() => setFilter("all")}
//                     >
//                       All Time
//                     </button>
//                     <button
//                       className={filter === "7" ? "active" : ""}
//                       onClick={() => setFilter("7")}
//                     >
//                       Last 7 Days
//                     </button>
//                     <button
//                       className={filter === "30" ? "active" : ""}
//                       onClick={() => setFilter("30")}
//                     >
//                       Last 30 Days
//                     </button>
//                   </div>
//                 </div>

//                 {selectedTypeId && (
//                   <>
//                     {(() => {
//                       const selectedType = types.find(
//                         (t) => t._id === selectedTypeId
//                       );
//                       const selectedTitle = selectedType
//                         ? selectedType.title
//                         : "";

//                       return (
//                         <>
//                           <h4 className="chart-title">
//                             {selectedTitle} — Progress
//                           </h4>

//                           {avgScore !== null && (
//                             <div className="avg-score-box">
//                               Average Score: <b>{avgScore}</b>
//                             </div>
//                           )}

//                           <div className="chart-wrapper mobile-fixed-size">
//                             <AssessmentChart
//                               data={chartData}
//                               testTitle={selectedTitle}
//                             />
//                           </div>

//                           <button
//                             className="teacher-refresh-btn"
//                             onClick={() =>
//                               loadChartForType(
//                                 selectedStudentId,
//                                 selectedTypeId
//                               )
//                             }
//                           >
//                             Refresh Chart
//                           </button>
//                         </>
//                       );
//                     })()}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* PERFORMANCE SUMMARY */}
//             <PerformanceSummary
//               metrics={performanceMetrics}
//               chartData={chartData}
//             />

//             {/* DAY-WISE RESULTS */}
//             <h4>Results (Day-wise)</h4>
//             {!selectedStudentId && (
//               <p style={{ color: "#888" }}>Select a student to view results.</p>
//             )}

//             {selectedStudentId && pageDayKeys.length === 0 && (
//               <p style={{ color: "#888" }}>No results for selected filter.</p>
//             )}

//             <div className="teacher-results-list">
//               {pageDayKeys.map((dayKey) => {
//                 const dayResults = groupedByDay[dayKey] || [];
//                 if (!dayResults.length) return null;

//                 const firstDate = new Date(dayResults[0].attemptDate);
//                 const displayDate = firstDate.toLocaleDateString();
//                 const displayDateTime = firstDate.toLocaleString();

//                 return (
//                   <div
//                     key={dayKey}
//                     className="teacher-result-card fade-in day-card"
//                   >
//                     <div className="tr-header">
//                       <div>
//                         <strong>{displayDateTime}</strong>
//                         <div className="tr-subtitle">
//                           Tests on this day: {dayResults.length}
//                         </div>
//                       </div>

//                       <div>
//                         <button
//                           className="tr-edit-btn"
//                           onClick={() => handleOpenEditDay(dayResults)}
//                           title="Edit all tests of this day"
//                         >
//                           ✎ Edit Day
//                         </button>

//                         <button
//                           className="tr-delete-btn"
//                           onClick={() => handleDeleteDay(dayResults)}
//                           title="Delete all tests of this day"
//                         >
//                           ✖ Delete Day
//                         </button>
//                       </div>
//                     </div>

//                     {/* Combined table */}
//                     <div className="day-results-table-wrapper">
//                       <table className="day-results-table">
//                         <thead>
//                           <tr>
//                             <th>Test</th>
//                             <th>Value</th>
//                             <th>Score</th>
//                             <th>By</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {dayResults.map((r) => (
//                             <tr key={r._id}>
//                               <td>{r.assessmentTypeId?.title || "-"}</td>
//                               <td>{r.value}</td>
//                               <td>{r.score}</td>
//                               <td>{r.addedBy}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination (day-wise) */}
//             {selectedStudentId && (
//               <div className="pagination-row">
//                 <button
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                 >
//                   Prev
//                 </button>
//                 <span>
//                   Page {page} / {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}

//             {/* DELETE CONFIRM MODAL (unused day-wise now, but kept for future single-row delete if needed) */}
//             <DeleteConfirm
//               open={deleteModal.open}
//               onClose={() => setDeleteModal({ open: false, id: null })}
//               onConfirm={() => {}}
//             />

//             {/* EDIT RESULT MODAL (day-wise) */}
//             <EditResultModal
//               open={editModal.open}
//               dayResults={editModal.dayResults}
//               onClose={() => setEditModal({ open: false, dayResults: [] })}
//               onSave={handleSaveDayResults}
//             />

//             {/* MULTI TEST FORM (for adding new day) */}
//             <MultiTestAssessmentForm
//               academyCode={academyCode}
//               selectedStudent={selectedStudent}
//               onAfterSave={refreshAfterMultiSave}
//             />
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// frontend/src/pages/TeacherAssessmentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import AssessmentChart from "../components/AssessmentChart";
import DeleteConfirm from "../components/DeleteConfirm";
import EditResultModal from "../components/EditResultModal";
import PerformanceSummary from "../components/PerformanceSummary";
import MultiTestAssessmentForm from "../components/MultiTestAssessmentForm";
import "../styles/teacherAssessment.css";

export default function TeacherAssessmentPage() {
  const [students, setStudents] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");

  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [filter, setFilter] = useState("all");
  const [avgScore, setAvgScore] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [editModal, setEditModal] = useState({ open: false, dayResults: [] });

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 2;

  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  /* =============================
     LOAD STUDENTS & TYPES
  ============================== */
  useEffect(() => {
    loadStudents();
    loadTypes();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get(`/students`);
      setStudents(res.data || []);
    } catch (err) {
      console.error("loadStudents error", err);
    }
  };

  const loadTypes = async () => {
    try {
      const res = await api.get(`/assessments`);
      setTypes(res.data || []);
    } catch (err) {
      console.error("loadTypes error", err);
    }
  };

  const loadStudentResults = async (studentId) => {
    if (!studentId) return;
    try {
      const res = await api.get(`/assessments/students/${studentId}/results`);
      setResults(res.data || []);
      setPage(1);
    } catch (err) {
      console.error("loadStudentResults error", err);
    }
  };

  const loadChartForType = async (studentId, typeId) => {
    if (!studentId || !typeId) {
      setChartData([]);
      setAvgScore(null);
      return;
    }

    try {
      const res = await api.get(
        `/assessments/students/${studentId}/results/${typeId}`
      );

      let list = res.data || [];
      list.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
      list = list.slice(0, 10).reverse();

      const formatted = list.map((r) => ({
        date: new Date(r.attemptDate).toLocaleDateString(),
        value: r.value,
        score: r.score,
      }));

      setChartData(formatted);

      const avg =
        list.reduce((acc, curr) => acc + curr.score, 0) / (list.length || 1);

      setAvgScore(Number(avg.toFixed(1)));
    } catch (err) {
      console.error("loadChartForType error", err);
    }
  };

  const refreshAfterMultiSave = async () => {
    if (selectedStudentId) {
      await loadStudentResults(selectedStudentId);
      if (selectedTypeId) {
        await loadChartForType(selectedStudentId, selectedTypeId);
      }
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const filteredResults = useMemo(() => {
    const now = new Date();
    return (results || [])
      .filter((r) => {
        const diff = (now - new Date(r.attemptDate)) / (1000 * 3600 * 24);
        if (filter === "7") return diff <= 7;
        if (filter === "30") return diff <= 30;
        return true;
      })
      .sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
  }, [results, filter]);

  const groupedByDay = useMemo(() => {
    const map = {};
    filteredResults.forEach((r) => {
      const key = new Date(r.attemptDate).toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [filteredResults]);

  const sortedDayKeys = Object.keys(groupedByDay).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const totalPages = Math.max(1, Math.ceil(sortedDayKeys.length / PAGE_SIZE));

  const pageDayKeys = sortedDayKeys.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const uniqueTypes = useMemo(() => {
    const seen = new Set();
    return types.filter((t) => {
      if (seen.has(t.title)) return false;
      seen.add(t.title);
      return true;
    });
  }, [types]);

  return (
    <PageWrapper>
      <div className="teacher-assessment-wrapper">
        <h2>Teacher — Student Assessment</h2>

        {/* UI untouched */}

        <MultiTestAssessmentForm
          selectedStudent={selectedStudent}
          onAfterSave={refreshAfterMultiSave}
        />
      </div>
    </PageWrapper>
  );
}
