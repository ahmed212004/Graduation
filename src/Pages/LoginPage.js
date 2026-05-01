import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

import "../style/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      // 1. طلب تسجيل الدخول
      const response = await api.post("/api/Authentication/login", { email, password });
      
      // ملاحظة: تأكد من شكل الـ response.data في الـ Console عندك
      const token = response.data.token || response.data.data?.token;

      // 2. فحص حالة التفعيل (لو الـ API بيرجعها)
      if (response.data.isVerified === false) {
        // تأكد إن المسار مطابق لـ App.js وهو "/VerifyAccount"
        navigate("/VerifyAccount", { state: { email } });
        return; 
      }

      if (token) {
        // 🔑 أهم خطوة: حفظ التوكن لفتح الـ ProtectedRoute
        localStorage.setItem("token", token);
        
        // التوجه للـ Dashboard (تأكد إن الحرف D سمول أو كابيتال حسب App.js)
        navigate("/dashboard");
      } else {
        setError("Access Denied: No authentication token received.");
      }

    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "";
      
      console.error("Login Error:", err.response);

      // 3. التعامل مع الحسابات غير المفعلة (لو السيرفر بيرجع 400 أو 401)
      if (
        errorMessage.toLowerCase().includes("verify") || 
        errorMessage.toLowerCase().includes("confirm") ||
        err.response?.status === 403 // أحياناً السيرفر بيرجع 403 للحسابات غير المفعلة
      ) {
        navigate("/VerifyAccount", { state: { email } });
      } else {
        setError(errorMessage || "Authentication failed. Check your credentials.");
      }
      
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
             🛡️
          </div>
          <h1 className="auth-brand-title">SYSTEM LOGIN</h1>
          <p className="auth-brand-subtitle">AUTHENTICATE TO ACCESS SECURE CORE</p>
        </div>

        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }} 
                className="auth-error-box"
              >
                <span>⚠️ {error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label className="auth-label">AGENT EMAIL</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">📧</span>
                <input 
                  className={`auth-input ${error ? 'auth-input-error' : ''}`}
                  type="email" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); setError(""); }} 
                  required 
                  placeholder="agent@strike.gov" 
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="auth-label">PASSWORD</label>
                <span onClick={() => navigate("/forgot-password")} className="auth-link" style={{fontSize: '11px', cursor: 'pointer'}}>FORGOT?</span>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🔒</span>
                <input 
                  className={`auth-input ${error ? 'auth-input-error' : ''}`}
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => { setPassword(e.target.value); setError(""); }} 
                  required 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </button>
            
            <div className="auth-card-footer">
              <p className="auth-link-text">
                NO CLEARANCE? <span onClick={() => navigate("/register")} className="auth-link" style={{cursor: 'pointer'}}>Sign up</span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;