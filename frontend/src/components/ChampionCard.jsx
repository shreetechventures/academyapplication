// frontend/src/components/ChampionCard.jsx
import React from "react";
import "../styles/champions.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChampionCard({
  data,
  isAdminOrTeacher = false,
  onDelete,
  onEdit,
}) {
  return (
    <div className="champion-card">
      <div className="champion-media">
        {data.videoUrl ? (
          <video
            src={`${BASE_URL}${data.videoUrl}`}
            controls
          />
        ) : (
          <img
            src={`${BASE_URL}${data.imageUrl}`}
            alt={data.name}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        )}
      </div>

      <div className="champion-info">
        <h3>{data.name}</h3>
        <p className="exam-name">{data.examName}</p>
      </div>

      {isAdminOrTeacher && (
        <div className="champion-actions">
          <button className="edit-btn" onClick={onEdit}>✎</button>
          <button className="delete-btn" onClick={onDelete}>✖</button>
        </div>
      )}
    </div>
  );
}
