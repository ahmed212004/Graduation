import React from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Intelligence Overview</h1>
            <p style={styles.subtitle}>
              Real-time AI-powered threat monitoring
            </p>
          </div>

          <div style={styles.status}>AI MODELS ACTIVE</div>
        </div>

        {/* Cards + Chart */}
        <div style={styles.grid}>
          <div style={styles.left}>
            <StatCard title="TOTAL SQLI ATTACKS" value="14,205" />
            <StatCard title="TOTAL XSS ATTACKS" value="8,942" />
            <StatCard title="AI DETECTION ACCURACY" value="94%" />
          </div>

          <div style={styles.chartBox}>
            <h3>Overall Threat Detection Rate</h3>

            <div style={styles.circle}>
              <span style={styles.percent}>91%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg, #020617, #020617)",
  },

  main: {
    flex: 1,
    padding: "30px",
    color: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  title: {
    fontSize: "26px",
  },

  subtitle: {
    color: "#aaa",
    fontSize: "14px",
  },

  status: {
    background: "#022c22",
    padding: "10px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#4ade80",
  },

  grid: {
    display: "flex",
    gap: "20px",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  chartBox: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "20px",
  },

  circle: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    border: "12px solid #8b5cf6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px auto",
  },

  percent: {
    fontSize: "40px",
    fontWeight: "bold",
  },
};

export default Dashboard;