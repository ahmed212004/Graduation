import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";
import { motion } from "framer-motion";
import "../style/Plans.css";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fallbackPlans = [
    { id: 1, name: "Starter", price: "49", features: ["5 Active Scans", "Basic Reporting"] },
    { id: 2, name: "Pro", price: "149", features: ["Unlimited Scans", "AI Threat Detection"] },
    { id: 3, name: "Enterprise", price: "499", features: ["Custom Deployment", "Dedicated Manager"] }
  ];

  // ✅ fixed with useCallback
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/Plans/Get_Plans");
      setPlans(res.data.length > 0 ? res.data : fallbackPlans);
    } catch (err) {
      setPlans(fallbackPlans);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const goToCheckout = (plan) => {
    navigate("/checkout", { state: { plan } });
  };

  return (
    <div className="plans-page-wrapper">
      <Navbar />
      <div className="plans-container">
        <header className="plans-header">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="plans-title">
            Security Tiers
          </motion.h1>
          <p className="plans-subtitle">Select the best protection for your assets.</p>
        </header>

        {loading ? (
          <div className="admin-loading"><h2>DECRYPTING PLANS...</h2></div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={plan.id} className="plan-card-wrapper">
                <PlanCard plan={plan} highlight={index === 1} />
                <button 
                  className="auth-submit-btn"
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    background: index === 1
                      ? "linear-gradient(90deg, #a855f7, #3b82f6)"
                      : "#1e293b"
                  }}
                  onClick={() => goToCheckout(plan)}
                >
                  GET STARTED
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}