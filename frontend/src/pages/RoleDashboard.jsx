// import { Navigate, useParams } from "react-router-dom";

// export default function RoleDashboard() {
//   const { academyCode } = useParams();
//   const role = localStorage.getItem("role");

//   if (!role) {
//     return <Navigate to={`/${academyCode}/login`} replace />;
//   }

//   if (role === "academyAdmin") {
//     return <Navigate to={`/${academyCode}/dashboard/admin`} replace />;
//   }

//   if (role === "teacher") {
//     return <Navigate to={`/${academyCode}/dashboard/teacher`} replace />;
//   }

//   if (role === "student") {
//     return <Navigate to={`/${academyCode}/dashboard/student`} replace />;
//   }

//   return <Navigate to={`/${academyCode}/login`} replace />;
// }

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!role) {
      navigate("/login");
    } else if (role === "academyAdmin") {
      navigate("/dashboard/admin");
    } else if (role === "teacher") {
      navigate("/dashboard/teacher");
    } else if (role === "student") {
      navigate("/dashboard/student");
    } else if (role === "superadmin") {
      navigate("/superadmin");
    }
  }, [role, navigate]);

  return null;
}
