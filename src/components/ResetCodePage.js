import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [codeOTP, setcodeOTP] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codeOTP) {
      setMessage("Please enter the code");
      return;
    }
    try {
      setLoading(true);
      
      // 1. التحقق من الكود
      const response = await api.post("/api/Authentication/verify-forgot-password-otp", { 
        email, 
        codeOTP 
      });

      // 2. استخلاص الـ resetToken من الـ Object اللي راجع من السيرفر
      // الرد اللي بيجيلك هو { "resetToken": "CfDJ8..." }
      const tokenFromServer = response.data.resetToken;

      if (tokenFromServer) {
        setMessage("success");
        setTimeout(() => {
          // 3. نبعت الـ Token النصي فقط للصفحة التالية
          navigate("/reset-password", { state: { email, serverToken: tokenFromServer } });
        }, 1000);
      } else {
        setMessage("Security token missing from response");
      }

    } catch (err) {
      const errorData = err.response?.data;
      let errorText = "Invalid or expired code";
      if (typeof errorData === "string") errorText = errorData;
      else if (errorData?.message) errorText = errorData.message;
      setMessage(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <div style={styles.logoContainer}>
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L0 4.5V13.5C0 21.05 5.14 27.97 12 30C18.86 27.97 24 21.05 24 13.5V4.5L12 0Z" fill="#3b82f6"/>
            </svg>
          </div>
          <h1 style={styles.brandTitle}>VERIFY IDENTITY</h1>
          <p style={styles.brandSubtitle}>SECURE TRANSMISSION SENT</p>
        </div>

        <div style={styles.box}>
          <p style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", marginBottom: "20px" }}>
            Transmission target: <strong style={{color: "#fff"}}>{email}</strong>
          </p>

          {message && (
            <div style={message === "success" ? styles.successBox : styles.errorBox}>
              <p style={{ margin: 0 }}>{message === "success" ? "Identity Verified. Redirecting..." : message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ENTER 6-DIGIT PIN</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔐</span>
                <input 
                  type="text" 
                  value={codeOTP} 
                  onChange={(e) => setcodeOTP(e.target.value)} 
                  style={{...styles.input, letterSpacing: "8px", fontSize: "18px", fontWeight: "bold"}} 
                  maxLength={6} 
                  placeholder="------" 
                />
              </div>
            </div>

            <button style={styles.submitButton} disabled={loading}>
              {loading ? "AUTHENTICATING..." : "VERIFY CODE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#050914", backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`, backgroundSize: "40px 40px", fontFamily: "'Inter', sans-serif" },
  container: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" },
  headerSection: { textAlign: "center", marginBottom: "40px" },
  logoContainer: { width: "60px", height: "60px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px auto" },
  brandTitle: { color: "#ffffff", fontSize: "24px", fontWeight: "700", letterSpacing: "3px" },
  brandSubtitle: { color: "#3b82f6", fontSize: "12px", fontWeight: "600", letterSpacing: "2px" },
  box: { background: "rgba(10, 15, 30, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "420px" },
  errorBox: { background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.5)", color: "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontSize: "13px" },
  successBox: { background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.5)", color: "#10b981", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontSize: "13px" },
  inputGroup: { marginBottom: "24px" },
  label: { display: "block", color: "#94a3b8", fontSize: "11px", fontWeight: "600", marginBottom: "8px" },
  inputWrapper: { display: "flex", alignItems: "center", background: "rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", overflow: "hidden" },
  inputIcon: { padding: "0 15px" },
  input: { flex: 1, background: "transparent", border: "none", color: "#ffffff", padding: "14px", outline: "none" },
  submitButton: { width: "100%", padding: "16px", background: "linear-gradient(to right, #2563eb, #3b82f6)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }
};

export default ResetCode;