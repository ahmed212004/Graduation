import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";

// استدعاء الستايل الجديد
import "../style/Plans.css";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://strike-defender-v1.runasp.net/api/Plans/Get_Plans");
      if (res.data && res.data.length > 0) {
        setPlans(res.data);
      } else {
        throw new Error("Empty Data");
      }
    } catch (err) {
      setPlans([
        { id: 1, name: "Starter", price: "49", features: ["5 Active Scans", "Basic Reporting", "Email Support"] },
        { id: 2, name: "Pro", price: "149", features: ["Unlimited Scans", "Advanced AI Threat Detection", "24/7 Priority Support", "Full API Access"] },
        { id: 3, name: "Enterprise", price: "499", features: ["Custom Deployment", "Dedicated Account Manager", "99.99% SLA Guarantee", "On-site Onboarding"] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How does the Pro plan differ from Starter?",
      answer: "The Pro plan unlocks our proprietary AI threat detection engine, provides unlimited scan capabilities, and guarantees priority response times."
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time from your account dashboard."
    },
    {
      question: "What is the Strike Defender System SLA?",
      answer: "We offer a 99.99% uptime SLA for our Enterprise customers."
    }
  ];

  return (
    <div className="plans-page-wrapper">
      <Navbar />

      <div className="plans-container">
        <header className="plans-header">
          <h1 className="plans-title">Flexible Plans for Every Shield</h1>
          <p className="plans-subtitle">
            Choose the right level of protection for your enterprise assets. Scale your security as you grow.
          </p>
        </header>

        {loading ? (
          <h2 style={{ color: "#fff", marginTop: "50px" }}>Loading...</h2>
        ) : (
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlight={index === 1}
              />
            ))}
          </div>
        )}

        <section className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <div className="faq-question">
                  {faq.question}
                  <span style={{ 
                    color: "#a855f7", 
                    transform: openFaq === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    fontSize: "12px"
                  }}>
                    {openFaq === index ? "▲" : "▼"}
                  </span>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="plans-footer">
        <div className="footer-content">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{color: "#a855f7", fontSize: "16px"}}>✽</span> © 2024 Strike Defender System.
          </div>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}