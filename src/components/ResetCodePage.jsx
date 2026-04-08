import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import "../style/Auth.css";

function ResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [codeOTP, setcodeOTP] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/api/Authentication/verify-forgot-password-otp", { email, codeOTP });
      const tokenFromServer = response.data.resetToken;
      if (tokenFromServer) {
        setMessage("success");
        setTimeout(() => navigate("/reset-password", { state: { email, serverToken: tokenFromServer } }), 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-box">🔐</div>
          <h1 className="auth-brand-title">VERIFY IDENTITY</h1>
          <p className="auth-brand-subtitle">TRANSMISSION SENT TO {email}</p>
        </div>

        <motion.div className="auth-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className={message === "success" ? "auth-success-box" : message ? "auth-error-box" : ""}>
             {message === "success" ? "Identity Verified. Redirecting..." : message}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">ENTER 6-DIGIT PIN</label>
              <div className="auth-input-wrapper">
                <input 
                  type="text" 
                  className="auth-input" 
                  style={{ textAlign: 'center', letterSpacing: '12px', fontSize: '20px' }}
                  maxLength={6} 
                  value={codeOTP} 
                  onChange={(e) => setcodeOTP(e.target.value)} 
                  placeholder="000000"
                />
              </div>
            </div>
            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "VERIFYING..." : "AUTHENTICATE"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
export default ResetCode;