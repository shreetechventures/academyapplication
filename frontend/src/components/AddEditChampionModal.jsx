import React, { useState } from "react";
import api from "../api/axios";

import "../styles/champions.css";
// import "../styles/editModal.css";
export default function AddEditChampionModal({
  open,
  onClose,
  data,
  academyCode,
  refresh,
}) {
  const [form, setForm] = useState({
    name: data?.name || "",
    achievementTitle: data?.achievementTitle || "",
    description: data?.description || "",
    category: data?.category || "",
    imageUrl: data?.imageUrl || "",
    videoUrl: data?.videoUrl || "",
    featured: data?.featured || false,
    achievementDate: data?.achievementDate?.substring(0, 10) || "",
  });

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Name required");

    if (data) {
      // Update
      await api.put(`/champions/${data._id}`, form);
    } else {
      // Create
      await api.post(`/champions`, form);
    }

    refresh();
    onClose();
  };

  return (
    <div className="champ-modal-overlay">
      <div className="champ-modal">
        <h3>{data ? "Edit Champion" : "Add Champion"}</h3>

        <input
          placeholder="Student Name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <input
          placeholder="Achievement Title"
          value={form.achievementTitle}
          onChange={(e) => updateField("achievementTitle", e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <input
          placeholder="Category (e.g., Running, Kabaddi)"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        />

        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
        />

        <input
          placeholder="Video URL (optional)"
          value={form.videoUrl}
          onChange={(e) => updateField("videoUrl", e.target.value)}
        />

        <input
          type="date"
          value={form.achievementDate}
          onChange={(e) => updateField("achievementDate", e.target.value)}
        />

        <label className="featured-toggle">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
          />
          Mark as Featured
        </label>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="champ-btn-primary">
            {data ? "Update" : "Create"}
          </button>
          <button className="champ-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
