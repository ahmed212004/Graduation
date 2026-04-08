import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        "http://strike-defender-v1.runasp.net/api/Plans/Get_Plans"
      );
      setPlans(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 Navbar */}
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            Flexible Plans for Every Shield
          </h1>

          <p style={styles.subtitle}>
            Choose the right level of protection for your enterprise assets.
            Scale your security as you grow.
          </p>
        </div>

        {/* حالة التحميل */}
        {loading && (
          <h2 style={{ color: "#fff" }}>Loading...</h2>
        )}

        {/* حالة الخطأ */}
        {error && (
          <h2 style={{ color: "red" }}>{error}</h2>
        )}

        {/* الكروت */}
        {!loading && !error && (
          <div style={styles.grid}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlight={index === 1} // 👈 الوسط
              />
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div style={styles.faq}>
          <h2>Frequently Asked Questions</h2>

          <div style={styles.faqItem}>
            <h4>How does the Pro plan differ from Starter?</h4>
            <p>
              The Pro plan unlocks advanced AI detection and unlimited scans
              with priority support.
            </p>
          </div>

          <div style={styles.faqItem}>
            <h4>Can I upgrade or downgrade anytime?</h4>
            <p>Yes, you can change your plan at any time.</p>
          </div>

          <div style={styles.faqItem}>
            <h4>What is the SLA?</h4>
            <p>We provide up to 99.99% uptime guarantee.</p>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    paddingTop: "100px",
    paddingBottom: "50px",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    textAlign: "center",
  },

  header: {
    marginBottom: "50px",
  },

  title: {
    fontSize: "42px",
    color: "#fff",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#94a3b8",
    maxWidth: "600px",
    margin: "0 auto",
  },

  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    marginTop: "30px",
  },

  faq: {
    marginTop: "80px",
    color: "#fff",
    maxWidth: "700px",
    marginInline: "auto",
    textAlign: "left",
  },

  faqItem: {
    marginBottom: "20px",
    borderBottom: "1px solid #334155",
    paddingBottom: "10px",
  },
};