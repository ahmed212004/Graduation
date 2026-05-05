import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Auth.css";

function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  // استخراج الإيميل من الـ query أو state
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery =
    queryParams.get("email") ||
    (location.state && location.state.email) ||
    "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // تحديث الإيميل لو اتغير
  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  // 🔹 تأكيد الكود
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/api/Authentication/confirm-email", {
        email: email,
        otp: otp,
      });

      setMessage("Account activated successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Verification Error:", err.response?.data);

      const errorData = err.response?.data;

      if (
        errorData?.errors?.["OTP.Invalid"] ||
        errorData?.errors?.["otp"]
      ) {
        setError("Invalid OTP code. Please check your email and try again.");
      } else {
        setError(
          errorData?.title ||
            errorData?.message ||
            "Verification failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 إعادة إرسال الكود
  const handleResendCode = async () => {
    if (!email) {
      setError("Email is missing. Please go back and try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await api.post(
        "/api/Authentication/resend-confirmation-email",
        {
          email: email,
        }
      );

      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Resend Error:", err.response?.data);

      setError(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "Failed to resend verification code."
      );
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
          <p
            style={{
              color: "#ccc",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Verification code sent to: <br />
            <strong style={{ color: "#a855f7" }}>
              {email || "your email"}
            </strong>
          </p>

          {error && <div className="auth-error-box">⚠️ {error}</div>}

          {message && (
            <div
              className="auth-success-box"
              style={{
                color: "#10b981",
                textAlign: "center",
                padding: "10px",
                background: "rgba(16, 185, 129, 0.1)",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              ✅ {message}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="auth-input-group">
              <label className="auth-label">ENTER OTP CODE</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">🔢</span>
                <input
                  className={`auth-input ${
                    error ? "auth-input-error" : ""
                  }`}
                  type="text"
                  placeholder="6-Digit Code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError("");
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
              Didn't get the code?{" "}
              <span
                onClick={!loading ? handleResendCode : null}
                className="auth-link"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Sending..." : "Resend"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount;