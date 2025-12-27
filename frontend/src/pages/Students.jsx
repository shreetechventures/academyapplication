// // frontend/src/pages/Students.jsx

// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import PageWrapper from "../components/PageWrapper";
// import { useParams, useNavigate } from "react-router-dom";
// import "../styles/dashboard.css";
// import "../styles/student.css";

// export default function Students() {
//   const { academyCode } = useParams();
//   const navigate = useNavigate();

//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState([]);

//   const role = localStorage.getItem("role");

//   const loadStudents = async () => {
//     try {
//       const res = await axios.get(`/${academyCode}/students`);
//       setStudents(res.data);
      

//       setFiltered(res.data);
//     } catch (err) {
//       console.error("Loading students failed:", err);
//     }
//   };

//   useEffect(() => {
//     loadStudents();
//   }, [academyCode]);

//   const handleSearch = () => {
//     const result = students.filter(s =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
//       s.contactNumber.includes(search)
//     );
//     setFiltered(result);
//   };

//   const markAsLeft = async (id) => {
//     try {
//       await axios.put(`/${academyCode}/students/${id}/leave`);
//       setFiltered(prev => prev.filter(s => s._id !== id));
//     } catch {
//       alert("Error updating status");
//     }
//   };

//   return (
//     <PageWrapper>

// <div className="students-content-wrapper page-scroll">

//         {/* 🔹 Top Section */}
//         <div className="student-header-row">
//           <h2 className="student-page-title">Candidate List</h2>

//           <div className="student-search-container">
//             <input 
//               type="text"
//               placeholder="Search by Name / Code / Mobile"
//               className="student-search-input"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <button className="student-search-btn" onClick={handleSearch}>
//               Search
//             </button>

//             {(role === "academyAdmin" || role === "teacher") && (
//               <button 
//                 className="add-student-btn"
//                 onClick={() => navigate(`/${academyCode}/students/add`)}
//               >
//                 + Add Student
//               </button>
//             )}
//           </div>
//         </div>

//         {/* 🔹 Table */}
//         <div className="student-table-section">
//           <table className="student-table">
//             <thead>
//               <tr>
//                 <th>Code</th>
//                 <th>Name</th>
//                 <th>Contact</th>
//                 <th>Practice</th>
//                 <th>Admission Date </th>
//                 <th>Emergency Contant</th>
//                 {(role === "academyAdmin" || role === "teacher") && <th>Action</th>}
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: "center" }}>
//                     No candidates found
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((s) => (
//                   <tr key={s._id}>
//                     {/* <td>{s._id}</td> */}
//                     <td>{s.studentCode}</td>
//                     <td>{s.name}</td>
//                     <td>{s.contactNumber}</td>
//                     <td>{s.practiceFor}</td>
//                     <td>
//                       {s.admissionDate
//                         ? new Date(s.admissionDate).toLocaleDateString()
//                         : "-"}
//                     </td>
//                     <td>{s.emergencyContact1}</td>

//                     {(role === "academyAdmin" || role === "teacher") && (
//                       <td>
//                         <button 
//                           className="student-edit-btn"
//                           onClick={() => navigate(`/${academyCode}/students/edit/${s._id}`)}
//                         >
//                           Edit
//                         </button>

//                         <button 
//                           className="student-leave-btn"
//                           onClick={() => markAsLeft(s._id)}
//                         >
//                           Left
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>

//           </table>
//         </div>

//       </div>

//     </PageWrapper>
//   );
// }



// frontend/src/pages/Students.jsx

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function Students() {
  const { academyCode, type } = useParams();
  const navigate = useNavigate();

  const mode = type === "left" ? "left" : "active";
  const role = localStorage.getItem("role");

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [counts, setCounts] = useState({
    active: 0,
    left: 0,
  });

  /* =======================
     LOAD COUNTS (BADGES)
  ======================= */
  const loadCounts = async () => {
    try {
      const activeRes = await axios.get(
        `/${academyCode}/dashboard/students/active`
      );
      const leftRes = await axios.get(
        `/${academyCode}/dashboard/students/left`
      );

      setCounts({
        active: activeRes.data.count,
        left: leftRes.data.count,
      });
    } catch (err) {
      console.error("Count loading failed", err);
    }
  };

  /* =======================
     LOAD STUDENTS
  ======================= */
  const loadStudents = async () => {
    try {
      const url =
        mode === "left"
          ? `/${academyCode}/students/left/all`
          : `/${academyCode}/students`;

      const res = await axios.get(url);
      setStudents(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Student loading failed", err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadCounts();
  }, [academyCode, mode]);

  /* =======================
     SEARCH
  ======================= */
  const handleSearch = () => {
    const result = students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.contactNumber.includes(search)
    );
    setFiltered(result);
  };

  /* =======================
     MARK AS LEFT
  ======================= */
  const markAsLeft = async (id) => {
    try {
      await axios.put(`/${academyCode}/students/${id}/leave`);
      loadStudents();
      loadCounts();
    } catch {
      alert("Error updating student status");
    }
  };

  return (
    <PageWrapper>
      <div className="students-content-wrapper page-scroll">

        {/* ===== HEADER + TABS ===== */}
        <div className="student-header-row">
          <h2 className="student-page-title">Students</h2>

          <div className="student-tabs">
            <button
              className={`tab-btn ${mode === "active" ? "active" : ""}`}
              onClick={() => navigate(`/${academyCode}/students`)}
            >
              Active
              <span className="badge">{counts.active}</span>
            </button>

            <button
              className={`tab-btn ${mode === "left" ? "active" : ""}`}
              onClick={() => navigate(`/${academyCode}/students/left`)}
            >
              Left
              <span className="badge warning">{counts.left}</span>
            </button>
          </div>
        </div>

        {/* ===== SEARCH + ADD ===== */}
        <div className="student-search-container">
          <input
            type="text"
            placeholder="Search by Name / Code / Mobile"
            className="student-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="student-search-btn" onClick={handleSearch}>
            Search
          </button>

          {mode === "active" &&
            (role === "academyAdmin" || role === "teacher") && (
              <button
                className="add-student-btn"
                onClick={() =>
                  navigate(`/${academyCode}/students/add`)
                }
              >
                + Add Student
              </button>
            )}
        </div>

        {/* ===== TABLE ===== */}
        <div className="student-table-section">
          <table className="student-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Practice</th>

                {mode === "active" && <th>Admission Date</th>}
                {mode === "active" && <th>Emergency Contact</th>}
                {mode === "active" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentCode}</td>
                    <td>{s.name}</td>
                    <td>{s.contactNumber}</td>
                    <td>{s.practiceFor}</td>

                    {mode === "active" && (
                      <>
                        <td>
                          {s.admissionDate
                            ? new Date(s.admissionDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>{s.emergencyContact1}</td>
                        <td>
                          <button
                            className="student-edit-btn"
                            onClick={() =>
                              navigate(
                                `/${academyCode}/students/edit/${s._id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="student-leave-btn"
                            onClick={() => markAsLeft(s._id)}
                          >
                            Left
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
