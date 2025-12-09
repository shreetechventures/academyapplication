// frontend/src/components/AcademyHeader

import React from 'react';
import '../styles/academyHeader.css';

export default function AcademyHeader({ academy }) {
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
