import React from "react";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Aegis AI</h2>

      <ul style={styles.menu}>
        <li style={styles.active}>Dashboard</li>
        <li>SQLi</li>
        <li>XSS</li>
        <li>Detection Rules</li>
        <li>System Logs</li>
        <li>Settings</li>
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
    borderRight: "1px solid #111",
  },
  logo: {
    marginBottom: "30px",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    lineHeight: "40px",
    cursor: "pointer",
  },
  active: {
    background: "#1e293b",
    padding: "5px 10px",
    borderRadius: "6px",
  },
};

export default Sidebar;