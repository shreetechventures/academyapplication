{/* <Route
  path="/superadmin/create-admin"
  element={
    <ProtectedRoute allowedRoles={["superadmin"]}>
      <CreateAdminPage />
    </ProtectedRoute>
  }
/> */}

// frontend/src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized
  return children;
}
