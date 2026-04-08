import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import "../style/Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/Authentication/forgot-password", { email });
      navigate("/reset-code", { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending request");
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
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none"><path d="M12 0L0 4.5V13.5C0 21.05 5.14 27.97 12 30C18.86 27.97 24 21.05 24 13.5V4.5L12 0Z" fill="#3b82f6"/></svg>
          </div>
          <h1 className="auth-brand-title">SYSTEM RECOVERY</h1>
          <p className="auth-brand-subtitle">INITIATE PASSWORD RESET</p>
        </div>

        <motion.div className="auth-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {message && <div className="auth-error-box">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">REGISTERED EMAIL</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">@</span>
                <input type="email" className="auth-input" placeholder="user@enterprise.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "TRANSMITTING..." : "SEND RECOVERY CODE"}
            </button>
          </form>
          <div className="auth-card-footer">
            <p className="auth-link-text">Remembered? <span onClick={() => navigate("/login")} className="auth-link">Abort</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default ForgotPassword;