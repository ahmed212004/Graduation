import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import "../style/Auth.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const serverToken = location.state?.serverToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !serverToken) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-container"><div className="auth-card">
          <p className="auth-error-box">SESSION INVALID</p>
          <button className="auth-submit-btn" onClick={() => navigate("/forgot-password")}>RETRY</button>
        </div></div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setMessage("Passwords do not match"); return; }
    try {
      setLoading(true);
      await api.post("/api/Authentication/reset-password", { email, token: serverToken, newPassword, confirmNewPassword: confirmPassword });
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

        <motion.div className="auth-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className={message === "success" ? "auth-success-box" : message ? "auth-error-box" : ""}>
             {message === "success" ? "Password Updated! Redirecting to login..." : message}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">NEW PASSWORD</label>
              <div className="auth-input-wrapper">
                <input type="password" placeholder="••••••••" className="auth-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
            </div>
            <div className="auth-input-group">
              <label className="auth-label">CONFIRM PASSWORD</label>
              <div className="auth-input-wrapper">
                <input type="password" placeholder="••••••••" className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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