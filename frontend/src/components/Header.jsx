// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "../styles/landing.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      <div className="brand">
        <img src={logo} alt="Shree Group" />
        <span>Shree Group</span>
      </div>

      {/* <button
        className="login-btn"
        onClick={() => navigate("/shreenath/login")}
      >
        Login
      </button> */}
    </header>
  );
}
