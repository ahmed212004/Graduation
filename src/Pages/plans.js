import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Plans.css";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Plans/Get_Plans");
      // الـ response بتاعك عبارة عن Array مباشرة
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
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

  if (loading) {
    return (
      <div className="plans-page-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <h2 style={{color: '#3b82f6', letterSpacing: '2px'}}>LOADING SECURE PLANS...</h2>
      </div>
    );
  }

  return (
    <div className="plans-page-wrapper">
      <Navbar />
      <div className="plans-container">
        <header className="plans-header">
          <div className="pricing-badge">PRICING PLANS</div>
          <h1 className="plans-main-title">Scale Your Security</h1>
          <p className="plans-subtitle">
            Choose the level of protection that fits your infrastructure. <br />
            Powered by advanced AI threat analysis.
          </p>
        </header>

        <div className="plans-main-grid">
          {plans.map((plan, index) => (
            <div key={plan.id} className={`plan-card ${plan.name === "Pro" ? "pro-card" : ""}`}>
              {plan.name === "Pro" && <div className="most-popular-badge">MOST POPULAR</div>}
              
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-symbol">$</span>
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">/{plan.durationInDays === 3650 ? "forever" : "mo"}</span>
              </div>
              
              <p className="plan-desc">
                High-performance security with up to {plan.maxRiskScoreAccess}% risk analysis coverage.
              </p>
              
              <button className="plan-btn-primary" onClick={() => goToCheckout(plan)}>
                {plan.price === 0 ? "Get Started" : "Upgrade Now"}
              </button>

              <ul className="plan-features">
                <li><span className="check-icon">✓</span> {plan.maxAttacks} Total Attacks / mo</li>
                <li><span className="check-icon">✓</span> {plan.maxRules} Custom Security Rules</li>
                <li><span className="check-icon">✓</span> {plan.maxRiskScoreAccess}% Risk Score Access</li>
                <li><span className="check-icon">✓</span> {plan.durationInDays} Days Validity</li>
                {plan.name !== "Free" && <li><span className="check-icon">✓</span> 24/7 Priority Support</li>}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>What is Risk Score Access?</h4>
              <p>It's our AI's confidence level in detecting complex threats. Higher plans get deeper analysis.</p>
            </div>
            <div className="faq-item">
              <h4>Can I upgrade anytime?</h4>
              <p>Yes, your remaining credits will be prorated towards your new subscription immediately.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}