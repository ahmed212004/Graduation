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

  const getPlanIntId = (planId) => {
    const map = {
      "2eb2af12-aa97-4af5-9770-7b91a592b90f": 1,
      "077d727a-5827-43d6-b836-6297614625b8": 2,
      "ee73cf71-95dd-47ae-92d3-49f6281d6bca": 3 
    };
    return map[planId] || 1;
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // بناءً على صورة الـ Swagger: الأسماء لازم تكون lowercase (obj, order)
    const paymentPayload = {
      obj: {
        id: Math.floor(Math.random() * 1000000),
        success: true,
        amount_Cents: Number(plan.price) * 100,
        order: {
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
      console.error("❌ Payment Error:", err.response?.data);
      alert("Payment failed. Check your connection or data.");
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
              Finalize your <span style={{ color: "#a855f7", fontWeight: "bold" }}>{plan.name}</span> plan activation
            </p>
          </div>

          {/* بوكس ملخص السعر - مطابق للصورة */}
          <div style={{
            background: "rgba(15, 23, 42, 0.5)",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px",
            border: "1px solid #1e293b"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#94a3b8" }}>
              <span style={{ fontSize: "1.1rem" }}>Plan Price</span>
              <span style={{ color: "#fff" }}>${plan.price}.00</span>
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
              <span>Total Amount</span>
              <span style={{ color: "#a855f7" }}>${plan.price}.00</span>
            </div>
          </div>

          <form onSubmit={handleConfirmPayment}>
            <div className="auth-input-group" style={{ textAlign: "left" }}>
              <label style={{ color: "#4b5563", marginBottom: "8px", display: "block" }}>Card Number</label>
              <input 
                className="auth-input" 
                placeholder="4242 4242 4242 4242" 
                required 
                style={{ background: "#020617", border: "1px solid #1e293b" }}
              />
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              <div className="auth-input-group" style={{ flex: 1, textAlign: "left" }}>
                <label style={{ color: "#4b5563", marginBottom: "8px", display: "block" }}>Expiry</label>
                <input 
                    className="auth-input" 
                    placeholder="MM/YY" 
                    required 
                    style={{ background: "#020617", border: "1px solid #1e293b" }}
                />
              </div>
              <div className="auth-input-group" style={{ flex: 1, textAlign: "left" }}>
                <label style={{ color: "#4b5563", marginBottom: "8px", display: "block" }}>CVC</label>
                <input 
                    className="auth-input" 
                    type="password" 
                    placeholder="***" 
                    required 
                    style={{ background: "#020617", border: "1px solid #1e293b" }}
                />
              </div>
            </div>

            {/* الزرار الأزرق الكبير - مطابق للصورة */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "30px",
                width: "100%",
                padding: "16px",
                background: "#3b82f6", // اللون الأزرق من الصورة
                color: "white",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.5)"
              }}
            >
              {submitting ? "PROCESSING..." : `PAY $${plan.price}.00`}
            </button>
          </form>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
             <span 
                onClick={() => navigate("/plans")}
                style={{ color: "#64748b", cursor: "pointer", textDecoration: "underline", fontSize: "0.9rem" }}
             >
               Go Back to Plans
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}