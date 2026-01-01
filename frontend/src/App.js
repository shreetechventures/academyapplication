// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import AdminPanel from "./pages/AdminPanel";
// import Students from "./pages/Students";
// import Teachers from "./pages/Teachers";
// import Settings from "./pages/Settings";
// import Classes from "./pages/Classes";
// import StudentRegister from "./pages/StudentRegister";
// import StudentEdit from "./pages/StudentEdit";
// import LeftStudents from "./pages/LeftStudents";
// import TeacherRegister from "./pages/TeacherRegister";
// import LeftTeachers from "./pages/LeftTeachers";
// import TeacherEdit from "./pages/TeacherEdit";
// import Lessons from "./pages/Lessons";
// import LessonFolders from "./pages/LessonFolders";
// import StudentAssessmentDashboard from "./pages/StudentAssessmentDashboard";
// import TeacherStudentReport from "./pages/TeacherStudentReport";
// import Champions from "./pages/Champions";

// import SuperAdminDashboard from "./pages/SuperAdminDashboard";
// import CreateAdminPage from "./pages/CreateAdminPage";
// import CreateAcademyPage from "./pages/CreateAcademyPage";

// // import FeeStructures from "./pages/FeeStructures";
// import StudentFee from "./pages/StudentFee";
// import MyFee from "./pages/MyFee";

// import AdminDashboard from "./pages/AdminDashboard";
// import TeacherDashboard from "./pages/TeacherDashboard";
// import StudentDashboard from "./pages/StudentDashboard";

// import RoleDashboard from "./pages/RoleDashboard";

// import LandingPage from "./pages/LandingPage";

// /* ✅ FIXED SUPERADMIN GUARD */
// const SuperAdminGuard = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token || role !== "superadmin") {
//     return <Navigate to="/login-not-found" replace />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* DEFAULT */}
//         {/* <Route path="/" element={<Navigate to="/shreenath/login" replace />} />
//         <Route path="/login-not-found" element={<div>Access Denied</div>} /> */}

//         <Route path="/" element={<LandingPage />} />
//         <Route path="/shreenath/login" element={<Login />} />

//         {/* ================= SUPERADMIN ================= */}
//         <Route
//           path="/superadmin"
//           element={
//             <SuperAdminGuard>
//               <SuperAdminDashboard />
//             </SuperAdminGuard>
//           }
//         />

//         <Route
//           path="/superadmin/create-admin"
//           element={
//             <SuperAdminGuard>
//               <CreateAdminPage />
//             </SuperAdminGuard>
//           }
//         />

//         <Route
//           path="/superadmin/create-academy"
//           element={
//             <SuperAdminGuard>
//               <CreateAcademyPage />
//             </SuperAdminGuard>
//           }
//         />

//         {/* ================= AUTH ================= */}
//         <Route path="/:academyCode/login" element={<Login />} />

//         {/* ================= DASHBOARDS ================= */}
//         {/* <Route path="/:academyCode/dashboard" element={<AdminDashboard />} />
//         <Route path="/:academyCode/dashboard/teacher" element={<TeacherDashboard />} />
//         <Route path="/:academyCode/dashboard/student" element={<StudentDashboard />} /> */}

//         {/* ================= DASHBOARDS ================= */}
//         <Route path="/:academyCode/dashboard" element={<RoleDashboard />} />

//         <Route
//           path="/:academyCode/dashboard/admin"
//           element={<AdminDashboard />}
//         />

//         <Route
//           path="/:academyCode/dashboard/teacher"
//           element={<TeacherDashboard />}
//         />

//         <Route
//           path="/:academyCode/dashboard/student"
//           element={<StudentDashboard />}
//         />

//         {/* ================= ADMIN ================= */}
//         <Route path="/:academyCode/admin" element={<AdminPanel />} />
//         <Route path="/:academyCode/classes" element={<Classes />} />
//         <Route path="/:academyCode/settings" element={<Settings />} />

//         {/* ================= STUDENTS ================= */}
//         <Route path="/:academyCode/students" element={<Students />} />
//         <Route
//           path="/:academyCode/students/add"
//           element={<StudentRegister />}
//         />
//         <Route
//           path="/:academyCode/students/edit/:id"
//           element={<StudentEdit />}
//         />
//         <Route path="/:academyCode/students/left" element={<LeftStudents />} />

//         {/* ================= TEACHERS ================= */}
//         <Route path="/:academyCode/teachers" element={<Teachers />} />
//         <Route
//           path="/:academyCode/teachers/add"
//           element={<TeacherRegister />}
//         />
//         <Route
//           path="/:academyCode/teachers/edit/:id"
//           element={<TeacherEdit />}
//         />
//         <Route path="/:academyCode/teachers/left" element={<LeftTeachers />} />

//         {/* ================= LESSONS ================= */}
//         <Route path="/:academyCode/lessons" element={<LessonFolders />} />
//         <Route path="/:academyCode/lessons/:folderId" element={<Lessons />} />

//         {/* ================= ASSESSMENTS ================= */}
//         <Route
//           path="/:academyCode/student-assessments"
//           element={<StudentAssessmentDashboard />}
//         />
//         <Route
//           path="/:academyCode/teacher-assessments"
//           element={<TeacherStudentReport />}
//         />

//         {/* ================= CHAMPIONS ================= */}
//         <Route path="/:academyCode/our-champions" element={<Champions />} />

//         {/* ================= FEES ================= */}
//         {/* <Route path="/:academyCode/fees/structures" element={<FeeStructures />} /> */}

//         {/* ADMIN / TRAINER */}
//         <Route path="/:academyCode/fees/students" element={<StudentFee />} />
//         {/* <Route
//           path="/:academyCode/fees/student/:studentId"
//           element={<StudentFee />}
//         /> */}

//         {/* STUDENT */}
//         <Route path="/:academyCode/fees/my" element={<MyFee />} />

//         {/* FALLBACK */}
//         <Route path="*" element={<Navigate to="/login-not-found" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import RoleDashboard from "./pages/RoleDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import AdminPanel from "./pages/AdminPanel";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Settings from "./pages/Settings";
import Classes from "./pages/Classes";

import StudentRegister from "./pages/StudentRegister";
import StudentEdit from "./pages/StudentEdit";
import LeftStudents from "./pages/LeftStudents";

import TeacherRegister from "./pages/TeacherRegister";
import TeacherEdit from "./pages/TeacherEdit";
import LeftTeachers from "./pages/LeftTeachers";

import LessonFolders from "./pages/LessonFolders";
import Lessons from "./pages/Lessons";

import StudentAssessmentDashboard from "./pages/StudentAssessmentDashboard";
import TeacherStudentReport from "./pages/TeacherStudentReport";

import Champions from "./pages/Champions";
import StudentFee from "./pages/StudentFee";
import MyFee from "./pages/MyFee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/settings" element={<Settings />} />

        {/* STUDENTS */}
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<StudentRegister />} />
        <Route path="/students/edit/:id" element={<StudentEdit />} />
        <Route path="/students/left" element={<LeftStudents />} />

        {/* TEACHERS */}
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/add" element={<TeacherRegister />} />
        <Route path="/teachers/edit/:id" element={<TeacherEdit />} />
        <Route path="/teachers/left" element={<LeftTeachers />} />

        {/* LESSONS */}
        <Route path="/lessons" element={<LessonFolders />} />
        <Route path="/lessons/:folderId" element={<Lessons />} />

        {/* ASSESSMENTS */}
        <Route path="/student-assessments" element={<StudentAssessmentDashboard />} />
        <Route path="/teacher-assessments" element={<TeacherStudentReport />} />

        {/* CHAMPIONS */}
        <Route path="/our-champions" element={<Champions />} />

        {/* FEES */}
        <Route path="/fees/students" element={<StudentFee />} />
        <Route path="/fees/my" element={<MyFee />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
