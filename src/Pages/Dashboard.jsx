import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../style/Dashboard.css";

const MetricCard = ({ title, value, change, color, icon }) => (
  <motion.div whileHover={{ y: -5 }} className="metric-card">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
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
    totalAttacks: 0,
    successfulAttacks: 0,
    successRate: 0,
    totalRules: 0,
    activeRules: 0,
    blockedCount: 0,
    avgExecutionTime: 0,
    topAttackType: "N/A",
    latestPayload: "Scanning...",
    rawData: [] 
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. نداء الـ Endpoint الجديدة للملخص
      const overviewRes = await api.get("/api/Dashboard/SecurityOverview");
      const overview = overviewRes.data;

      // 2. نداء الـ Endpoint القديمة لجلب الـ Logs (عشان زرار الـ Export والـ Payload)
      const logsRes = await api.get("/api/Attacks/Get_Successful_Attacks?PageNumber=1&PageSize=50");
      
      setStats({
        totalAttacks: overview.attacks.totalAttacks,
        successfulAttacks: overview.attacks.successfulAttacks,
        successRate: overview.attacks.successRate,
        totalRules: overview.rules.totalRules,
        activeRules: overview.rules.activeRules,
        blockedCount: overview.analysis.blockedCount,
        avgExecutionTime: overview.analysis.avgExecutionTime,
        topAttackType: overview.analysis.topAttackType,
        latestPayload: logsRes.data.items?.[0]?.payload || "System Secure",
        rawData: logsRes.data.items || [] 
      });

    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleExportLogs = () => {
    if (stats.rawData.length === 0) {
      alert("No attack logs available to export.");
      return;
    }
    const headers = ["Technique", "Payload", "Status Code", "Execution Time (ms)", "Result"];
    const csvRows = [
      headers.join(","), 
      ...stats.rawData.map(attack => [
        `"${attack.technique}"`, 
        `"${attack.payload.replace(/"/g, '""')}"`, 
        attack.statusCode,
        attack.executionTimeMs,
        `"${attack.result}"`
      ].join(","))
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `StrikeDefender_Logs_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="page-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', color:'white', height:'100vh'}}>SYNCHRONIZING AI AGENTS...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />

      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className="dashboard-container">
        <Sidebar isOpen={isMenuOpen} />

        <main className={`dashboard-main ${isMenuOpen ? 'blur-effect' : ''}`} onClick={() => isMenuOpen && setIsMenuOpen(false)}>
          <nav style={{color: "#64748b", fontSize: "12px", marginBottom: "20px"}}>
            Main Console › Analytics › <span style={{color: "#fff"}}>Security_Overview</span>
          </nav>

          <header className="dash-header">
            <div>
              <h1 className="dash-title">STRIKE DEFENDER <span style={{fontSize:'12px', background:'rgba(59,130,246,0.1)', color:'#3b82f6', padding:'4px 8px', borderRadius:'10px'}}>AI ACTIVE</span></h1>
              <p className="dash-subtitle">Top Threat: <span style={{color:'#ef4444'}}>{stats.topAttackType}</span></p>
            </div>
            <div className="action-buttons">
              <button className="secondary-btn" onClick={fetchDashboardData}>Sync Intelligence</button>
              <button className="primary-btn" onClick={() => navigate("/successful-attacks")}>View All Logs</button>
            </div>
          </header>

          <section className="top-grid">
            <MetricCard title="TOTAL ATTACKS" value={<CountUp end={stats.totalAttacks} />} change={`${stats.blockedCount} Blocked`} color="#3b82f6" icon="📡" />
            <MetricCard title="SUCCESSFUL BREACHES" value={<CountUp end={stats.successfulAttacks} />} change="High Risk" color="#ef4444" icon="⚠️" />
            <MetricCard title="ACTIVE RULES" value={`${stats.activeRules}/${stats.totalRules}`} change={`${((stats.activeRules/stats.totalRules)*100).toFixed(0)}% Coverage`} color="#10b981" icon="🛡️" />
            <MetricCard title="AVG EXECUTION" value={`${stats.avgExecutionTime.toFixed(0)}ms`} change="Latency" color="#a855f7" icon="⚡" />
          </section>

          <div className="content-grid">
            <div style={{background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px"}}>
               <p style={{color: "#94a3b8", fontSize: "12px", marginBottom: "15px"}}>LIVE_PAYLOAD_MONITOR</p>
               <pre style={{color: "#4ade80", background: "#020617", padding: "20px", borderRadius: "8px", overflowX: "auto", fontSize:'13px'}}>
                  {`{ 
  "latest_payload": "${stats.latestPayload}", 
  "engine_status": "ANALYZING",
  "avg_speed": "${stats.avgExecutionTime.toFixed(2)}ms" 
}`}
               </pre>
            </div>

            <div style={{background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "30px", textAlign: "center"}}>
               <p style={{color: "#fff", marginBottom: "20px"}}>BREACH PROBABILITY</p>
               <div style={{width: "120px", height: "120px", border: `8px solid ${stats.successRate > 20 ? '#ef4444' : '#3b82f6'}`, borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", color:'white'}}>
                {stats.successRate}%
               </div>
               <button className="blue-action-btn" onClick={handleExportLogs}>Export</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;