import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // 👈 استدعاء مكتبة الأنيميشن

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 👈 State عشان تأثير الـ Glow
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/api/Authentication/login", { email, password });
      
      // حفظ التوكن (حسب شكل الاستجابة من الباك إند)
      const token = response.data.token || response.data.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setError("Login failed. No access token received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      {/* 👇 كود تحريك الخلفية */}
      <style>
        {`
          @keyframes panBackground {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
          }
        `}
      </style>

      <Navbar />
      
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <div style={styles.logoContainer}>
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L0 4.5V13.5C0 21.05 5.14 27.97 12 30C18.86 27.97 24 21.05 24 13.5V4.5L12 0Z" fill="#3b82f6"/></svg>
          </div>
          <h1 style={styles.brandTitle}>SYSTEM LOGIN</h1>
          <p style={styles.brandSubtitle}>AUTHENTICATE TO ACCESS SECURE CORE</p>
        </div>

        {/* 👇 ظهور من الأسفل */}
        <motion.div 
          style={styles.box}
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {error && (
            <div style={styles.errorBox}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>AGENT EMAIL</label>
              <div style={{ ...styles.inputWrapper, ...(focusedInput === 'email' ? styles.inputWrapperFocused : {}) }}>
                <span style={{ ...styles.inputIcon, color: focusedInput === 'email' ? '#8b5cf6' : '#64748b' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  onFocus={() => setFocusedInput('email')} 
                  onBlur={() => setFocusedInput(null)} 
                  style={styles.input} 
                  required 
                  placeholder="agent@strike.gov" 
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{...styles.label, marginBottom: 0}}>PASSWORD</label>
                <span 
                  onClick={() => navigate("/forgot-password")} 
                  style={{ color: "#3b82f6", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}
                >
                  FORGOT PASSWORD?
                </span>
              </div>
              <div style={{ ...styles.inputWrapper, ...(focusedInput === 'password' ? styles.inputWrapperFocused : {}) }}>
                <span style={{ ...styles.inputIcon, color: focusedInput === 'password' ? '#8b5cf6' : '#64748b' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  onFocus={() => setFocusedInput('password')} 
                  onBlur={() => setFocusedInput(null)} 
                  style={styles.input} 
                  required 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button style={styles.submitButton} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
            </button>
            
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <span style={{ color: "#64748b", fontSize: "12px" }}>NO CLEARANCE YET? </span>
              <span 
                onClick={() => navigate("/register")} 
                style={{ color: "#3b82f6", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
              >
                Sign up
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#050914", backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`, backgroundSize: "40px 40px", animation: "panBackground 4s linear infinite", fontFamily: "'Inter', sans-serif", position: "relative" },
  container: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "60px", paddingBottom: "80px" },
  headerSection: { textAlign: "center", marginBottom: "40px" },
  logoContainer: { width: "60px", height: "60px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px auto", boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" },
  brandTitle: { color: "#ffffff", fontSize: "24px", fontWeight: "700", letterSpacing: "3px", margin: "0 0 8px 0" },
  brandSubtitle: { color: "#3b82f6", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", margin: 0 },
  box: { background: "rgba(10, 15, 30, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.1)" },
  errorBox: { background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.5)", color: "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", textAlign: "center" },
  inputGroup: { marginBottom: "24px", textAlign: "left" },
  label: { display: "block", color: "#94a3b8", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "8px" },
  inputWrapper: { display: "flex", alignItems: "center", background: "rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", overflow: "hidden", transition: "all 0.3s ease" },
  inputWrapperFocused: { border: "1px solid #8b5cf6", boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)", background: "rgba(0, 0, 0, 0.5)" },
  inputIcon: { color: "#64748b", padding: "0 15px", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.3s ease" },
  input: { flex: 1, background: "transparent", border: "none", color: "#ffffff", padding: "14px 14px 14px 0", fontSize: "14px", outline: "none" },
  submitButton: { width: "100%", padding: "16px", background: "linear-gradient(to right, #2563eb, #3b82f6)", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)", transition: "transform 0.1s ease, box-shadow 0.3s ease" }
};
export default Login;