import { Navigate, useParams } from "react-router-dom";

export default function RoleDashboard() {
  const { academyCode } = useParams();
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to={`/${academyCode}/login`} replace />;
  }

  if (role === "academyAdmin") {
    return <Navigate to={`/${academyCode}/dashboard/admin`} replace />;
  }

  if (role === "teacher") {
    return <Navigate to={`/${academyCode}/dashboard/teacher`} replace />;
  }

  if (role === "student") {
    return <Navigate to={`/${academyCode}/dashboard/student`} replace />;
  }

  return <Navigate to={`/${academyCode}/login`} replace />;
}
