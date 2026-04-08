import React, { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

function PromptTesting() {
  const [promptText, setPromptText] = useState("");
  const [attackType, setAttackType] = useState(1); // Default: SQLi (1)
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTestPrompt = async () => {
    if (!promptText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // الـ Endpoint والـ Body زي ما بعتلي بالظبط
      const response = await api.post("/api/Attacks/Test_Prompts", {
        prompt: promptText,
        type: parseInt(attackType),
      });

      setResult(response.data);
    } catch (err) {
      // عرض رسالة الخطأ لو الـ API وقع أو فيه مشكلة في الشبكة
      setError(err.response?.data?.message || "AI Engine Error: Connection failed.");
      console.error(err);
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
          {/* --- Header --- */}
          <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={styles.title}>AI Attack Simulator</h1>
              <span style={styles.betaBadge}>V1.0 LIVE</span>
            </div>
            <p style={styles.subtitle}>
              Test custom payloads to see how the AI neural engine classifies threats.
            </p>
          </div>

          <div style={styles.grid}>
            {/* --- Left Side: Terminal Input --- */}
            <div style={styles.inputCard}>
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={styles.pulseDot}></div>
                  <span>TERMINAL INPUT</span>
                </div>
                <select
                  style={styles.select}
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                >
                  <option value={1}>SQL Injection (Type 1)</option>
                  <option value={2}>XSS (Type 2)</option>
                </select>
              </div>

              <textarea
                style={styles.textarea}
                placeholder="Enter payload here... (e.g. ' OR 1=1 --)"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />

              <button
                style={loading || !promptText.trim() ? styles.btnDisabled : styles.btn}
                onClick={handleTestPrompt}
                disabled={loading || !promptText.trim()}
              >
                {loading ? "ANALYZING..." : "EXECUTE AI SCAN"}
              </button>
            </div>

            {/* --- Right Side: Engine Response --- */}
            <div style={styles.resultCard}>
              <div style={styles.cardHeader}>
                <span>ENGINE RESPONSE</span>
              </div>
              <div style={styles.console}>
                <AnimatePresence mode="wait">
                  {!result && !loading && !error && (
                    <p style={styles.placeholderText}>
                       System idle. Awaiting vector input...
                    </p>
                  )}

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={styles.loadingText}
                    >
                      Initializing Neural Scan...
                      <br />
                      Analyzing payload entropy...
                      <br />
                      Matching against attack patterns...
                    </motion.div>
                  )}

                  {error && <p style={styles.errorText}>[CRITICAL ERROR]: {error}</p>}

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={styles.resultContent}
                    >
                      <div
                        style={{
                          ...styles.resultStatus,
                          borderColor: result.isAttack ? "#ef4444" : "#10b981",
                        }}
                      >
                        <span style={result.isAttack ? styles.blocked : styles.passed}>
                          {result.isAttack ? "🔥 ATTACK DETECTED" : "✅ CLEAN TRAFFIC"}
                        </span>
                        <span style={styles.score}>
                          Confidence: {((result.confidence || 0.98) * 100).toFixed(2)}%
                        </span>
                      </div>

                      <div style={styles.jsonWrapper}>
                        <pre style={styles.jsonOutput}>
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
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
  header: { marginBottom: "30px" },
  title: { fontSize: "26px", fontWeight: "bold", letterSpacing: "-0.5px" },
  betaBadge: {
    fontSize: "10px",
    background: "#1e293b",
    padding: "4px 8px",
    borderRadius: "4px",
    color: "#3b82f6",
    border: "1px solid #334155",
  },
  subtitle: { color: "#64748b", fontSize: "14px", marginTop: "5px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "25px",
  },
  inputCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    background: "#1e293b",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: "bold",
    color: "#94a3b8",
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    background: "#3b82f6",
    borderRadius: "50%",
    boxShadow: "0 0 10px #3b82f6",
  },
  select: {
    background: "#020617",
    color: "#3b82f6",
    border: "1px solid #334155",
    borderRadius: "4px",
    fontSize: "11px",
    padding: "5px",
    outline: "none",
  },
  textarea: {
    flex: 1,
    minHeight: "350px",
    background: "#020617",
    border: "none",
    padding: "25px",
    color: "#4ade80",
    fontFamily: "'Courier New', monospace",
    fontSize: "15px",
    outline: "none",
    resize: "none",
    lineHeight: "1.5",
  },
  btn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
    letterSpacing: "1px",
    transition: "0.2s",
  },
  btnDisabled: {
    background: "#1e293b",
    color: "#475569",
    padding: "18px",
    textAlign: "center",
    cursor: "not-allowed",
  },
  resultCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    overflow: "hidden",
  },
  console: {
    padding: "25px",
    background: "#020617",
    height: "410px",
    overflowY: "auto",
    fontFamily: "monospace",
  },
  placeholderText: { color: "#334155", fontSize: "13px" },
  loadingText: { color: "#3b82f6", fontSize: "13px", lineHeight: "2" },
  errorText: { color: "#ef4444", fontSize: "13px" },
  resultContent: { display: "flex", flexDirection: "column", gap: "20px" },
  resultStatus: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.02)",
  },
  blocked: { color: "#ef4444", fontWeight: "bold", fontSize: "14px" },
  passed: { color: "#4ade80", fontWeight: "bold", fontSize: "14px" },
  score: { color: "#94a3b8", fontSize: "12px" },
  jsonWrapper: {
    background: "rgba(15, 23, 42, 0.5)",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #1e293b",
  },
  jsonOutput: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },
};

export default PromptTesting;