import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Auth.css";

function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // استخراج الإيميل سواء جاي من الـ URL أو من الـ State (التنقل الداخلي)
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email") || (location.state && location.state.email) || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // تحديث الإيميل لو اتغير في الـ URL
  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 🛑 استخدام الرابط الصحيح المتوافق مع الـ Backend بتاعك
      await api.post("/api/Authentication/confirm-email", { 
        email: email, 
        otp: otp 
      });
      
      setMessage("Account activated successfully! Redirecting to login...");
      
      // التوجه للوجين بعد 3 ثواني لإعطاء فرصة لليوزر يشوف رسالة النجاح
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error("Verification Error:", err.response?.data);
      
      // التعامل الذكي مع رسائل الخطأ من الـ API
      const errorData = err.response?.data;
      
      if (errorData?.errors?.["OTP.Invalid"] || errorData?.errors?.["otp"]) {
        setError("Invalid OTP code. Please check your email and try again.");
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError(errorData?.title || "Verification failed. Please try again.");
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
          <h1 className="auth-brand-title">ACCOUNT VERIFICATION</h1>
          <p className="auth-brand-subtitle">SHIELD ACTIVATION REQUIRED</p>
        </div>

        <div className="auth-card">
          <p style={{ color: "#ccc", textAlign: "center", marginBottom: "20px" }}>
            Verification code sent to: <br/>
            <strong style={{ color: "#a855f7" }}>{email || "your email"}</strong>
          </p>

          {error && <div className="auth-error-box">⚠️ {error}</div>}
          {message && (
            <div className="auth-success-box" style={{ 
              color: "#10b981", 
              textAlign: "center", 
              padding: "10px", 
              background: "rgba(16, 185, 129, 0.1)", 
              borderRadius: "8px", 
              marginBottom: "15px" 
            }}>
              ✅ {message}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="auth-input-group">
              <label className="auth-label">ENTER OTP CODE</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🔢</span>
                <input 
                  className={`auth-input ${error ? 'auth-input-error' : ''}`}
                  type="text" 
                  placeholder="6-Digit Code" 
                  value={otp} 
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError(""); // مسح الخطأ بمجرد ما اليوزر يبدأ يكتب
                  }} 
                  required 
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "VALIDATING..." : "CONFIRM ACTIVATION"}
            </button>
          </form>
          
          <div className="auth-card-footer">
            <p className="auth-link-text">
              Didn't get the code? <span onClick={() => window.location.reload()} className="auth-link" style={{cursor: 'pointer'}}>Resend</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount;