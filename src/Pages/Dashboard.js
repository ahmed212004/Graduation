import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import CountUp from "react-countup";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAttacks: 14205, // قيم افتراضية لحين التحميل
    successfulAttacks: 0,
    successRate: 0,
    latestPayload: "Waiting for data..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // طلب الهجمات الناجحة عشان نحسب منها الأرقام
      const response = await api.get("/api/Attacks/Get_Successful_Attacks?PageNumber=1&PageSize=10");
      
      // لنفترض أن الباك إند بيرجع إجمالي العناصر في الحقل totalCount أو items.length
      const successCount = response.data.totalCount || response.data.items?.length || 0;
      const totalAttempted = 15000; // ده رقم افتراضي كمثال لإجمالي الهجمات (Blocked + Success)
      
      setStats({
        totalAttacks: totalAttempted,
        successfulAttacks: successCount,
        successRate: ((successCount / totalAttempted) * 100).toFixed(2),
        latestPayload: response.data.items?.[0]?.payload || "No recent breaches detected"
      });
    } catch (err) {
      console.error("Error fetching dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={styles.container}>
        <Sidebar />

        <main style={styles.main}>
          {/* --- Breadcrumbs --- */}
          <div style={styles.breadcrumbs}>
            Strike Defender AI  ›  Security Overview  ›  <span style={{color: '#fff'}}>Real-time Analytics</span>
          </div>

          {/* --- Header Section --- */}
          <div style={styles.header}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <h1 style={styles.title}>Intelligence Overview</h1>
                <span style={styles.liveBadge}>LIVE MONITORING</span>
              </div>
              <p style={styles.subtitle}>AI-driven analysis of blocked vs. successful system infiltrations.</p>
            </div>
            <div style={styles.actionButtons}>
              <button style={styles.secondaryBtn} onClick={fetchDashboardData}>Refresh Metrics</button>
              <button style={styles.primaryBtn} onClick={() => navigate("/successful-attacks")}>View All Breaches</button>
            </div>
          </div>

          {/* --- Top Metrics Grid (المعلومات اللي طلبتها) --- */}
          <div style={styles.topGrid}>
            <MetricCard 
              title="TOTAL ATTACK ATTEMPTS" 
              value={<CountUp end={stats.totalAttacks} separator="," />} 
              change="Detected by WAF" 
              color="#3b82f6" 
            />
            <MetricCard 
              title="SUCCESSFUL BREACHES" 
              value={<CountUp end={stats.successfulAttacks} />} 
              change="Bypassed AI Filters" 
              color="#ef4444" 
              icon="🚨" 
            />
            <MetricCard 
              title="ATTACK SUCCESS RATE" 
              value={`${stats.successRate}%`} 
              change={stats.successRate > 5 ? "Critical" : "Secure Range"} 
              color={stats.successRate > 5 ? "#ef4444" : "#10b981"} 
              icon="📉" 
            />
          </div>

          {/* --- Main Content Grid --- */}
          <div style={styles.contentGrid}>
            {/* Left: Latest Breach Analysis */}
            <div style={styles.ruleSection}>
              <div style={styles.cardHeader}>
                <span>{`</> LATEST SUCCESSFUL PAYLOAD ANALYSIS`}</span>
                <span style={{fontSize: '10px', color: '#4ade80'}}>RECOGNIZED BY AI</span>
              </div>
              <pre style={styles.codeBlock}>
{`// Trace ID: SD-${Math.floor(Math.random() * 9000) + 1000}
// Type: Injection Attempt
{
  "status": "PASSED",
  "payload": "${stats.latestPayload}",
  "risk_score": 0.94,
  "action": "logged_and_analyzed",
  "engine": "Aegis_AI_v2.4"
}`}
              </pre>
            </div>

            {/* Right: Security Status & Actions */}
            <div style={styles.sideColumn}>
              <div style={styles.precisionCard}>
                <p style={styles.smallTitle}>SYSTEM INTEGRITY</p>
                <div style={styles.circleBox}>
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                    <motion.circle 
                      cx="60" cy="60" r="50" fill="transparent" stroke="#10b981" strokeWidth="8" 
                      strokeDasharray="314" initial={{ strokeDashoffset: 314 }} 
                      animate={{ strokeDashoffset: 314 * (stats.successRate / 100) }}
                      transition={{duration: 2}}
                      style={{ rotate: -90, transformOrigin: "50% 50%" }}
                    />
                  </svg>
                  <div style={styles.circleText}>
                    <span style={{fontSize: '22px', fontWeight: 'bold'}}>{100 - stats.successRate}%</span>
                    <span style={{fontSize: '9px', color: '#64748b'}}>SECURE</span>
                  </div>
                </div>
                <p style={styles.tinyNote}>Defensive mechanisms are operating at peak efficiency.</p>
              </div>

              <div style={styles.actionCard}>
                <p style={styles.smallTitle}>QUICK ACTIONS</p>
                <button style={styles.blueActionBtn}>Generate Security Report</button>
                <button style={styles.darkActionBtn}>Update AI Models</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Metric Card Sub-component ---
const MetricCard = ({ title, value, change, color, icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    style={styles.metricCard}
  >
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <span style={styles.metricTitle}>{title}</span>
      <span>{icon}</span>
    </div>
    <div style={styles.metricValueBox}>
      <h2 style={styles.metricValue}>{value}</h2>
      <span style={{color: color, fontSize: '12px'}}>{change}</span>
    </div>
    <div style={{height: '3px', width: '100%', background: '#1e293b', borderRadius: '2px', overflow: 'hidden'}}>
        <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: '70%' }} 
            style={{ height: '100%', background: color }} 
        />
    </div>
  </motion.div>
);

const styles = {
pageWrapper: { 
    minHeight: "100vh", 
    background: "#020617", 
    color: "#fff",
    display: "flex", 
    flexDirection: "column",
  },

  container: { 
    display: "flex", 
    flex: 1, 
    // 👈 أهم سطر: السايدبار والـ Main هيبدأوا بعد النافبار بـ 70px
    marginTop: "70px", 
  },

  main: { 
    flex: 1, 
    // 👈 لو عرض السايدبار 220px، يبقى الـ margin هنا 220px
    marginLeft: "220px", 
    padding: "30px 40px",
    width: "calc(100% - 220px)", 
    minHeight: "calc(100vh - 70px)",
    boxSizing: "border-box",
  },
  breadcrumbs: { fontSize: '11px', color: '#475569', marginBottom: '20px', letterSpacing: '1px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '26px', fontWeight: 'bold', letterSpacing: '-0.5px' },
  liveBadge: { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid rgba(59, 130, 246, 0.3)' },
  subtitle: { color: '#64748b', fontSize: '14px', marginTop: '5px' },
  actionButtons: { display: 'flex', gap: '10px' },
  primaryBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  secondaryBtn: { background: 'transparent', color: '#94a3b8', border: '1px solid #1e293b', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  topGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  metricCard: { background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  metricTitle: { color: '#64748b', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' },
  metricValueBox: { display: 'flex', alignItems: 'baseline', gap: '10px', margin: '12px 0' },
  metricValue: { fontSize: '28px', fontWeight: 'bold' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' },
  ruleSection: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' },
  cardHeader: { background: '#1e293b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' },
  codeBlock: { padding: '20px', color: '#4ade80', fontSize: '13px', lineHeight: '1.6', fontFamily: "'Courier New', Courier, monospace", margin: 0, background: '#020617', overflowX: 'auto' },
  sideColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  precisionCard: { background: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '12px', textAlign: 'center' },
  circleBox: { position: 'relative', display: 'flex', justifyContent: 'center', margin: '15px 0' },
  circleText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', textAlign: 'center' },
  smallTitle: { fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' },
  tinyNote: { fontSize: '11px', color: '#475569', fontStyle: 'italic', marginTop: '10px' },
  actionCard: { background: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  blueActionBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' },
  darkActionBtn: { background: '#1e293b', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
};

export default Dashboard;