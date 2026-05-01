import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]); // دي المصفوفة اللي هنخزن فيها الأخطاء
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors([]); // بنصفر الأخطاء أول ما المستخدم يبدأ يكتب تاني
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

      navigate("/VerifyAccount", { 
        state: { email: form.email }, 
        replace: true 
      });

    } catch (err) {
      console.error("Register Error:", err.response?.data);

      // هنا اللعبة كلها: بنشوف السيرفر بعت أخطاء Validation ولا لأ
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) {
        /** * السيرفر بيبعت الأخطاء كـ Object: { Password: ["error1", "error2"], Email: ["error3"] }
         * إحنا بنحولها لمصفوفة واحدة (Flat Array) عشان نعرضها تحت بعضها
         */
        const allErrors = Object.values(serverErrors).flat();
        setErrors(allErrors);
      } else {
        // لو مفيش أخطاء محددة، بنعرض العنوان العام للخطأ أو رسالة افتراضية
        const fallbackMsg = err.response?.data?.title || "Registration failed. Please check your data.";
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

        <div className="auth-card">
          {/* عرض الأخطاء بشكل قائمة (Bullet Points) */}
          {errors.length > 0 && (
            <div className="auth-error-box" style={{ textAlign: "left" }}>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#ff4d4d", fontSize: "0.9rem" }}>
                {errors.map((error, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>{error}</li>
                ))}
              </ul>
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
              <small style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "5px", display: "block" }}>
                Must include: Uppercase, Lowercase, Number, and Special Character (@#$!).
              </small>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "INITIALIZING..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-card-footer">
            <p className="auth-link-text">
              Already have access? <span onClick={() => navigate('/login')} className="auth-link" style={{cursor: 'pointer'}}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;