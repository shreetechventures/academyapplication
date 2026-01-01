import { useState } from "react";
import api from "../api/axios";
 // your axios instance

export default function EnquiryModal({ plan, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    academyName: "",
    adminName: "",
    phone: "",
    city: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/public/plan-enquiry", {
        ...form,
        plan,
      });

      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      alert("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {submitted ? (
          <div className="modal-success">
            <h3>✅ Query Submitted</h3>
            <p>Our team will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Enquiry for {plan} Plan</h3>

            <input
              name="academyName"
              placeholder="Academy Name"
              required
              onChange={handleChange}
            />

            <input
              name="adminName"
              placeholder="Admin Name"
              required
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Mobile Number"
              required
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              required
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Message (optional)"
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}

        <span className="close-btn" onClick={onClose}>✖</span>
      </div>
    </div>
  );
}
