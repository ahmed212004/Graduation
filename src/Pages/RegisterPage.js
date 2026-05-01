import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion"; // ضفنا الأنيميشن
import "../style/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // لإظهار الباسورد
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors([]);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors([]);
      await api.post("/api/Authentication/register", form);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/VerifyAccount", { state: { email: form.email }, replace: true });
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const allErrors = Object.values(serverErrors).flat();
        setErrors(allErrors);
      } else {
        const fallbackMsg = err.response?.data?.title || "Registration failed.";
        setErrors([fallbackMsg]);
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
          <div className="auth-logo-box">🛡️</div>
          <h1 className="auth-brand-title">STRIKE DEFENDER</h1>
          <p className="auth-brand-subtitle">NEW RECRUIT CLEARANCE</p>
        </div>

        {/* ضفنا نفس الـ motion.div اللي في الـ Login */}
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {errors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="auth-error-box" 
                style={{ textAlign: "left" }}
              >
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#ff4d4d", fontSize: "0.9rem" }}>
                  {errors.map((error, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>⚠️ {error}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">ASSIGN ENTERPRISE EMAIL</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">📧</span>
                <input 
                  className="auth-input" 
                  type="email" 
                  name="email" 
                  placeholder="user@enterprise.com" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">CREATE SECURITY PASSWORD</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🔒</span>
                <input 
                  className="auth-input" 
                  type={showPassword ? "text" : "password"} // تغيير النوع ديناميكياً
                  name="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  required 
                />
                {/* زر إظهار الباسورد بنفس شكل الـ Login */}
                <button 
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
              <small style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "5px", display: "block" }}>
                Must include: Uppercase, Lowercase, Number, and Special Character.
              </small>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "INITIALIZING..." : "SIGN UP"}
            </button>
          </form>

          <div className="auth-card-footer">
            <p className="auth-link-text">
              Already have access? <span onClick={() => navigate('/login')} className="auth-link" style={{cursor: 'pointer'}}>Login</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;