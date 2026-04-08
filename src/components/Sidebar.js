import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/Sidebar.css"; // استدعاء ملف الستايل

function Sidebar() {
  const location = useLocation();

  // دالة مساعدة عشان نعرف لو اللينك هو الصفحة الحالية
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">STRIKE DEFENDER</h2>

      <div className="sidebar-divider">CORE MODULES</div>

      <ul className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-link">
          <li className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`}>
            <span className="sidebar-icon">📊</span> Dashboard
          </li>
        </Link>

        <Link to="/successful-attacks" className="sidebar-link">
          <li className={`sidebar-item ${isActive("/successful-attacks") ? "active" : ""}`}>
            <span className="sidebar-icon">🚨</span> Successful Attacks
          </li>
        </Link>

        <Link to="/prompt-testing" className="sidebar-link">
          <li className={`sidebar-item ${isActive("/prompt-testing") ? "active" : ""}`}>
            <span className="sidebar-icon">🧪</span> AI Playground
          </li>
        </Link>

        <div className="sidebar-divider">ADMINISTRATION</div>

        <li className="sidebar-item">
          <span className="sidebar-icon">📋</span> System Logs
        </li>
        <li className="sidebar-item">
          <span className="sidebar-icon">⚙️</span> Settings
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;