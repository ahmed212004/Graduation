import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

// استدعاء الستايل
import "../style/SuccessfulAttacks.css";
import "../style/Dashboard.css"; 

const AttackRow = ({ attack }) => (
  <motion.tr 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <td><span className="tech-badge">{attack.technique}</span></td>
    <td><div className="payload-box" title={attack.payload}>{attack.payload}</div></td>
    <td>
      <span className={attack.statusCode === 200 ? "code-success" : "code-error"}>
        {attack.statusCode}
      </span>
    </td>
    <td>{attack.executionTimeMs?.toFixed(2)} ms</td>
    <td><span className="result-badge">{attack.result}</span></td>
  </motion.tr>
);

function SuccessfulAttacks() {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const pageSize = 10;

  const fetchAttacks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/api/Attacks/Get_Successful_Attacks?PageNumber=${currentPage}&PageSize=${pageSize}`
      );
      setAttacks(data?.items || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setAttacks([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAttacks();
  }, [fetchAttacks]);

  return (
    <div className="attacks-page-wrapper">
      <Navbar />

      {/* زرار المنيو العائم للموبايل */}
      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className="attacks-container">
        <Sidebar isOpen={isMenuOpen} />
        
        <main className={`attacks-main ${isMenuOpen ? 'blur-effect' : ''}`} onClick={() => isMenuOpen && setIsMenuOpen(false)}>
          
          {/* الـ Header الآن سيصبح Sticky من خلال الـ CSS */}
          <header className="attacks-header sticky-header">
            <div>
              <h1 className="attacks-title">Breach Intelligence Log</h1>
              <p className="attacks-subtitle">Analyzing successfully executed payloads and techniques</p>
            </div>
            <div className="danger-badge">LIVE FEED: PAGE {currentPage}</div>
          </header>

          <section className="table-card">
            {loading ? (
              <div style={{ padding: "100px", textAlign: "center", color: "#3b82f6", letterSpacing: "3px" }}>
                INTERCEPTING DATA PACKETS...
              </div>
            ) : (
              <>
                <table className="attacks-table">
                  <thead>
                    <tr>
                      {["TECHNIQUE", "PAYLOAD", "STATUS CODE", "EXECUTION TIME", "RESULT"].map(head => (
                        <th key={head}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attacks.length > 0 ? (
                      attacks.map((attack) => <AttackRow key={attack.attackId} attack={attack} />)
                    ) : (
                      <tr><td colSpan="5" style={{ textAlign: 'center' }}>No breach data found.</td></tr>
                    )}
                  </tbody>
                </table>

                <div className="pagination-bar">
                  <button 
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    PREVIOUS
                  </button>
                  
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>Page {currentPage}</span>
                  
                  <button 
                    className="page-btn"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={attacks.length < pageSize}
                  >
                    NEXT
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default SuccessfulAttacks;