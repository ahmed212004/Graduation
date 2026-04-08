import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// --- Sub-Components ---

// 1. كارت الإحصائيات الصغير
const MetricCard = ({ title, value, change, color, icon }) => (
  <motion.div whileHover={{ y: -5 }} style={styles.metricCard}>
    <div style={styles.flexBetween}>
      <span style={styles.metricTitle}>{title}</span>
      <span>{icon}</span>
    </div>
    <div style={styles.metricValueBox}>
      <h2 style={styles.metricValue}>{value}</h2>
      <span style={{ color, fontSize: "12px" }}>{change}</span>
    </div>
    <div style={styles.progressBarBg}>
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: "70%" }} 
        style={{ ...styles.progressBarFill, background: color }} 
      />
    </div>
  </motion.div>
);

// 2. تحليل الـ Payload الأخير
const PayloadAnalysis = ({ payload }) => (
  <div style={styles.ruleSection}>
    <div style={styles.cardHeader}>
      <span>{`</> LATEST SUCCESSFUL PAYLOAD ANALYSIS`}</span>
      <span style={styles.aiBadge}>RECOGNIZED BY AI</span>
    </div>
    <pre style={styles.codeBlock}>
{`// Trace ID: SD-${Math.floor(Math.random() * 9000) + 1000}
// Type: Injection Attempt
{
  "status": "PASSED",
  "payload": "${payload}",
  "risk_score": 0.94,
  "action": "logged",
  "engine": "Aegis_AI_v2.4"
}`}
    </pre>
  </div>
);

// --- Main Dashboard Component ---

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAttacks: 15000,
    successfulAttacks: 0,
    successRate: 0,
    latestPayload: "Waiting for data...",
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Attacks/Get_Successful_Attacks?PageNumber=1&PageSize=1");
      
      const successCount = response.data.totalCount || response.data.items?.length || 0;
      const totalAttempted = 15000; 
      const rate = ((successCount / totalAttempted) * 100).toFixed(2);

      setStats({
        totalAttacks: totalAttempted,
        successfulAttacks: successCount,
        successRate: rate,
        latestPayload: response.data.items?.[0]?.payload || "No recent breaches",
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchDashboardData();
    }
  }, [navigate, fetchDashboardData]);
  if (loading) {
  return (
    <div style={{ background: '#020617', color: '#3b82f6', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      AUTHENTICATING SYSTEM METRICS...
    </div>
  );
}

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={styles.container}>
        <Sidebar />

        <main style={styles.main}>
          <nav style={styles.breadcrumbs}>
            Strike Defender AI › Security Overview › <span style={{ color: "#fff" }}>Analytics</span>
          </nav>

          <header style={styles.header}>
            <div>
              <div style={styles.flexCenterGap}>
                <h1 style={styles.title}>Intelligence Overview</h1>
                <span style={styles.liveBadge}>LIVE MONITORING</span>
              </div>
              <p style={styles.subtitle}>AI-driven analysis of system infiltrations.</p>
            </div>
            <div style={styles.actionButtons}>
              <button style={styles.secondaryBtn} onClick={fetchDashboardData}>Refresh</button>
              <button style={styles.primaryBtn} onClick={() => navigate("/successful-attacks")}>View All</button>
            </div>
          </header>

          <section style={styles.topGrid}>
            <MetricCard 
              title="TOTAL ATTACKS" 
              value={<CountUp end={stats.totalAttacks} separator="," />} 
              change="Detected by WAF" 
              color="#3b82f6" 
            />
            <MetricCard 
              title="SUCCESSFUL BREACHES" 
              value={<CountUp end={stats.successfulAttacks} />} 
              change="Bypassed AI" 
              color="#ef4444" 
              icon="🚨" 
            />
            <MetricCard 
              title="SUCCESS RATE" 
              value={`${stats.successRate}%`} 
              change={stats.successRate > 5 ? "Critical" : "Secure"} 
              color={stats.successRate > 5 ? "#ef4444" : "#10b981"} 
              icon="📉" 
            />
          </section>

          <div style={styles.contentGrid}>
            <PayloadAnalysis payload={stats.latestPayload} />

            <aside style={styles.sideColumn}>
              <div style={styles.precisionCard}>
                <p style={styles.smallTitle}>SYSTEM INTEGRITY</p>
                <div style={styles.circleBox}>
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                    <motion.circle 
                      cx="60" cy="60" r="50" fill="transparent" stroke="#10b981" strokeWidth="8" 
                      strokeDasharray="314" 
                      animate={{ strokeDashoffset: 314 * (stats.successRate / 100) }}
                      transition={{ duration: 2 }}
                      style={{ rotate: -90, transformOrigin: "50% 50%" }}
                    />
                  </svg>
                  <div style={styles.circleText}>
                    <span style={styles.securePercent}>{100 - stats.successRate}%</span>
                    <span style={styles.secureLabel}>SECURE</span>
                  </div>
                </div>
              </div>

              <div style={styles.actionCard}>
                <p style={styles.smallTitle}>QUICK ACTIONS</p>
                <button style={styles.blueActionBtn}>Generate Report</button>
                <button style={styles.darkActionBtn}>Update AI Models</button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Unified Styles ---
const styles = {
  pageWrapper: { minHeight: "100vh", background: "#020617", color: "#fff", display: "flex", flexDirection: "column" },
  container: { display: "flex", flex: 1, marginTop: "70px" },
  main: { flex: 1, marginLeft: "220px", padding: "30px 40px", width: "calc(100% - 220px)", boxSizing: "border-box" },
  flexBetween: { display: "flex", justifyContent: "space-between" },
  flexCenterGap: { display: "flex", alignItems: "center", gap: "15px" },
  breadcrumbs: { fontSize: "11px", color: "#475569", marginBottom: "20px", letterSpacing: "1px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "26px", fontWeight: "bold" },
  liveBadge: { background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "4px 10px", borderRadius: "4px", fontSize: "10px", border: "1px solid rgba(59, 130, 246, 0.3)" },
  subtitle: { color: "#64748b", fontSize: "14px", marginTop: "5px" },
  actionButtons: { display: "flex", gap: "10px" },
  primaryBtn: { background: "#3b82f6", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  secondaryBtn: { background: "transparent", color: "#94a3b8", border: "1px solid #1e293b", padding: "10px 18px", borderRadius: "6px", cursor: "pointer" },
  topGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" },
  metricCard: { background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "12px" },
  metricTitle: { color: "#64748b", fontSize: "11px", fontWeight: "bold" },
  metricValueBox: { display: "flex", alignItems: "baseline", gap: "10px", margin: "12px 0" },
  metricValue: { fontSize: "28px", fontWeight: "bold" },
  progressBarBg: { height: "3px", width: "100%", background: "#1e293b", borderRadius: "2px", overflow: "hidden" },
  progressBarFill: { height: "100%" },
  contentGrid: { display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "20px" },
  ruleSection: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" },
  cardHeader: { background: "#1e293b", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" },
  aiBadge: { color: "#4ade80", fontSize: "10px" },
  codeBlock: { padding: "20px", color: "#4ade80", fontSize: "13px", fontFamily: "monospace", margin: 0, background: "#020617", overflowX: "auto" },
  sideColumn: { display: "flex", flexDirection: "column", gap: "20px" },
  precisionCard: { background: "#0f172a", border: "1px solid #1e293b", padding: "25px", borderRadius: "12px", textAlign: "center" },
  circleBox: { position: "relative", display: "flex", justifyContent: "center", margin: "15px 0" },
  circleText: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column" },
  securePercent: { fontSize: "22px", fontWeight: "bold" },
  secureLabel: { fontSize: "9px", color: "#64748b" },
  smallTitle: { fontSize: "11px", color: "#64748b", fontWeight: "bold", marginBottom: "15px" },
  actionCard: { background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "10px" },
  blueActionBtn: { background: "#3b82f6", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" },
  darkActionBtn: { background: "#1e293b", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer" },
};

export default Dashboard;