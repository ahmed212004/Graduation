import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

// استدعاء ملف الستايل الموحد
import "../style/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/api/Authentication/login", { email, password });
      
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
    <div className="auth-page-wrapper">
      <Navbar />
      
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-box">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M12 0L0 4.5V13.5C0 21.05 5.14 27.97 12 30C18.86 27.97 24 21.05 24 13.5V4.5L12 0Z" fill="#3b82f6"/>
            </svg>
          </div>
          <h1 className="auth-brand-title">SYSTEM LOGIN</h1>
          <p className="auth-brand-subtitle">AUTHENTICATE TO ACCESS SECURE CORE</p>
        </div>

        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {error && (
            <div className="auth-error-box">
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label className="auth-label">AGENT EMAIL</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input 
                  className="auth-input"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="agent@strike.gov" 
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="auth-label" style={{ marginBottom: 0 }}>PASSWORD</label>
                <span 
                  onClick={() => navigate("/forgot-password")} 
                  style={{ color: "#3b82f6", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}
                >
                  FORGOT PASSWORD?
                </span>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input 
                  className="auth-input"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
            </button>
            
            <div className="auth-card-footer">
              <p className="auth-link-text">
                NO CLEARANCE YET? 
                <span onClick={() => navigate("/register")} className="auth-link">Sign up</span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;