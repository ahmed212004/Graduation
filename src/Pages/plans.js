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

  // 🔥 البيانات الحقيقية من الصورة كـ Fallback في حالة فشل الـ API
  const fallbackPlans = [
    { id: 1, name: "Basic", price: "0", features: ["Basic SQLi Detection", "Essential XSS Protection", "Up to 5 Sites", "Community Support"] },
    { id: 2, name: "Pro", price: "49", features: ["Advanced AI Detection", "Real-time Smart Alerts", "Unlimited Sites", "24/7 Priority Support", "Full API Access"] },
    { id: 3, name: "Enterprise", price: "Custom", features: ["Custom Hybrid Deployment", "99.9% SLA Guarantee", "Dedicated Success Manager", "Advanced SIEM Integration"] }
  ];

  // دالة الـ Hook لجلب البيانات من الـ API - تم تثبيتها بـ useCallback
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/Plans/Get_Plans");
      if (res.data && res.data.length > 0) {
        setPlans(res.data);
      } else {
        throw new Error("Empty Data");
      }
    } catch (err) {
      console.warn("Using fallback plans data.", err.message);
      // لو الـ API منفعش، بنعرض البيانات المظبوطة دي علطول
      setPlans(fallbackPlans);
    } finally {
      setLoading(false);
    }
  }, []); // لا يوجد اعتمادات لتجنب الـ Loop

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]); // تم تصحيح الاعتمادات

  const goToCheckout = (plan) => {
    // لو الخطة Custom، ممكن تبعتهم لصفحة Contact أو غيره، هنا بنوديهم Checkout
    if (plan.price.toLowerCase() === "custom") {
        alert("Redirecting to Contact Sales...");
        // navigate("/contact"); // مثال
    } else {
        navigate("/checkout", { state: { plan } });
    }
  };

  // بيانات الـ FAQ من الصورة
  const faqs = [
    { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard settings." },
    { q: "Do you offer educational discounts?", a: "Yes, we support students and non-profits with a 50% discount on all our plans." },
    { q: "Is there a free trial for Pro?", a: "Absolutely. We offer a 14-day free trial for the Pro plan with no credit card required." },
    { q: "How secure is my data?", a: "Data security is our priority. We use industry-standard encryption and never store raw traffic logs." }
  ];

  return (
    <div className="plans-page-wrapper auth-container">
      <Navbar />
      <div className="plans-container">
        <header className="plans-header auth-header">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="plans-title auth-title"
          >
            Choose Your Security Plan
          </motion.h1>
          <p className="plans-subtitle auth-subtitle">
            AI-powered SQLi & XSS Threat Detection Platform. Protect your digital assets with enterprise-grade intelligence.
          </p>
        </header>

        {loading ? (
          <div className="admin-loading"><h2>DECRYPTING PLANS...</h2></div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={plan.id} className="plan-card-wrapper auth-card">
                <PlanCard plan={plan} highlight={index === 1} />
                <button 
                  className="auth-submit-btn checkout-btn" 
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    background: index === 1 
                        ? "linear-gradient(90deg, #a855f7, #3b82f6)" 
                        : "#1e293b", // Pro لون مختلف
                    color: "white"
                  }}
                  onClick={() => goToCheckout(plan)}
                >
                  {index === 0 ? "Get Started" : (index === 1 ? "Start Free Trial" : "Contact Sales")}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 جزء الأسئلة الشائعة (FAQ) */}
        <section className="plans-faq">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <h4 className="faq-question">{faq.q}</h4>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}