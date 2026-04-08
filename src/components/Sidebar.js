import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // دالة مساعدة عشان نعرف لو اللينك هو الصفحة الحالية
  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>STRIKE DEFENDER</h2>

      <div style={styles.divider}>CORE MODULES</div>

      <ul style={styles.menu}>
        <Link to="/dashboard" style={styles.link}>
          <li style={isActive("/dashboard") ? styles.active : styles.li}>
             <span style={styles.icon}>📊</span> Dashboard
          </li>
        </Link>

        <Link to="/successful-attacks" style={styles.link}>
          <li style={isActive("/successful-attacks") ? styles.active : styles.li}>
             <span style={styles.icon}>🚨</span> Successful Attacks
          </li>
        </Link>

              <Link to="/prompt-testing" style={styles.link}>
        <li style={location.pathname === "/prompt-testing" ? styles.active : styles.li}>
          <span style={styles.icon}>🧪</span> AI Playground
        </li>
      </Link>

        <div style={styles.divider}>ADMINISTRATION</div>

        <li style={styles.li}><span style={styles.icon}>📋</span> System Logs</li>
        <li style={styles.li}><span style={styles.icon}>⚙️</span> Settings</li>
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#020617",
    color: "#fff",
    padding: "20px",
    borderRight: "1px solid #1e293b",
    height: "calc(100vh - 70px)", // يطرح طول النافبار
    position: "fixed",
    top: "70px", // يبدأ بعد النافبار بـ 70px
    left: 0,
    zIndex: 900, // أقل من النافبار اللي غالبا بيكون 1000
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    marginBottom: "20px",
    fontSize: "18px",
    color: "#3b82f6",
    letterSpacing: "2px",
    fontWeight: "bold",
    textAlign: "center",
    padding: "10px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "4px"
  },
  divider: {
    fontSize: "10px",
    color: "#475569",
    fontWeight: "bold",
    margin: "20px 0 10px 10px",
    letterSpacing: "1px"
  },
  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  icon: {
    marginRight: "10px",
    fontSize: "16px"
  },
  li: {
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
    fontSize: "13px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    ":hover": {
        background: "rgba(255,255,255,0.05)",
        color: "#fff"
    }
  },
  active: {
    background: "rgba(59, 130, 246, 0.1)",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "8px",
    fontSize: "13px",
    color: "#3b82f6",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    borderLeft: "3px solid #3b82f6"
  },
};

export default Sidebar;