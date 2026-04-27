import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../style/Plans.css";

export default function PlansPage() {
  const navigate = useNavigate();
  
  const fallbackPlans = [
    { 
      id: "2eb2af12-aa97-4af5-9770-7b91a592b90f", 
      name: "Basic", price: "0", 
      description: "Perfect for individuals and side projects.",
      features: ["Basic SQLi Detection", "Essential XSS Protection", "Up to 5 Sites", "Community Support"]
    },
    { 
      id: "077d727a-5827-43d6-b836-6297614625b8", 
      name: "Pro", price: "49", 
      description: "The complete toolkit for growing businesses.",
      features: ["Advanced AI Detection", "Real-time Smart Alerts", "Unlimited Sites", "24/7 Priority Support", "Full API Access"]
    },
    { 
      id: "ee73cf71-95dd-47ae-92d3-49f6281d6bca", 
      name: "Enterprise", price: "Custom", 
      description: "Bespoke security for large-scale operations.",
      features: ["Custom Hybrid Deployment", "99.9% SLA Guarantee", "Dedicated Success Manager", "Advanced SIEM Integration"]
    }
  ];

  const goToCheckout = (plan) => {
    navigate("/checkout", { state: { plan } });
  };

  return (
    <div className="plans-page-wrapper">
      <Navbar />
      <div className="plans-container">
        <header className="plans-header">
          <div className="pricing-badge">PRICING PLANS</div>
          <h1 className="plans-main-title">Choose Your Security Plan</h1>
          <p className="plans-subtitle">
            AI-powered SQLi & XSS Threat Detection Platform. Protect your digital assets <br />
            with enterprise-grade intelligence.
          </p>
        </header>

        <div className="plans-main-grid">
          {fallbackPlans.map((plan, index) => (
            <div key={plan.id} className={`plan-card ${index === 1 ? "pro-card" : ""}`}>
              {index === 1 && <div className="most-popular-badge">MOST POPULAR</div>}
              
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-symbol">$</span>
                <span className="price-amount">{plan.price}</span>
                {plan.price !== "Custom" && <span className="price-period">/mo</span>}
              </div>
              <p className="plan-desc">{plan.description}</p>
              
              <button className="plan-btn-primary" onClick={() => goToCheckout(plan)}>
                {index === 1 ? "Start Free Trial" : index === 2 ? "Contact Sales" : "Get Started"}
              </button>

              <ul className="plan-features">
                {plan.features.map((feat, i) => (
                  <li key={i}>
                    <span className="check-icon">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I switch plans later?</h4>
              <p>Yes, you can upgrade or downgrade your plan at any time from your dashboard settings.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial for Pro?</h4>
              <p>Absolutely. We offer a 14-day free trial for the Pro plan with no credit card required.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer educational discounts?</h4>
              <p>Yes, we support students and non-profits with a 50% discount on all our plans.</p>
            </div>
            <div className="faq-item">
              <h4>How secure is my data?</h4>
              <p>Data security is our priority. We use industry-standard encryption and never store raw traffic logs.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}