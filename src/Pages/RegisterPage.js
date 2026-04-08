import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

// استدعاء ملف الستايل الجديد
import "../style/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/Dashboard", { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors([]);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErrors(["Email and Password are required"]);
      return;
    }
    try {
      setLoading(true);
      await api.post("/api/Authentication/register", form);
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setErrors([msg]);
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
          <h1 className="auth-brand-title">STRIKE DEFENDER</h1>
          <p className="auth-brand-subtitle">NEW RECRUIT CLEARANCE</p>
        </div>

        <div className="auth-card">
          {errors.length > 0 && (
            <div className="auth-error-box">
              {errors.map((e, i) => <p key={i} style={{ margin: 0 }}>{e}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">ASSIGN ENTERPRISE EMAIL</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">@</span>
                <input 
                  className="auth-input"
                  type="email" 
                  name="email" 
                  placeholder="user@enterprise.com" 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">CREATE SECURITY PASSWORD</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🔑</span>
                <input 
                  className="auth-input"
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "INITIALIZING..." : "REQUEST CLEARANCE"}
            </button>
          </form>

          <div className="auth-card-footer">
            <p className="auth-link-text">
              Already have access? 
              <span onClick={() => navigate("/login")} className="auth-link">Secure Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;