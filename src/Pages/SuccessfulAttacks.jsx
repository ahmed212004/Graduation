import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

function SuccessfulAttacks() {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👇 States الخاصة بالـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // عدد العناصر في كل صفحة

  useEffect(() => {
    fetchAttacks();
  }, [currentPage]); // 👈 إعادة الطلب كل ما رقم الصفحة يتغير

  const fetchAttacks = async () => {
    try {
      setLoading(true);
      // 👇 بنبعت الـ currentPage والـ pageSize في الـ URL
      const response = await api.get(
        `/api/Attacks/Get_Successful_Attacks?PageNumber=${currentPage}&PageSize=${pageSize}`
      );
      
      if (response.data && Array.isArray(response.data.items)) {
        setAttacks(response.data.items);
      } else {
        setAttacks([]);
      }
    } catch (err) {
      setError("Connection lost. Retrying encryption...");
      setAttacks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.main}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Breach Intelligence Log</h1>
              <p style={styles.subtitle}>Analyzing successfully executed payloads and techniques</p>
            </div>
            <div style={styles.dangerBadge}>LIVE FEED: PAGE {currentPage}</div>
          </div>

          <div style={styles.tableContainer}>
            {loading ? (
              <div style={styles.loadingState}>INTERCEPTING DATA PACKETS...</div>
            ) : (
              <>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>TECHNIQUE</th>
                      <th style={styles.th}>PAYLOAD</th>
                      <th style={styles.th}>STATUS CODE</th>
                      <th style={styles.th}>EXECUTION TIME</th>
                      <th style={styles.th}>RESULT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attacks.map((attack) => (
                      <motion.tr 
                        key={attack.attackId} 
                        style={styles.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td style={styles.td}><span style={styles.techBadge}>{attack.technique}</span></td>
                        <td style={styles.td}><div style={styles.payloadBox}>{attack.payload}</div></td>
                        <td style={styles.td}>
                          <span style={attack.statusCode === 200 ? styles.codeSuccess : styles.codeOther}>
                            {attack.statusCode}
                          </span>
                        </td>
                        <td style={styles.td}>{attack.executionTimeMs.toFixed(2)} ms</td>
                        <td style={styles.td}><span style={styles.resultBadge}>{attack.result}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* 👇 أزرار الـ Pagination */}
                <div style={styles.paginationContainer}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{...styles.pageButton, opacity: currentPage === 1 ? 0.5 : 1}}
                  >
                    PREVIOUS
                  </button>
                  
                  <span style={styles.pageIndicator}>NODE {currentPage}</span>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={attacks.length < pageSize} // لو الداتا اللي جاية أقل من الـ pageSize يبقى مفيش صفحة تانية
                    style={{...styles.pageButton, opacity: attacks.length < pageSize ? 0.5 : 1}}
                  >
                    NEXT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // ... الاستايلات القديمة زي ما هي ...
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
  header: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
  title: { fontSize: "24px", color: "#f87171", fontWeight: "bold", letterSpacing: "1px" },
  subtitle: { color: "#64748b", fontSize: "14px" },
  dangerBadge: { background: "rgba(248, 113, 113, 0.1)", border: "1px solid #f87171", padding: "8px 15px", borderRadius: "4px", fontSize: "11px", color: "#f87171", fontWeight: "bold" },
  tableContainer: { background: "rgba(15, 23, 42, 0.8)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "15px 20px", background: "rgba(0, 0, 0, 0.3)", color: "#94a3b8", fontSize: "11px", textAlign: "left", letterSpacing: "1px" },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
  td: { padding: "15px 20px", fontSize: "13px" },
  techBadge: { color: "#8b5cf6", fontWeight: "600" },
  payloadBox: { background: "rgba(0,0,0,0.3)", padding: "5px 10px", borderRadius: "4px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  codeSuccess: { color: "#4ade80", fontWeight: "bold" },
  codeOther: { color: "#fbbf24" },
  resultBadge: { background: "#991b1b", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" },
  loadingState: { padding: "100px", textAlign: "center", color: "#3b82f6", letterSpacing: "3px" },

  // 👇 ستايلات الـ Pagination الجديدة
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
    background: "rgba(0, 0, 0, 0.2)",
    borderTop: "1px solid rgba(255,255,255,0.05)"
  },
  pageButton: {
    background: "#1e293b",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    padding: "8px 20px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: "1px",
    transition: "0.3s"
  },
  pageIndicator: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "monospace"
  }
};

export default SuccessfulAttacks;