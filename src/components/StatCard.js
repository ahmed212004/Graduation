import React from "react";

function StatCard({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.title}>{title}</p>
      <h2 style={styles.value}>{value}</h2>
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
    color: "#fff",
    width: "220px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "14px",
    color: "#aaa",
  },
  value: {
    fontSize: "28px",
    marginTop: "10px",
  },
};

export default StatCard;