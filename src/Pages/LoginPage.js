import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

import "../style/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isNotConfirmed, setIsNotConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setIsNotConfirmed(false);

      const response = await api.post("/api/Authentication/login", {
        email,
        password,
      });

      const token = response.data.token || response.data.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setError("Access Denied: No authentication token received.");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);

      const errorData = err.response?.data;
      const serverErrors = errorData?.errors;

      if (serverErrors) {
        const allErrors = Object.values(serverErrors).flat();
        setError(allErrors[0]);

        if (serverErrors["Auth.EmailNotConfirmed"]) {
          setIsNotConfirmed(true);
        }
      } else {
        setError(
          errorData?.title ||
            errorData?.message ||
            "Authentication failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/api/Authentication/resend-confirmation-email",
        {
          email: email,
        }
      );

      setError("Verification code sent successfully. Check your email.");
    } catch (err) {
      console.error("Resend Error:", err.response?.data);

      setError(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "Failed to resend verification email."
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
          <h1 className="auth-brand-title">SYSTEM LOGIN</h1>
          <p className="auth-brand-subtitle">
            AUTHENTICATE TO ACCESS SECURE CORE
          </p>
        </div>

        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="auth-error-box"
              >
                <div style={{ textAlign: "center", width: "100%" }}>
                  <span
                    style={{
                      display: "block",
                      marginBottom: isNotConfirmed ? "10px" : "0",
                    }}
                  >
                    ⚠️ {error}
                  </span>

                  {isNotConfirmed && (
                    <button
                      type="button"
                      className="verify-now-btn"
                      onClick={async () => {
                        await handleResendVerification();
                        navigate("/VerifyAccount", {
                          state: { email },
                        });
                      }}
                      style={{
                        background: "#389db5",
                        border: "none",
                        borderRadius: "5px",
                        color: "white",
                        padding: "6px 15px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      {loading ? "SENDING..." : "VERIFY NOW"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label className="auth-label">AGENT EMAIL</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">📧</span>
                <input
                  className={`auth-input ${
                    error ? "auth-input-error" : ""
                  }`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setIsNotConfirmed(false);
                  }}
                  required
                  placeholder="agent@strike.gov"
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <label className="auth-label">PASSWORD</label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="auth-link"
                  style={{ fontSize: "11px", cursor: "pointer" }}
                >
                  FORGOT?
                </span>
              </div>

              <div className="auth-input-wrapper">
                <span className="auth-icon">🔒</span>
                <input
                  className={`auth-input ${
                    error ? "auth-input-error" : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setIsNotConfirmed(false);
                  }}
                  required
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </button>

            <div className="auth-card-footer">
              <p className="auth-link-text">
                NO CLEARANCE?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="auth-link"
                  style={{ cursor: "pointer" }}
                >
                  Sign up
                </span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;