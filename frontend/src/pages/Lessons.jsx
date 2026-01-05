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

  // category
  const [category, setCategory] = useState("police");

  // ✅ ROLE (DO NOT lowercase)
  const role = localStorage.getItem("role") || "";
  const canManage = role === "academyAdmin" || role === "teacher";
//   // later upgrade
// const canManage =
//   role === "academyAdmin" ||
//   (role === "teacher" && permissions.allowTrainerLessonManagement);


  /* ======================
     LOAD LESSONS
  ====================== */
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

  useEffect(() => {
    loadLessons();
  }, [category]);

  /* ======================
     PARSE YOUTUBE ID
  ====================== */
  const parseYouTubeId = (input) => {
    if (!input) return null;
    if (/^[A-Za-z0-9_-]{6,20}$/.test(input)) return input;

    const patterns = [
      /youtu\.be\/([A-Za-z0-9_-]{6,20})/,
      /v=([A-Za-z0-9_-]{6,20})/,
      /embed\/([A-Za-z0-9_-]{6,20})/,
    ];

    for (const p of patterns) {
      const m = input.match(p);
      if (m && m[1]) return m[1];
    }

    return null;
  };

  /* ======================
     START EDIT
  ====================== */
  const startEdit = (lesson) => {
    setEditLessonId(lesson._id);
    setTitle(lesson.title);
    setYoutubeUrl(lesson.youtubeId);
    setDescription(lesson.description || "");
    setCategory(lesson.category);
    setEditMode(true);
    setShowAdd(true);
  };

  /* ======================
     SAVE
  ====================== */
  const handleSave = async () => {
    setError("");

    const youtubeId = parseYouTubeId(youtubeUrl);
    if (!title.trim() || !youtubeId) {
      setError("Provide title and valid YouTube URL or ID");
      return;
    }

    const payload = {
      title: title.trim(),
      youtubeUrlOrId: youtubeUrl.trim(),
      description,
      category,
    };

    try {
      if (editMode && editLessonId) {
        await api.put(`/lessons/${editLessonId}`, payload);
      } else {
        await api.post(`/lessons`, payload);
      }

      // reset
      setTitle("");
      setYoutubeUrl("");
      setDescription("");
      setEditMode(false);
      setEditLessonId(null);
      setShowAdd(false);

      loadLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  /* ======================
     DELETE
  ====================== */
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

          {canManage && (
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

        {/* CATEGORY */}
        <div className="lesson-category-buttons">
          {["police", "army", "navy", "airforce"].map((c) => (
            <button
              key={c}
              className={`lesson-cat-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        {/* FORM */}
        {showAdd && (
          <div className="add-lesson-form card">
            {error && <div className="form-error">{error}</div>}

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="YouTube URL or ID"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <textarea
              rows="3"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="police">police</option>

              <option value="army">Army</option>
              <option value="navy">Navy</option>
              <option value="airforce">Airforce</option>
            </select>

            <button className="btn primary" onClick={handleSave}>
              {editMode ? "Update" : "Save"}
            </button>
          </div>
        )}

        {/* LIST */}
        <div className="lessons-list">
          {loading ? (
            <div>Loading...</div>
          ) : lessons.length === 0 ? (
            <div className="empty">No lessons found</div>
          ) : (
            lessons.map((lesson) => (
              <div className="lesson-card" key={lesson._id}>
                <div className="lesson-meta">
                  <h3>{lesson.title}</h3>

                  {canManage && (
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

                <iframe
                  title={lesson.title}
                  src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
                  allowFullScreen
                />

                {lesson.description && <p>{lesson.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
