import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Auth.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};
  const [submitting, setSubmitting] = useState(false);

  if (!plan) {
    return (
      <div className="admin-loading" style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        <h2>No plan selected. Redirecting...</h2>
        {setTimeout(() => navigate("/plans"), 2000)}
      </div>
    );
  }

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. مناداة API الاشتراك باستخدام الـ planId
      // الـ API بيرجع رابط Paymob في الـ response body
      const response = await api.post(`/api/Subscriptions/subscribe?planId=${plan.id}`);

      // 2. التأكد من استلام الرابط
      const paymentUrl = response.data; // بناءً على الـ response اللي بعته، الرابط بيجي مباشرة كـ string

      if (paymentUrl && paymentUrl.startsWith("http")) {
        // 3. توجيه المستخدم لصفحة دفع Paymob الخارجية
        window.location.href = paymentUrl;
      } else {
        alert("Could not generate payment link. Please try again.");
      }

    } catch (err) {
      console.error("❌ Subscription Error:", err.response?.data || err.message);
      alert(err.response?.data || "Failed to initiate subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ background: "#020617", minHeight: "100vh" }}>
      <Navbar />

      <div className="auth-container" style={{ paddingTop: "60px" }}>
        <div className="auth-card" style={{ maxWidth: "650px", background: "#0f172a", border: "1px solid #1e293b" }}>
          
          <div className="auth-header" style={{ marginBottom: "30px" }}>
            <h2 className="auth-title" style={{ fontSize: "1.8rem", color: "#fff" }}>Secure Checkout</h2>
            <p className="auth-subtitle" style={{ color: "#94a3b8" }}>
              You are subscribing to the <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{plan.name}</span> plan
            </p>
          </div>

          <div style={{
            background: "rgba(15, 23, 42, 0.5)",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px",
            border: "1px solid #1e293b"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#94a3b8" }}>
              <span style={{ fontSize: "1.1rem" }}>Selected Plan</span>
              <span style={{ color: "#fff" }}>{plan.name}</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              color: "#fff", 
              fontSize: "1.4rem", 
              fontWeight: "bold", 
              borderTop: "1px solid #1e293b", 
              paddingTop: "15px" 
            }}>
              <span>Total to Pay</span>
              <span style={{ color: "#3b82f6" }}>${plan.price}.00</span>
            </div>
          </div>

          <div style={{ color: "#94a3b8", marginBottom: "20px", fontSize: "0.9rem", textAlign: "center" }}>
            <p>🛡️ You will be redirected to our secure payment gateway (Paymob) to complete your transaction.</p>
          </div>

          <form onSubmit={handleConfirmPayment}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                background: "#3b82f6",
                color: "white",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.5)"
              }}
            >
              {submitting ? "PREPARING GATEWAY..." : `PROCEED TO PAYMENT`}
            </button>
          </form>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
             <span 
                onClick={() => navigate("/plans")}
                style={{ color: "#64748b", cursor: "pointer", textDecoration: "underline", fontSize: "0.9rem" }}
             >
                Cancel and Go Back
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}