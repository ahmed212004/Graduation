import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// CSS أهم سطر عشان الزراير تظبط
import "../style/Dashboard.css";

const MetricCard = ({ title, value, change, color, icon }) => (
  <motion.div whileHover={{ y: -5 }} className="metric-card">
    <div className="flex-between">
      <span style={{ color: "#64748b", fontWeight: "600" }}>{title}</span>
      <span>{icon}</span>
    </div>
    <div className="metric-value">{value}</div>
    <div style={{ color, fontSize: "14px", fontWeight: "bold" }}>{change}</div>
  </motion.div>
);

function Dashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <div className="page-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>LOADING...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />

      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className="dashboard-container">
        <Sidebar isOpen={isMenuOpen} />

        <main className={`dashboard-main ${isMenuOpen ? 'blur-effect' : ''}`} onClick={() => setIsMenuOpen(false)}>
          <nav style={{color: "#64748b", fontSize: "12px", marginBottom: "20px"}}>
            Main Console › Analytics › <span style={{color: "#fff"}}>Security_Stream</span>
          </nav>

          <header className="dash-header">
            <div>
              <h1 className="dash-title">Intelligence Overview <span style={{fontSize:'12px', background:'rgba(59,130,246,0.1)', color:'#3b82f6', padding:'4px 8px', borderRadius:'10px'}}>LIVE</span></h1>
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
            <div style={{background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px"}}>
               <p style={{color: "#94a3b8", fontSize: "12px", marginBottom: "15px"}}>TERMINAL_PAYLOAD_ANALYSIS</p>
               <pre style={{color: "#4ade80", background: "#020617", padding: "20px", borderRadius: "8px", overflowX: "auto"}}>
                  {`{ "payload": "${stats.latestPayload}", "status": "DETECTED" }`}
               </pre>
            </div>

            <div style={{background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "30px", textAlign: "center"}}>
               <p style={{color: "#fff", marginBottom: "20px"}}>THREAT RATIO</p>
               <div style={{width: "120px", height: "120px", border: "8px solid #3b82f6", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold"}}>
                {100 - stats.successRate}%
               </div>
               <button className="blue-action-btn">Export Logs</button>
               <button className="dark-action-btn">AI Settings</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;