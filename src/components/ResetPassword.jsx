import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import "../style/Auth.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const serverToken = location.state?.serverToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // التحكم في إظهار الباسورد للخانتين
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // حماية الصفحة من الدخول المباشر بدون بيانات
  if (!email || !serverToken) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-container">
          <div className="auth-card">
            <p className="auth-error-box">SESSION INVALID</p>
            <button className="auth-submit-btn" onClick={() => navigate("/forgot-password")}>RETRY</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { 
      setMessage("Passwords do not match"); 
      return; 
    }
    try {
      setLoading(true);
      setMessage("");
      await api.post("/api/Authentication/reset-password", { 
        email, 
        token: serverToken, 
        newPassword, 
        confirmNewPassword: confirmPassword 
      });
      setMessage("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-box">🔑</div>
          <h1 className="auth-brand-title">NEW ENCRYPTION</h1>
          <p className="auth-brand-subtitle">UPDATE YOUR CORE CREDENTIALS</p>
        </div>

        <motion.div 
          className="auth-card" 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
        >
          {/* رسائل النجاح أو الخطأ */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={message === "success" ? "auth-success-box" : "auth-error-box"}
              >
                {message === "success" ? "✅ Password Updated! Redirecting..." : `⚠️ ${message}`}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {/* الخانة الأولى: New Password */}
            <div className="auth-input-group">
              <label className="auth-label">NEW PASSWORD</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🔒</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="auth-input" 
                  value={newPassword} 
                  onChange={(e) => { setNewPassword(e.target.value); setMessage(""); }} 
                  required 
                />
                {/* زر العين موجود في أول خانة وبيتحكم في الاتنين */}
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

            {/* الخانة الثانية: Confirm Password */}
            <div className="auth-input-group">
              <label className="auth-label">CONFIRM PASSWORD</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🛡️</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="auth-input" 
                  value={confirmPassword} 
                  onChange={(e) => { setConfirmPassword(e.target.value); setMessage(""); }} 
                  required 
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "UPDATING..." : "CONFIRM CHANGE"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;