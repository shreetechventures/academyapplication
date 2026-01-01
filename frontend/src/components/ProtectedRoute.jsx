{/* <Route
  path="/superadmin/create-admin"
  element={
    <ProtectedRoute allowedRoles={["superadmin"]}>
      <CreateAdminPage />
    </ProtectedRoute>
  }
/> */}


import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
