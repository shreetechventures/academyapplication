// frontend/src/App.js


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Settings from "./pages/Settings";
import Classes from "./pages/Classes";
import StudentRegister from "./pages/StudentRegister";
import StudentEdit from "./pages/StudentEdit";
import LeftStudents from './pages/LeftStudents';
import TeacherRegister from './pages/TeacherRegister';
import LeftTeachers from './pages/LeftTeachers';
import TeacherEdit from './pages/TeacherEdit';

import Lessons from './pages/Lessons';
import LessonFolders from './pages/LessonFolders';

import StudentAssessmentDashboard from './pages/StudentAssessmentDashboard';
import TeacherStudentReport from './pages/TeacherStudentReport';
import Champions from './pages/Champions';


function App(){
  return (
    <BrowserRouter>
      <Routes>

        {/* Auto redirect */}
        <Route path="/" element={<Navigate to="/shreenath/login" />} />

        <Route path="/:academyCode/login" element={<Login />} />
        <Route path="/:academyCode/admin" element={<AdminPanel />} />
        <Route path="/:academyCode/classes" element={<Classes />} />

        <Route path="/:academyCode/dashboard" element={<Dashboard />} />
        <Route path="/:academyCode/students" element={<Students />} />
        <Route path="/:academyCode/settings" element={<Settings />} />

        <Route path="/:academyCode/students/add" element={<StudentRegister />} />

       
        <Route path="/:academyCode/students/edit/:id" element={<StudentEdit />} />
        <Route path="/:academyCode/students/left" element={<LeftStudents />} />

        <Route path="/:academyCode/teachers" element={<Teachers />} />
        <Route path="/:academyCode/teachers/add" element={<TeacherRegister />} />
        <Route path="/:academyCode/teachers/left" element={<LeftTeachers />} />

        <Route path="/:academyCode/teachers/edit/:id" element={<TeacherEdit />} />

        <Route path="/:academyCode/lessons" element={<LessonFolders />} />
        <Route path="/:academyCode/lessons/:folderId" element={<Lessons />} />

        // ADD THIS ONE FOR BACKWARDS COMPATIBILITY
        <Route path="/:academyCode/lessons" element={<LessonFolders />} />

        <Route path="/:academyCode/student-assessments" element={<StudentAssessmentDashboard />} />
        <Route path="/:academyCode/teacher-assessments" element={<TeacherStudentReport />} />
        

        <Route path="/:academyCode/our-champions" element={<Champions />} />






      </Routes>
    </BrowserRouter>
  );
}

export default App;
