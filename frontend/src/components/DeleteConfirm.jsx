import React from "react";
import "../styles/deleteConfirm.css";

export default function DeleteConfirm({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="dc-overlay">
      <div className="dc-box">
        <h3>Are you sure?</h3>
        <p>This will delete the result permanently.</p>

        <div className="dc-actions">
          <button className="dc-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="dc-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
