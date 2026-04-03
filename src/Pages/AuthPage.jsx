import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // 👈 بدل axios

function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setErrors([]);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const extractErrors = (err) => {
    if (err.response) {
      const data = err.response.data;

      if (data.errors) {
        return Object.values(data.errors).flat();
      }

      if (data.message) return [data.message];
      if (data.title) return [data.title];
    }

    return ["Server not responding"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // validation
    if (!form.email || !form.password) {
      setErrors(["Email and Password are required"]);
      return;
    }

    if (!isLogin) {
      

      if (form.password.length < 6) {
        setErrors(["Password must be at least 6 characters"]);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setErrors(["Passwords do not match"]);
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await api.post("/api/Authentication/login", {
          email: form.email,
          password: form.password,
        });

        console.log("LOGIN SUCCESS:", res.data);

        // ✅ تخزين التوكن
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        navigate("/dashboard");
      } else {
        const res = await api.post("/api/Authentication/register", {
          email: form.email,
          password: form.password,
        });

        console.log("REGISTER SUCCESS:", res.data);

        navigate("/verify", { state: { email: form.email } });
      }
    } catch (err) {
      console.log("ERROR:", err);
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {errors.length > 0 && (
          <div style={styles.error}>
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              style={styles.input}
            />
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>

          <p
            style={{ fontSize: "12px", cursor: "pointer", marginTop: "10px" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>

        <p style={styles.text}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => {
              setErrors([]);
              setIsLogin(!isLogin);
            }}
            style={styles.link}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// 🎨 نفس الـ style القديم بالظبط
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #000000, #0f172a)",
  },
  box: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "35px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "linear-gradient(135deg, #020617, #1e3a8a)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  error: {
    background: "#dc2626",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },
  text: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#60a5fa",
    cursor: "pointer",
    marginLeft: "5px",
    fontWeight: "bold",
  },
};

export default AuthPage;