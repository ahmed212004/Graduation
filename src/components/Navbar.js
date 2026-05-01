import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Navbar.css"; // استدعاء الستايل الجديد

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">✽</span> Strike Defender
      </div>

      {/* Links */}
      <div className="navbar-links">
        <span className={`navbar-link ${location.pathname === "/Dashboard" ? "active" : ""}`} onClick={() => navigate("/Dashboard")}>Dashboard</span>
        <span className={`navbar-link ${location.pathname === "/plans" ? "active" : ""}`} onClick={() => navigate("/plans")}>Pricing</span>
        <span className={`navbar-link ${location.pathname === "/about" ? "active" : ""}`} onClick={() => navigate("/about")}>About</span>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {isLoggedIn ? (
          <div className="profile-container">
            <div className="navbar-avatar" onClick={() => navigate("/profile")} title="Go to Profile">
              👤
            </div>
            <button className="navbar-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        ) : (
          <>
            <button className="btn-primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
            <button className="btn-login" onClick={() => navigate("/login")}>
              Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
}