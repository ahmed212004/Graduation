import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import api from "../services/api";

// Import CSS
import "../style/Dashboard.css";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MetricCard = ({ title, value, change, color, icon }) => (
  <motion.div whileHover={{ y: -5 }} className="metric-card">
    <div className="flex-between">
      <span className="metric-title">{title}</span>
      <span>{icon}</span>
    </div>
    <div className="metric-value-box">
      <h2 className="metric-value">{value}</h2>
      <span style={{ color, fontSize: "12px" }}>{change}</span>
    </div>
    <div className="progress-bar-bg">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: "70%" }} 
        className="progress-bar-fill"
        style={{ background: color }} 
      />
    </div>
  </motion.div>
);

const PayloadAnalysis = ({ payload }) => (
  <div className="rule-section">
    <div className="card-header">
      <span>{`</> LATEST SUCCESSFUL PAYLOAD ANALYSIS`}</span>
      <span className="ai-badge">RECOGNIZED BY AI</span>
    </div>
    <pre className="code-block">
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
      console.error("Dashboard Error:", err);
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
      <div className="loading-screen" style={{ background: '#020617', color: '#3b82f6', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
        AUTHENTICATING SYSTEM METRICS...
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />

        <main className="dashboard-main">
          <nav className="breadcrumbs">
            Strike Defender AI › Security Overview › <span style={{ color: "#fff" }}>Analytics</span>
          </nav>

          <header className="dash-header">
            <div>
              <div className="flex-center-gap">
                <h1 className="dash-title">Intelligence Overview</h1>
                <span className="live-badge">LIVE MONITORING</span>
              </div>
              <p className="dash-subtitle">AI-driven analysis of system infiltrations.</p>
            </div>
            <div className="action-buttons">
              <button className="secondary-btn" onClick={fetchDashboardData}>Refresh</button>
              <button className="primary-btn" onClick={() => navigate("/successful-attacks")}>View All</button>
            </div>
          </header>

          <section className="top-grid">
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

          <div className="content-grid">
            <PayloadAnalysis payload={stats.latestPayload} />

            <aside className="side-column">
              <div className="precision-card">
                <p className="small-title">SYSTEM INTEGRITY</p>
                <div className="circle-box">
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
                  <div className="circle-text">
                    <span className="secure-percent">{100 - stats.successRate}%</span>
                    <span className="secure-label">SECURE</span>
                  </div>
                </div>
              </div>

              <div className="action-card">
                <p className="small-title">QUICK ACTIONS</p>
                <button className="blue-action-btn">Generate Report</button>
                <button className="dark-action-btn">Update AI Models</button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;