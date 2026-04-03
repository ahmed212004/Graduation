import React from "react";

function LogsList() {
  const logs = [
    {
      message: "SQLi attempt detected - Blocked",
      ip: "192.168.1.104",
      level: "CRITICAL",
    },
    {
      message: "XSS attack detected",
      ip: "192.168.1.105",
      level: "HIGH",
    },
  ];

  return (
    <div style={styles.container}>
      <h3>Recent Logs</h3>

      {logs.map((log, index) => (
        <div key={index} style={styles.log}>
          <p>{log.message}</p>
          <span>{log.ip}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    color: "#fff",
  },
  log: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #333",
    padding: "10px 0",
  },
};

export default LogsList;