import React from "react";

export default function PlanCard({ plan, highlight }) {
  const { name = "Plan", price = "0", features = [] } = plan;

  return (
    <div style={{ ...styles.card, ...(highlight ? styles.cardHighlight : {}) }}>
      {highlight && <div style={styles.badge}>MOST POPULAR</div>}
      
      <div style={styles.cardHeader}>
        <h3 style={{...styles.planName, color: highlight ? "#a855f7" : "#94a3b8"}}>
          {name.toUpperCase()}
        </h3>
        <div style={styles.priceContainer}>
          <span style={styles.dollarSign}>$</span>
          <span style={styles.price}>{price}</span>
          <span style={styles.month}>/mo</span>
        </div>
      </div>

      <button style={highlight ? styles.buttonPrimary : styles.buttonOutline}>
        {highlight ? "Upgrade to Pro" : name === "Enterprise" ? "Contact Sales" : "Get Started"}
      </button>

      <div style={styles.featuresList}>
        {features.map((feature, idx) => {
          // تمييز ميزة الـ AI في المنتصف كما في الصورة
          const isBoldFeature = highlight && feature.includes("AI Threat");
          
          return (
            <div key={idx} style={styles.featureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#10b981"/>
                <path d="M7.5 12L10.5 15L16.5 9" stroke="#130f1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                color: isBoldFeature ? "#fff" : "#cbd5e1", 
                fontWeight: isBoldFeature ? "600" : "400",
                maxWidth: "200px",
                lineHeight: "1.4"
              }}>
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#130f1e",
    border: "1px solid #2a2438",
    borderRadius: "12px",
    padding: "40px 30px",
    width: "320px",
    textAlign: "left",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  cardHighlight: {
    border: "2px solid #9333ea",
    boxShadow: "0 0 40px rgba(147, 51, 234, 0.15)",
    transform: "scale(1.05)",
    zIndex: 1,
  },
  badge: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#9333ea",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "5px 15px",
    borderRadius: "20px",
    letterSpacing: "1px",
  },
  cardHeader: {
    marginBottom: "25px",
  },
  planName: {
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "10px",
    marginTop: 0,
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    color: "#fff",
  },
  dollarSign: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  price: {
    fontSize: "54px",
    fontWeight: "bold",
    margin: "0 4px",
  },
  month: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  buttonOutline: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #2a2438",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "30px",
  },
  buttonPrimary: {
    width: "100%",
    padding: "12px",
    background: "#a855f7",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "30px",
  },
  featuresList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "14px",
  },
};