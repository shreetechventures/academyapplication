// frontend/src/pages/Champions.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import DeleteConfirm from "../components/DeleteConfirm";
import ChampionCard from "../components/ChampionCard";
import EditChampionModal from "../components/EditChampionModal";

import { useParams } from "react-router-dom";
import "../styles/champions.css";

export default function Champions() {
  const { academyCode } = useParams();

  // ROLE CHECK
  const role = localStorage.getItem("role");
  const isAdminOrTeacher = role === "academyAdmin" || role === "teacher";

  // STATES
  const [grouped, setGrouped] = useState({}); // grouped by year

  const [name, setName] = useState("");
  const [examName, setExamName] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [year, setYear] = useState("");

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [editModal, setEditModal] = useState({ open: false, champion: null });

  // --------------------------
  // LOAD CHAMPIONS
  // --------------------------
  const loadChampions = async () => {
    try {
      const res = await axios.get(`/api/${academyCode}/champions`);
      const response = res.data;

    //   console.log("Loaded grouped:", response);

      setGrouped(response);

    } catch (err) {
      console.error("Load Champions Error:", err);
    }
  };

  useEffect(() => {
    loadChampions();
  }, []);

  // --------------------------
  // ADD CHAMPION
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdminOrTeacher) return;

    if (!name || !examName || !year) {
      alert("Name, Exam & Year are required");
      return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("examName", examName);
    form.append("year", year);

    if (image) form.append("image", image);
    if (video) form.append("video", video);

    try {
      await axios.post(`/api/${academyCode}/champions`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setExamName("");
      setImage(null);
      setVideo(null);

      loadChampions();
    } catch (err) {
      console.error("Create Error:", err);
    }
  };

  // --------------------------
  // DELETE
  // --------------------------
  const deleteChampion = async () => {
    try {
      await axios.delete(`/api/${academyCode}/champions/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null });
      loadChampions();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // --------------------------
  // UPDATE
  // --------------------------
  const updateChampion = async (id, formData) => {
    try {
      await axios.put(`/api/${academyCode}/champions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditModal({ open: false, champion: null });
      loadChampions();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  return (
    <PageWrapper>
      <div className="champions-wrapper">
        
        <h2>🏆 Our Champions</h2>

        {/* ------------------------------
            ADD FORM (Admin + Teacher)
        -------------------------------*/}
        {isAdminOrTeacher && (
          <div className="champion-form">
            <h3>Add New Champion</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Champion Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Exam Name / Selected For"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="year-select"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 10 }).map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>

              <label className="upload-box">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <button className="btn-primary" type="submit">
                Add Champion
              </button>
            </form>
          </div>
        )}

       {/* ------------------------------
     DISPLAY — YEAR WISE
------------------------------- */}
{Object.keys(grouped)
  .sort((a, b) => Number(b) - Number(a))
  .map((year) => (
    <div key={year} className="year-section">
      
      <h2 className="year-title">📅 {year}</h2>

      <div className="champion-grid">
        {grouped[year].map((c) => (
          <ChampionCard
            key={c._id}
            data={c}
            isAdminOrTeacher={isAdminOrTeacher}
            onDelete={
              isAdminOrTeacher
                ? () => setDeleteModal({ open: true, id: c._id })
                : null
            }
            onEdit={
              isAdminOrTeacher
                ? () => setEditModal({ open: true, champion: c })
                : null
            }
          />
        ))}
      </div>

    </div>
))}


        {/* MODALS */}
        <DeleteConfirm
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, id: null })}
          onConfirm={deleteChampion}
        />

        <EditChampionModal
          open={editModal.open}
          champion={editModal.champion}
          onClose={() => setEditModal({ open: false, champion: null })}
          onSave={updateChampion}
        />
      </div>
    </PageWrapper>
  );
}
