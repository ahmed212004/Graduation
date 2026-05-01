import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// استيراد اللوجو الخاص بك من المسار المذكور
// ملاحظة: تأكد أن اسم المجلد Images يبدأ بحرف كبير أو صغير حسب تسميتك له فعلياً
import logo from "../Images/Logo.png"; 

import "../style/Navbar.css"; 

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = !!localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img 
          src={logo} 
          alt="Strike Defender Logo" 
          className="navbar-logo-img" 
        />
        <span className="logo-text">Strike Defender</span>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <span 
          className={`navbar-link ${location.pathname === "/dashboard" ? "active" : ""}`} 
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </span>
        <span 
          className={`navbar-link ${location.pathname === "/plans" ? "active" : ""}`} 
          onClick={() => navigate("/plans")}
        >
          Pricing
        </span>
        <span 
          className={`navbar-link ${location.pathname === "/about" ? "active" : ""}`} 
          onClick={() => navigate("/about")}
        >
          About
        </span>
      </div>

      {/* Actions Section */}
      <div className="navbar-actions">
        {isLoggedIn ? (
          <div className="profile-container" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div 
              className="navbar-avatar" 
              onClick={() => navigate("/profile")} 
              title="Go to Profile"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
            >
              👤
            </div>
            <button className="navbar-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
             <button className="btn-login" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button className="btn-primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
}