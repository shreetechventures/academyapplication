// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import PageWrapper from "../components/PageWrapper";
// import { useParams } from "react-router-dom";
// import AssessmentChart from "../components/AssessmentChart";
// import "../styles/teacherAssessment.css";

// export default function TeacherAssessmentPage() {
//   const { academyCode } = useParams();

//   const [students, setStudents] = useState([]);
//   const [types, setTypes] = useState([]);

//   // store IDs only
//   const [selectedStudentId, setSelectedStudentId] = useState("");
//   const [selectedTypeId, setSelectedTypeId] = useState("");

//   const [value, setValue] = useState("");
//   const [note, setNote] = useState("");

//   const [results, setResults] = useState([]);
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     loadStudents();
//     loadTypes();
//   }, []);

//   const loadStudents = async () => {
//     const res = await axios.get(`/api/${academyCode}/students`);
//     setStudents(res.data);
//   };

//   const loadTypes = async () => {
//     const res = await axios.get(`/api/${academyCode}/assessments`);
//     setTypes(res.data);
//   };

//   const loadStudentResults = async (studentId) => {
//     if (!studentId) return;
//     const res = await axios.get(
//       `/api/${academyCode}/assessments/students/${studentId}/results`
//     );
//     setResults(res.data);
//   };

//   const loadChartForType = async (studentId, typeId) => {
//     if (!studentId || !typeId) return;
//     const res = await axios.get(
//       `/api/${academyCode}/assessments/students/${studentId}/results/${typeId}`
//     );

//     const formatted = res.data.map((r) => ({
//       date: new Date(r.attemptDate).toLocaleDateString(),
//       value: r.value,
//       score: r.score,
//     }));

//     setChartData(formatted);
//   };

//   const submitResult = async () => {
//     if (!selectedStudentId || !selectedTypeId || value === "") {
//       alert("❌ Select student, test and enter value");
//       return;
//     }

//     await axios.post(`/api/${academyCode}/assessments/results`, {
//       studentId: selectedStudentId,
//       assessmentTypeId: selectedTypeId,
//       value: Number(value),
//       note,
//     });

//     await loadStudentResults(selectedStudentId);
//     await loadChartForType(selectedStudentId, selectedTypeId);

//     setValue("");
//     setNote("");
//   };

//   return (
//     <PageWrapper>
// <div className="teacher-assessment-wrapper">
//         <h2>Teacher — Student Assessment</h2>

// <div className="teacher-assessment-layout">
//           {/* LEFT SIDEBAR: Student List */}
// <div className="teacher-student-list">
//             <h4>Students</h4>

//             <div style={{ display: "grid", gap: 8 }}>
//               {students.map((s) => (
// <button
//   className={`teacher-student-btn ${selectedStudentId === s._id ? "active" : ""}`}

//                   onClick={() => {
//                     setSelectedStudentId(s._id);
//                     loadStudentResults(s._id);
//                   }}
//                 >
//                   {s.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
// <div className="teacher-right-panel">
//             <h4>
//               Enter Result for{" "}
//               {students.find((x) => x._id === selectedStudentId)?.name || ""}
//             </h4>

// <div className="teacher-input-row">

//               {/* TEST dropdown */}
//               <select
//                 value={selectedTypeId}
//                 onChange={(e) => {
//                   setSelectedTypeId(e.target.value);
//                   loadChartForType(selectedStudentId, e.target.value);
//                 }}
//               >
//                 <option value="">Select Test</option>
//                 {types.map((t) => (
//                   <option key={t._id} value={t._id}>
//                     {t.title}
//                   </option>
//                 ))}
//               </select>

//               {/* Value */}
//               <input
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//                 placeholder="Value (seconds/meters/count)"
//               />

//               {/* Save */}
// <button className="teacher-save-btn" onClick={submitResult}>
//   Save Result
// </button>
//             </div>

//             {/* RESULTS LIST */}
//             <div style={{ marginTop: 12 }}>
//               <h4>Results</h4>
//               <div>
//                 {results.map((r) => (
// <div className="teacher-result-card">

//                     <div>{new Date(r.attemptDate).toLocaleString()}</div>
//                     <div>Test: {r.assessmentTypeId?.title}</div>
//                     <div>Value: {r.value}</div>
//                     <div>Score: {r.score}</div>
//                     <div>By: {r.addedBy}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* CHART */}
//             {selectedStudentId && selectedTypeId && (
//               <>
//                 <h4 style={{ marginTop: 12 }}>
//                   {
//                     types.find((t) => t._id === selectedTypeId)?.title
//                   }{" "}
//                   — Progress
//                 </h4>

//                 <AssessmentChart data={chartData} />

//                 <button
//                   style={{ marginTop: 8 }}
//                   onClick={() =>
//                     loadChartForType(selectedStudentId, selectedTypeId)
//                   }
//                 >
//                   Refresh Chart
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }
