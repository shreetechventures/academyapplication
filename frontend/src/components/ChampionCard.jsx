// frontend/src/components/ChampionCard.jsx
import React from "react";
// import "../styles/champions.css";
import "../styles/editModal.css";

export default function ChampionCard({
  data,
  isAdminOrTeacher,
  onDelete,
  onEdit,
}) {
  const BASE_URL = "http://localhost:5000";

  return (
    <div className="champion-card">
      <div className="champion-media">
        {data.videoUrl ? (
          <video src={BASE_URL + data.videoUrl} controls />
        ) : (
          <img src={BASE_URL + data.imageUrl} alt={data.name} />
        )}
      </div>

      <div className="champion-info">
        <h3>{data.name}</h3>
        <p className="exam-name">{data.examName}</p>
      </div>

      {/* Admin/Teacher only */}
      {isAdminOrTeacher && (
        <div className="champion-actions">
          <button className="edit-btn" onClick={onEdit}>
            ✎
          </button>
          <button className="delete-btn" onClick={onDelete}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
}
