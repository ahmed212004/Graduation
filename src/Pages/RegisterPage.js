import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // إضافة useNavigate للتوجيه الداخلي
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Auth.css";

function RegisterPage() {
  const navigate = useNavigate(); // تعريف الـ navigate
  const [form, setForm] = useState({ email: "", password: "" });
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
      
      // 1. طلب التسجيل
      await api.post("/api/Authentication/register", form);
      
      // 2. تنظيف شامل للمتصفح لضمان عدم وجود توكن قديم يسبب Redirect عشوائي
      localStorage.clear();
      sessionStorage.clear();

      console.log("Registration success. Navigating to VerifyAccount...");

      // 3. التوجيه لصفحة التفعيل باستخدام navigate مع تمرير الإيميل في الـ state
      // نستخدم replace: true لمنع المستخدم من العودة لصفحة التسجيل بعد النجاح
      navigate("/VerifyAccount", { 
        state: { email: form.email }, 
        replace: true 
      });

    } catch (err) {
      console.error("Register Error:", err.response);
      // محاولة استخراج رسالة الخطأ من السيرفر أو عرض رسالة افتراضية
      const msg = err.response?.data?.message || "Registration failed. This email might already be registered.";
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
          <div className="auth-logo-box">🛡️</div>
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
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "INITIALIZING..." : "REQUEST CLEARANCE"}
            </button>
          </form>

          <div className="auth-card-footer">
            <p className="auth-link-text">
              Already have access? <span onClick={() => navigate('/login')} className="auth-link" style={{cursor: 'pointer'}}>Secure Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;