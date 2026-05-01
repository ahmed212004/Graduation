import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/Sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  
  // دالة لمعرفة الرابط النشط لتغيير الستايل
  const isActive = (path) => location.pathname === path;

  // دالة لإغلاق السايدبار عند الضغط على رابط (مفيدة جداً للموبايل)
  const handleLinkClick = () => {
    if (window.innerWidth <= 1024 && setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-logo">STRIKE DEFENDER</h2>
      </div>

      <div className="sidebar-divider">CORE MODULES</div>

      <ul className="sidebar-menu">
        {/* Dashboard */}
        <Link to="/dashboard" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`}>
            <span className="sidebar-icon">📊</span> Dashboard
          </li>
        </Link>

        {/* Successful Attacks */}
        <Link to="/successful-attacks" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/successful-attacks") ? "active" : ""}`}>
            <span className="sidebar-icon">🚨</span> Successful Attacks
          </li>
        </Link>

        {/* Prompt Testing */}
        <Link to="/prompt-testing" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/prompt-testing") ? "active" : ""}`}>
            <span className="sidebar-icon">🧪</span> Testing Prompt
          </li>
        </Link>

         {/* Plan page */}
        <Link to="/plans" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/plans") ? "active" : ""}`}>
            <span className="sidebar-icon">🤑</span> Plans
          </li>
        </Link>

          {/* Plan page */}
        <Link to="/plans" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/plans") ? "active" : ""}`}>
            <span className="sidebar-icon">💻</span> Start System
          </li>
        </Link>

        

        <div className="sidebar-divider">ADMINISTRATION</div>

        {/* Manage Accounts (Admin Only) */}
        <Link to="/admin/accounts" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/admin/accounts") ? "active" : ""}`}>
            <span className="sidebar-icon">👥</span> Manage Accounts
          </li>
        </Link>

        {/* Profile */}
        <Link to="/profile" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/profile") ? "active" : ""}`}>
            <span className="sidebar-icon">👤</span> My Profile
          </li>
        </Link>

        {/* Initialize Identity / Complete Profile */}
        <Link to="/complete-profile" className="sidebar-link" onClick={handleLinkClick}>
          <li className={`sidebar-item ${isActive("/complete-profile") ? "active" : ""}`}>
            <span className="sidebar-icon">🆔</span> Manage Profile
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;