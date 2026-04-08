import React, { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

import "../style/Simulator.css";

function PromptTesting() {
  const [promptText, setPromptText] = useState("");
  const [attackType, setAttackType] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // لإدارة السايدبار في الموبايل

  const handleTestPrompt = async () => {
    if (!promptText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post("/api/Attacks/Test_Prompts", {
        prompt: promptText,
        type: parseInt(attackType),
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "AI Engine Error: Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulator-page-wrapper">
      <Navbar />
      
      {/* زر الموبايل للسايدبار (بنفس ستايل الداشبورد) */}
      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className="simulator-container">
        <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        <main className={`simulator-main ${isMenuOpen ? 'blur-effect' : ''}`} onClick={() => isMenuOpen && setIsMenuOpen(false)}>
          <header style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: "bold", margin: 0 }}>AI Attack Simulator</h1>
              <span className="beta-badge-style">V1.0 LIVE</span>
            </div>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
              Test custom payloads to see how the AI neural engine classifies threats.
            </p>
          </header>

          <div className="simulator-grid">
            {/* --- الطرف الأيسر: Terminal Input --- */}
            <div className="input-card">
              <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="pulse-dot"></div>
                  <span>TERMINAL INPUT</span>
                </div>
                <select
                  className="simulator-select"
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                >
                  <option value={1}>SQL Injection type 1</option>
                  <option value={2}>XSS Attack type 2</option>
                </select>
              </div>

              <textarea
                className="terminal-textarea"
                placeholder="root@strike_defender:~$ Enter payload here..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />

              <button
                className="execute-btn"
                onClick={handleTestPrompt}
                disabled={loading || !promptText.trim()}
              >
                {loading ? "ANALYZING..." : "EXECUTE AI SCAN"}
              </button>
            </div>

            {/* --- الطرف الأيمن: Engine Response --- */}
            <div className="result-card">
              <div className="card-header">
                <span>ENGINE RESPONSE</span>
              </div>
              <div className="console-window">
                <AnimatePresence mode="wait">
                  {!result && !loading && !error && (
                    <p style={{ color: "#334155" }}>System idle. Awaiting vector input...</p>
                  )}

                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#3b82f6", lineHeight: '1.8' }}>
                      {`[>]`} Initializing Neural Scan...<br />
                      {`[>]`} Analyzing payload entropy...<br />
                      {`[>]`} Matching against attack patterns...
                    </motion.div>
                  )}

                  {error && <p style={{ color: "#ef4444" }}>[CRITICAL ERROR]: {error}</p>}

                  {result && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <div 
                        className="result-status-box" 
                        style={{ borderColor: result.isAttack ? "#ef4444" : "#10b981" }}
                      >
                        <span style={{ color: result.isAttack ? "#ef4444" : "#4ade80", fontWeight: "bold" }}>
                          {result.isAttack ? "🔥 ATTACK DETECTED" : "✅ CLEAN TRAFFIC"}
                        </span>
                        <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                          Confidence: {((result.confidence || 0.98) * 100).toFixed(2)}%
                        </span>
                      </div>

                      <pre className="json-output-style">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PromptTesting;