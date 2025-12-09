import React, { useState, useEffect } from "react";
import "../styles/champions.css";
import "../styles/editModal.css";



export default function EditChampionModal({ open, champion, onClose, onSave }) {

  // ✅ Hooks must come FIRST — before any condition!
  const [name, setName] = useState("");
  const [examName, setExamName] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  // When modal opens, fill existing values
  useEffect(() => {
    if (champion) {
      setName(champion.name || "");
      setExamName(champion.examName || "");
      setImage(null);
      setVideo(null);
    }
  }, [champion]);

  // Now conditional return is allowed
  if (!open) return null;

  const handleSubmit = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("examName", examName);
    if (image) form.append("image", image);
    if (video) form.append("video", video);

    onSave(champion._id, form);
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-box">

        <h3>Edit Champion</h3>

        <div className="edit-modal-content">

          <input
            type="text"
            placeholder="Champion Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Exam Name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />

          <label className="upload-box">
            Upload New Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {/* <label className="upload-box">
            Upload New Video (optional)
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </label> */}

        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
