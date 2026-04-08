import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // استلام الـ String الصافي من الصفحة السابقة
  const email = location.state?.email || "";
  const serverToken = location.state?.serverToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      
      // إرسال البيانات (token هنا هو الـ resetToken اللي استلمناه)
      const requestData = {
        email: email,
        token: serverToken, 
        newPassword: newPassword,
        confirmNewPassword: confirmPassword
      };

      await api.post("/api/Authentication/reset-password", requestData);
      
      setMessage("success");
      setTimeout(() => { navigate("/login"); }, 2000);
    } catch (err) {
      const data = err.response?.data;
      let errorText = "Error resetting password";
      if (data) {
        if (typeof data === "string") errorText = data;
        else if (data.errors) errorText = Object.values(data.errors).flat().join(" | ");
        else if (data.message) errorText = data.message;
      }
      setMessage(errorText);
    } finally {
      setLoading(false);
    }
  };

  // حماية الصفحة من الدخول المباشر بدون توكن
  if (!email || !serverToken) {
    return (
      <div style={styles.pageBackground}>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.box}>
            <p style={{color: "#ef4444", textAlign: "center"}}>SESSION INVALID. PLEASE RE-VERIFY.</p>
            <button style={styles.submitButton} onClick={() => navigate("/forgot-password")}>RETRY</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBackground}>
      <style>{`@keyframes panBackground { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }`}</style>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <div style={styles.logoContainer}>🔑</div>
          <h1 style={styles.brandTitle}>SECURE RESET</h1>
          <p style={styles.brandSubtitle}>NEW ENCRYPTION KEY</p>
        </div>

        <motion.div 
          style={styles.box}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          {message && (
            <div style={message === "success" ? styles.successBox : styles.errorBox}>
              {message === "success" ? "Password Updated Successfully!" : message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>NEW PASSWORD</label>
              <div style={{ ...styles.inputWrapper, ...(focusedInput === 'p1' ? styles.inputWrapperFocused : {}) }}>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setFocusedInput('p1')}
                  onBlur={() => setFocusedInput(null)}
                  style={styles.input} 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <div style={{ ...styles.inputWrapper, ...(focusedInput === 'p2' ? styles.inputWrapperFocused : {}) }}>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedInput('p2')}
                  onBlur={() => setFocusedInput(null)}
                  style={styles.input} 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button style={styles.submitButton} disabled={loading}>
              {loading ? "PROCESSING..." : "CONFIRM CHANGE"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: { minHeight: "100vh", backgroundColor: "#050914", backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`, backgroundSize: "40px 40px", animation: "panBackground 4s linear infinite" },
  container: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" },
  headerSection: { textAlign: "center", marginBottom: "30px" },
  logoContainer: { fontSize: "30px", marginBottom: "15px" },
  brandTitle: { color: "#fff", letterSpacing: "2px", fontWeight: "bold" },
  brandSubtitle: { color: "#3b82f6", fontSize: "12px" },
  box: { background: "rgba(10, 15, 30, 0.8)", padding: "40px", borderRadius: "16px", border: "1px solid rgba(59, 130, 246, 0.2)", width: "100%", maxWidth: "400px" },
  inputGroup: { marginBottom: "20px" },
  label: { color: "#94a3b8", fontSize: "11px", marginBottom: "8px", display: "block" },
  inputWrapper: { background: "#000", borderRadius: "8px", border: "1px solid #334155", transition: "0.3s" },
  inputWrapperFocused: { borderColor: "#3b82f6", boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)" },
  input: { background: "transparent", border: "none", color: "#fff", padding: "14px", width: "100%", outline: "none", boxSizing: "border-box" },
  submitButton: { width: "100%", padding: "16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  errorBox: { color: "#ef4444", marginBottom: "15px", fontSize: "13px", textAlign: "center" },
  successBox: { color: "#10b981", marginBottom: "15px", fontSize: "13px", textAlign: "center" }
};

export default ResetPassword;