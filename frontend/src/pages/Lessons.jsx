// frontend/src/pages/Lessons.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

import PageWrapper from "../components/PageWrapper";
import "../styles/lessons.css";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editLessonId, setEditLessonId] = useState(null);

  // form fields
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");

  // ⭐ main category state
  const [category, setCategory] = useState("army");

  const role = localStorage.getItem("role");

  // ======================
  // LOAD LESSONS
  // ======================
  const loadLessons = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lessons?category=${category}`);
      setLessons(res.data);
    } catch (err) {
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIX: academyCode REMOVED (subdomain-based)
  useEffect(() => {
    loadLessons();
  }, [category]);

  // ======================
  // EXTRACT YOUTUBE ID
  // ======================
  const parseYouTubeId = (input) => {
    if (!input) return null;
    if (/^[A-Za-z0-9_-]{6,20}$/.test(input)) return input;

    const patterns = [
      /youtu\.be\/([A-Za-z0-9_-]{6,20})/,
      /v=([A-Za-z0-9_-]{6,20})/,
      /embed\/([A-Za-z0-9_-]{6,20})/,
      /\/v\/([A-Za-z0-9_-]{6,20})/,
    ];

    for (const p of patterns) {
      const m = input.match(p);
      if (m && m[1]) return m[1];
    }

    const q = input.match(/[?&]v=([A-Za-z0-9_-]{6,20})/);
    if (q && q[1]) return q[1];

    return null;
  };

  // ======================
  // OPEN EDIT FORM
  // ======================
  const startEdit = (lesson) => {
    setEditLessonId(lesson._id);
    setTitle(lesson.title);
    setYoutubeUrl(lesson.youtubeId);
    setDescription(lesson.description || "");
    setCategory(lesson.category);
    setEditMode(true);
    setShowAdd(true);
  };

  // ======================
  // ADD / EDIT SAVE
  // ======================
  const handleSave = async () => {
    setError("");

    const youtubeId = parseYouTubeId(youtubeUrl);
    if (!title.trim() || !youtubeId) {
      setError("Provide a title and valid YouTube URL or ID.");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        youtubeUrlOrId: youtubeUrl.trim(),
        description,
        category,
      };

      if (editMode && editLessonId) {
        await api.put(`/lessons/${editLessonId}`, payload);
      } else {
        await api.post(`/lessons`, payload);
      }

      // Reset
      setTitle("");
      setYoutubeUrl("");
      setDescription("");
      setEditMode(false);
      setEditLessonId(null);
      setShowAdd(false);

      loadLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save lesson");
    }
  };

  // ======================
  // DELETE LESSON
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;

    try {
      await api.delete(`/lessons/${id}`);
      loadLessons();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <PageWrapper>
      <div className="lessons-page">
        <div className="lessons-header">
          <h2>Lessons</h2>

          {(role === "academyAdmin" || role === "teacher") && (
            <button
              className="btn add-btn"
              onClick={() => {
                setShowAdd(!showAdd);
                if (!showAdd) {
                  setTitle("");
                  setYoutubeUrl("");
                  setDescription("");
                  setEditMode(false);
                }
              }}
            >
              {showAdd ? (editMode ? "Close Edit" : "Close") : "Add Video"}
            </button>
          )}
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="lesson-category-buttons">
          <button
            className={`lesson-cat-btn ${category === "army" ? "active" : ""}`}
            onClick={() => setCategory("army")}
          >
            Army
          </button>

          <button
            className={`lesson-cat-btn ${category === "navy" ? "active" : ""}`}
            onClick={() => setCategory("navy")}
          >
            Navy
          </button>

          <button
            className={`lesson-cat-btn ${
              category === "airforce" ? "active" : ""
            }`}
            onClick={() => setCategory("airforce")}
          >
            Airforce
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        {showAdd && (
          <div className="add-lesson-form card">
            {error && <div className="form-error">{error}</div>}

            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />

            <label>YouTube URL or ID</label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />

            <label>Category</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="army">Army</option>
              <option value="navy">Navy</option>
              <option value="airforce">Airforce</option>
            </select>

            <div className="form-actions">
              <button className="btn primary" onClick={handleSave}>
                {editMode ? "Update" : "Save"}
              </button>

              <button
                className="btn secondary"
                onClick={() => {
                  setShowAdd(false);
                  setEditMode(false);
                  setEditLessonId(null);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* LESSON LIST */}
        <div className="lessons-list">
          {loading ? (
            <div>Loading...</div>
          ) : lessons.length === 0 ? (
            <div className="empty">No lessons found.</div>
          ) : (
            lessons.map((lesson) => (
              <div className="lesson-card" key={lesson._id}>
                <div className="lesson-meta">
                  <h3>{lesson.title}</h3>

                  {(role === "academyAdmin" || role === "teacher") && (
                    <div className="lesson-controls">
                      <button
                        className="btn secondary small"
                        onClick={() => startEdit(lesson)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn danger small"
                        onClick={() => handleDelete(lesson._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="lesson-player">
                  <iframe
                    title={lesson.title}
                    src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
                    allowFullScreen
                  />
                </div>

                {lesson.description && (
                  <p className="lesson-desc">{lesson.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
