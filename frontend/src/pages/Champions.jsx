// // frontend/src/pages/Champions.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import DeleteConfirm from "../components/DeleteConfirm";
import ChampionCard from "../components/ChampionCard";
import EditChampionModal from "../components/EditChampionModal";
import { useParams } from "react-router-dom";

import "../styles/champions.css";
import "../styles/editModal.css";

export default function Champions() {
  const { academyCode } = useParams();

  // ROLE CHECK
  const role = localStorage.getItem("role");
  const isAdminOrTeacher = role === "academyAdmin" || role === "teacher";

  // STATES
  const [grouped, setGrouped] = useState({});
  const [name, setName] = useState("");
  const [examName, setExamName] = useState("");
  const [image, setImage] = useState(null);
  const [year, setYear] = useState("");

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [editModal, setEditModal] = useState({ open: false, champion: null });

  // ======================
  // LOAD CHAMPIONS
  // ======================
  const loadChampions = async () => {
    try {
      const res = await api.get(`/champions`);

      const groupedData = res.data.reduce((acc, champ) => {
        const y = champ.year || "Unknown";
        if (!acc[y]) acc[y] = [];
        acc[y].push(champ);
        return acc;
      }, {});

      setGrouped(groupedData);
    } catch (err) {
      console.error(
        "Load champions error:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (academyCode) loadChampions();
  }, [academyCode]);

  // ======================
  // ADD CHAMPION
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminOrTeacher) return;

    if (!name || !examName || !year) {
      alert("All fields required");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("examName", examName);
      form.append("year", year);
      if (image) form.append("image", image);

      await axios.post(`/champions`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setExamName("");
      setImage(null);
      setYear("");

      loadChampions();
    } catch (err) {
      console.error(
        "Create champion error:",
        err.response?.data || err.message
      );
    }
  };

  // ======================
  // DELETE CHAMPION
  // ======================
  const deleteChampion = async () => {
    try {
      await axios.delete(
        `/champions/${deleteModal.id}`
      );

      setDeleteModal({ open: false, id: null });
      loadChampions();
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );
    }
  };

  // ======================
  // UPDATE CHAMPION
  // ======================
  const updateChampion = async (id, formData) => {
    try {
      await axios.put(
        `/champions/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEditModal({ open: false, champion: null });
      loadChampions();
    } catch (err) {
      console.error(
        "Update error:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <PageWrapper>
      <div className="champions-wrapper">
        <h2>🏆 Our Champions</h2>

        {/* ADD FORM */}
        {isAdminOrTeacher && (
          <div className="champion-form">
            <h3>Add Champion</h3>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Exam Name"
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
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
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

              <button className="btn-primary">Add</button>
            </form>
          </div>
        )}

        {/* LIST */}
        {Object.entries(grouped).map(([year, list]) => (
          <div key={year} className="year-section">
            <h3 className="year-title">{year}</h3>

            <div className="champion-grid">
              {list.map((champ) => (
                <ChampionCard
                  key={champ._id}
                  data={champ}
                  isAdminOrTeacher={isAdminOrTeacher}
                  onEdit={() =>
                    setEditModal({ open: true, champion: champ })
                  }
                  onDelete={() =>
                    setDeleteModal({ open: true, id: champ._id })
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
