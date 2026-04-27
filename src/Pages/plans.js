import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import "../style/Plans.css";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // البيانات مطابقة تماماً للصورة اللي بعتها
  const fallbackPlans = [
    { id: "2eb2af12-aa97-4af5-9770-7b91a592b90f", name: "FREE", price: "0", description: "Perfect for individuals and side projects." },
    { id: "077d727a-5827-43d6-b836-6297614625b8", name: "PRO", price: "200", description: "The complete toolkit for growing businesses." },
    { id: "ee73cf71-95dd-47ae-92d3-49f6281d6bca", name: "ENTERPRISE", price: "500", description: "Bespoke security for large-scale operations." }
  ];

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/Plans/Get_Plans");
      if (res.data && res.data.length > 0) {
        setPlans(res.data);
      } else {
        setPlans(fallbackPlans);
      }
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
          <p className="plans-subtitle">
            AI-powered SQLi & XSS Threat Detection Platform. Protect your digital assets <br />
            with enterprise-grade intelligence.
          </p>
        </header>

        {loading ? (
          <div className="admin-loading"><h2>INITIALIZING SYSTEM...</h2></div>
        ) : (
          <div className="plans-main-grid">
            {plans.map((plan, index) => (
              <div key={plan.id} className="plan-column">
                {/* الكارت الداخلي */}
                <div className={`plan-inner-card ${index === 1 ? "pro-highlight" : ""}`}>
                  {index === 1 && <span className="most-popular-tag">MOST POPULAR</span>}
                  <h3 className="plan-type">{plan.name}</h3>
                  <div className="plan-price-container">
                    <span className="currency">$</span>
                    <span className="price-value">{plan.price}</span>
                    <span className="duration">/mo</span>
                  </div>
                  
                  <button 
                    className={`inner-action-btn ${index === 1 ? "pro-btn" : ""}`}
                    onClick={() => goToCheckout(plan)}
                  >
                    {index === 0 ? "Get Started" : index === 1 ? "Upgrade to Pro" : "Contact Sales"}
                  </button>
                </div>

                {/* الزرار الخارجي اللي تحت الكارت */}
                <button 
                  className={`outer-main-btn ${index === 1 ? "pro-gradient-btn" : ""}`}
                  onClick={() => goToCheckout(plan)}
                >
                   {index === 0 ? "Get Started" : index === 1 ? "Start Free Trial" : "Contact Sales"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}