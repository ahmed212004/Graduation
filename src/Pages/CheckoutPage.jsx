import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Auth.css"; // بنستخدم نفس الستايل الموحد للمشروع
//import { color } from "framer-motion";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};
  const [submitting, setSubmitting] = useState(false);

  // حماية الصفحة
  if (!plan) {
    return (
      <div className="admin-loading" style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        <h2>No plan selected. Redirecting...</h2>
        {setTimeout(() => navigate("/plans"), 2000)}
      </div>
    );
  }

  // 🔥 Mapping UUID → Int ID (الحل الذكي بتاعك)
  const getPlanIntId = (planId) => {
    const map = {
      "2eb2af12-aa97-4af5-9770-7b91a592b90f": 1, // Free
      "077d727a-5827-43d6-b836-6297614625b8": 2, // Pro
      "ee73cf71-95dd-47ae-92d3-49f6281d6bca": 3  // Enterprise
    };
    return map[planId] || 1;
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const paymentPayload = {
      Obj: {
        id: Math.floor(Math.random() * 1000000),
        success: true,
        amount_Cents: Number(plan.price) * 100,
        Order: {
          id: getPlanIntId(plan.id) 
        }
      }
    };

    const hmacValue = "E049A4C071";

    try {
      const response = await api.post(
        `/api/Payments/webhook?hmac=${hmacValue}`,
        paymentPayload
      );

      if (response.status >= 200 && response.status < 300) {
        alert("✅ Subscription Activated Successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Validation Error:", err.response?.data);
      alert("Payment failed. Please check your data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <Navbar />

      <div className="auth-card" style={{ maxWidth: "500px", marginTop: "80px" }}>
        <div className="auth-header" style={{color:"#c6bfcd"}}>
          <h2 className="auth-title">Secure Checkout</h2>
          <p className="auth-subtitle" >
            Finalize your <span style={{ color: "#a855f7", fontWeight: "bold" }}>{plan.name}</span> plan activation
          </p>
        </div>

        {/* ملخص الفاتورة بشكل شيك */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#94a3b8" }}>
            <span>Plan Price</span>
            <span>${plan.price}.00</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontSize: "1.2rem", fontWeight: "bold", borderTop: "1px solid #334155", paddingTop: "10px" }}>
            <span>Total Amount</span>
            <span style={{ color: "#a855f7" }}>${plan.price}.00</span>
          </div>
        </div>

        <form onSubmit={handleConfirmPayment}>
          <div className="auth-input-group">
            <label>Card Number</label>
            <input 
              className="auth-input" 
              placeholder="4242 4242 4242 4242" 
              required 
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div className="auth-input-group" style={{ flex: 1 }}>
              <label>Expiry</label>
              <input className="auth-input" placeholder="MM/YY" required />
            </div>
            <div className="auth-input-group" style={{ flex: 1 }}>
              <label>CVC</label>
              <input className="auth-input" type="password" placeholder="***" required />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
            style={{ marginTop: "10px" }}
          >
            {submitting ? "PROCESSING..." : `PAY $${plan.price}.00`}
          </button>
        </form>

        <button
          onClick={() => navigate("/plans")}
          style={{
            marginTop: "20px",
            width: "100%",
            background: "transparent",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Go Back to Plans
        </button>
      </div>
    </div>
  );
}