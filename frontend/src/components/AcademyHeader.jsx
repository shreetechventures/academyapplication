import React from "react";
import "../styles/academyHeader.css";

export default function AcademyHeader({ academy }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Hide header for superadmin
  if (user?.role === "superadmin") {
    return null;
  }

  return (
    <div className="academy-header">
      {academy?.branding?.logoUrl && (
        <img
          src={academy.branding.logoUrl}
          alt="Academy Logo"
          className="academy-logo"
        />
      )}

      <h2 className="academy-title">
        {academy?.name || "Shreenath Defence Academy"}
      </h2>
    </div>
  );
}
