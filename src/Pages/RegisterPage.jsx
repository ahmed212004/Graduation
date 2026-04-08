import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/Dashboard", { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors([]);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractErrors = (err) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (data.errors) return Object.values(data.errors).flat();
      if (data.message) return [data.message];
      if (data.title) return [data.title];
    }
    return ["Server not responding"];
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
      navigate("/verify", {
        state: { email: form.email },
      });
    } catch (err) {
      setErrors(extractErrors(err));
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
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L0 4.5V13.5C0 21.05 5.14 27.97 12 30C18.86 27.97 24 21.05 24 13.5V4.5L12 0Z" fill="#3b82f6"/></svg>
          </div>
          <h1 style={styles.brandTitle}>STRIKE DEFENDER</h1>
          <p style={styles.brandSubtitle}>NEW RECRUIT CLEARANCE</p>
        </div>

        <div style={styles.box}>
          {errors.length > 0 && (
            <div style={styles.errorBox}>
              {errors.map((e, i) => <p key={i} style={{ margin: 0 }}>{e}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ASSIGN ENTERPRISE EMAIL</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>@</span>
                <input type="email" name="email" placeholder="user@enterprise.com" onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>CREATE SECURITY PASSWORD</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                </span>
                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <button style={styles.submitButton} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              {loading ? "INITIALIZING..." : "REQUEST CLEARANCE"}
            </button>
          </form>

          <div style={styles.boxFooter}>
            <p style={styles.signUpText}>
              Already have access? <span onClick={() => navigate("/login")} style={styles.signUpLink}>Secure Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 📌 ملحوظة: الـ styles هنا هي نفسها بتاعة الـ Login بالظبط
const styles = {
  pageBackground: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#050914", backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`, backgroundSize: "40px 40px", fontFamily: "'Inter', sans-serif", position: "relative" },
  container: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "60px", paddingBottom: "80px" },
  headerSection: { textAlign: "center", marginBottom: "40px" },
  logoContainer: { width: "60px", height: "60px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px auto", boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" },
  brandTitle: { color: "#ffffff", fontSize: "24px", fontWeight: "700", letterSpacing: "3px", margin: "0 0 8px 0" },
  brandSubtitle: { color: "#3b82f6", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", margin: 0 },
  box: { background: "rgba(10, 15, 30, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.1)" },
  errorBox: { background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.5)", color: "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", textAlign: "center" },
  inputGroup: { marginBottom: "24px", textAlign: "left" },
  label: { display: "block", color: "#94a3b8", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "8px" },
  inputWrapper: { display: "flex", alignItems: "center", background: "rgba(0, 0, 0, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", overflow: "hidden", transition: "border-color 0.3s ease" },
  inputIcon: { color: "#64748b", padding: "0 15px", display: "flex", alignItems: "center", justifyContent: "center" },
  input: { flex: 1, background: "transparent", border: "none", color: "#ffffff", padding: "14px 14px 14px 0", fontSize: "14px", outline: "none" },
  submitButton: { width: "100%", padding: "16px", background: "linear-gradient(to right, #2563eb, #3b82f6)", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", letterSpacing: "1px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)", transition: "transform 0.1s ease, box-shadow 0.3s ease" },
  boxFooter: { marginTop: "35px", textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" },
  signUpText: { color: "#94a3b8", fontSize: "13px" },
  signUpLink: { color: "#ffffff", fontWeight: "600", cursor: "pointer", marginLeft: "5px" }
};

export default RegisterPage;