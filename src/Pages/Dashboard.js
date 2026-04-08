import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// CSS
import "../style/Dashboard.css";

const MetricCard = ({ title, value, change, color, icon }) => (
  <motion.div whileHover={{ y: -5 }} className="metric-card">
    <div className="flex-between">
      <span className="metric-title">{title}</span>
      <span style={{ fontSize: "20px" }}>{icon}</span>
    </div>
    <div className="metric-value-box">
      <h2 className="metric-value">{value}</h2>
      <span style={{ color, fontSize: "13px", fontWeight: "bold" }}>{change}</span>
    </div>
    <div className="progress-bar-bg">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: "75%" }} 
        className="progress-bar-fill"
        style={{ background: color }} 
      />
    </div>
  </motion.div>
);

const PayloadAnalysis = ({ payload }) => (
  <div className="rule-section">
    <div className="card-header">
      <span>{`</> SECURITY_THREAT_ANALYSIS`}</span>
      <span className="ai-badge">AI VERIFIED</span>
    </div>
    <pre className="code-block">
{`// Protocol: HTTPS/TLS 1.3
// Origin: Remote_Inbound
{
  "status": "DETECTED",
  "payload": "${payload}",
  "risk_score": 0.98,
  "mitigation": "Isolated",
  "engine": "Aegis_AI_v2.4"
}`}
    </pre>
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // منيو الموبايل
  const [stats, setStats] = useState({
    totalAttacks: 15000,
    successfulAttacks: 0,
    successRate: 0,
    latestPayload: "Loading...",
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Attacks/Get_Successful_Attacks?PageNumber=1&PageSize=1");
      const successCount = response.data.totalCount || 0;
      const rate = ((successCount / 15000) * 100).toFixed(2);

      setStats({
        totalAttacks: 15000,
        successfulAttacks: successCount,
        successRate: rate,
        latestPayload: response.data.items?.[0]?.payload || "System Clear",
      });
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  if (loading) {
    return (
      <div className="loading-screen">
        <h2 style={{ color: '#3b82f6', fontFamily: 'monospace' }}>INITIALIZING SYSTEM...</h2>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      
      {/* زرار المنيو العائم للموبايل */}
      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className="dashboard-container">
        <Sidebar isOpen={isMenuOpen} />

        <main className={`dashboard-main ${isMenuOpen ? 'blur-effect' : ''}`} onClick={() => setIsMenuOpen(false)}>
          <nav className="breadcrumbs">
            Main Console › Analytics › <span style={{ color: "#fff" }}>Security_Stream</span>
          </nav>

          <header className="dash-header">
            <div className="header-info">
              <div className="flex-center-gap">
                <h1 className="dash-title">Intelligence Overview</h1>
                <span className="live-badge">LIVE</span>
              </div>
              <p className="dash-subtitle">Real-time AI monitoring and threat detection.</p>
            </div>
            <div className="action-buttons">
              <button className="secondary-btn" onClick={fetchDashboardData}>Sync Data</button>
              <button className="primary-btn" onClick={() => navigate("/successful-attacks")}>Deep Inspect</button>
            </div>
          </header>

          <section className="top-grid">
            <MetricCard title="TOTAL ANALYZED" value={<CountUp end={stats.totalAttacks} />} change="WAF Monitoring" color="#3b82f6" icon="📡" />
            <MetricCard title="BREACHES FOUND" value={<CountUp end={stats.successfulAttacks} />} change="Action Required" color="#ef4444" icon="⚠️" />
            <MetricCard title="INTEGRITY SCORE" value={`${100 - stats.successRate}%`} change="System Health" color="#10b981" icon="🛡️" />
          </section>

          <div className="content-grid">
            <PayloadAnalysis payload={stats.latestPayload} />

            <aside className="side-column">
              <div className="precision-card">
                <p className="small-title">THREAT RATIO</p>
                <div className="circle-box">
                   <svg width="100" height="100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * (100 - stats.successRate) / 100)} />
                   </svg>
                   <div className="circle-text">
                      <span className="secure-percent">{100 - stats.successRate}%</span>
                   </div>
                </div>
              </div>

              <div className="action-card">
                <button className="blue-action-btn">Export Logs</button>
                <button className="dark-action-btn">AI Settings</button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;