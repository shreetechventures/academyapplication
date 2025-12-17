<Route
  path="/superadmin/create-admin"
  element={
    <ProtectedRoute allowedRoles={["superadmin"]}>
      <CreateAdminPage />
    </ProtectedRoute>
  }
/>
