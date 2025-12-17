import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Settings from "./pages/Settings";
import Classes from "./pages/Classes";
import StudentRegister from "./pages/StudentRegister";
import StudentEdit from "./pages/StudentEdit";
import LeftStudents from "./pages/LeftStudents";
import TeacherRegister from "./pages/TeacherRegister";
import LeftTeachers from "./pages/LeftTeachers";
import TeacherEdit from "./pages/TeacherEdit";
import Lessons from "./pages/Lessons";
import LessonFolders from "./pages/LessonFolders";
import StudentAssessmentDashboard from "./pages/StudentAssessmentDashboard";
import TeacherStudentReport from "./pages/TeacherStudentReport";
import Champions from "./pages/Champions";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateAdminPage from "./pages/CreateAdminPage";
import CreateAcademyPage from "./pages/CreateAcademyPage";
import FeeStructures from "./pages/FeeStructures";
import StudentFee from "./pages/StudentFee";
import MyFee from "./pages/MyFee";


import TeacherFeeDashboard from "./pages/TeacherFeeDashboard";

/* ✅ INLINE SUPERADMIN GUARD */
const SuperAdminGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "superadmin") {
    // return <Navigate to="/shreenath/login" replace />;
    <Route path="*" element={<Navigate to="/login-not-found" />} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/shreenath/login" />} />
        {/* <Route path="*" element={<Navigate to="/login-not-found" />} /> */}

        {/* ✅ SUPERADMIN (PROTECTED INLINE) */}
        <Route
          path="/superadmin"
          element={
            <SuperAdminGuard>
              <SuperAdminDashboard />
            </SuperAdminGuard>
          }
        />

        <Route
          path="/superadmin/create-admin"
          element={
            <SuperAdminGuard>
              <CreateAdminPage />
            </SuperAdminGuard>
          }
        />

        <Route
          path="/superadmin/create-academy"
          element={
            <SuperAdminGuard>
              <CreateAcademyPage />
            </SuperAdminGuard>
          }
        />

        {/* ✅ ACADEMY ROUTES (UNCHANGED) */}
        <Route path="/:academyCode/login" element={<Login />} />
        <Route path="/:academyCode/dashboard" element={<Dashboard />} />
        <Route path="/:academyCode/admin" element={<AdminPanel />} />
        <Route path="/:academyCode/classes" element={<Classes />} />
        <Route path="/:academyCode/students" element={<Students />} />
        <Route path="/:academyCode/settings" element={<Settings />} />
        <Route
          path="/:academyCode/students/add"
          element={<StudentRegister />}
        />
        <Route
          path="/:academyCode/students/edit/:id"
          element={<StudentEdit />}
        />
        <Route path="/:academyCode/students/left" element={<LeftStudents />} />
        <Route path="/:academyCode/teachers" element={<Teachers />} />
        <Route
          path="/:academyCode/teachers/add"
          element={<TeacherRegister />}
        />
        <Route path="/:academyCode/teachers/left" element={<LeftTeachers />} />
        <Route
          path="/:academyCode/teachers/edit/:id"
          element={<TeacherEdit />}
        />
        <Route path="/:academyCode/lessons" element={<LessonFolders />} />
        <Route path="/:academyCode/lessons/:folderId" element={<Lessons />} />
        <Route
          path="/:academyCode/student-assessments"
          element={<StudentAssessmentDashboard />}
        />
        <Route
          path="/:academyCode/teacher-assessments"
          element={<TeacherStudentReport />}
        />
        <Route path="/:academyCode/our-champions" element={<Champions />} />
        <Route
          path="/:academyCode/fees/structures"
          element={<FeeStructures />}
        />

        <Route
          path="/:academyCode/fees/teacher"
          element={<TeacherFeeDashboard />}
        />

        <Route path="/:academyCode/fees/students" element={<StudentFee />} />
                {/* <Route path="/:academyCode/fees/my" element={<StudentFee />} /> */}

{/* STUDENT ONLY */}
<Route
  path="/:academyCode/fees/my"
  element={<MyFee />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
