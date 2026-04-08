import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // تأكد من مسار الاستدعاء
import PlanCard from "../components/PlanCard"; // تأكد من مسار الاستدعاء

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0); // الـ FAQ الأول مفتوح افتراضياً

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
      // Fallback Data matching the image perfectly in case API fails
      setPlans([
        { id: 1, name: "Starter", price: "49", features: ["5 Active Scans", "Basic Reporting", "Email Support"] },
        { id: 2, name: "Pro", price: "149", features: ["Unlimited Scans", "Advanced AI Threat\nDetection", "24/7 Priority Support", "Full API Access"] },
        { id: 3, name: "Enterprise", price: "499", features: ["Custom Deployment", "Dedicated Account Manager", "99.99% SLA Guarantee", "On-site Onboarding"] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How does the Pro plan differ from Starter?",
      answer: "The Pro plan unlocks our proprietary AI threat detection engine, provides unlimited scan capabilities, and guarantees priority response times for all your mission-critical security operations."
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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={styles.pageBackground}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Flexible Plans for Every Shield</h1>
          <p style={styles.subtitle}>
            Choose the right level of protection for your enterprise assets. Scale<br/>
            your security as you grow.
          </p>
        </div>

        {loading ? (
          <h2 style={{ color: "#fff", marginTop: "50px" }}>Loading...</h2>
        ) : (
          <div style={styles.grid}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlight={index === 1} // كارت Pro في المنتصف
              />
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div style={styles.faqSection}>
          <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} style={styles.faqItem} onClick={() => toggleFaq(index)}>
                <div style={styles.faqQuestion}>
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
                  <div style={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={{color: "#a855f7", fontSize: "16px"}}>✽</span> © 2024 Strike Defender System. All rights reserved.
          </div>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink}>Privacy Policy</span>
            <span style={styles.footerLink}>Terms of Service</span>
            <span style={styles.footerLink}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageBackground: {
    minHeight: "100vh",
    background: "#0d0b14", // اللون الكحلي الداكن المائل للأسود
    fontFamily: "Inter, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flex: 1,
    paddingTop: "140px", // لترك مساحة للـ Navbar
    paddingBottom: "80px",
    textAlign: "center",
  },
  header: {
    marginBottom: "60px",
  },
  title: {
    fontSize: "46px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "15px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "100px",
  },
  faqSection: {
    maxWidth: "850px",
    margin: "0 auto",
    textAlign: "left",
    padding: "0 20px",
  },
  faqTitle: {
    color: "#fff",
    fontSize: "26px",
    marginBottom: "30px",
    fontWeight: "600",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
  },
  faqItem: {
    borderBottom: "1px solid #2a2438",
    padding: "24px 0",
    cursor: "pointer",
  },
  faqQuestion: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "400",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqAnswer: {
    color: "#94a3b8",
    marginTop: "16px",
    fontSize: "14px",
    lineHeight: "1.6",
    paddingRight: "40px",
  },
  footer: {
    borderTop: "1px solid #1f1b2e",
    padding: "30px 60px",
  },
  footerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#64748b",
    fontSize: "13px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  footerLinks: {
    display: "flex",
    gap: "25px",
  },
  footerLink: {
    cursor: "pointer",
  }
};