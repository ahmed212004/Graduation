import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // فحص هل المستخدم مسجل دخول أم لا (بافتراض إنك بتحفظ التوكن في الـ localStorage وقت اللوجين)
  // غير كلمة "token" للاسم اللي انت بتستخدمه في مشروعك لو كان مختلف
  const isLoggedIn = !!localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token"); // مسح التوكن
    navigate("/login"); // توجيه لصفحة تسجيل الدخول
  };

  return (
    <div style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => navigate("/")}>
        <span style={styles.logoIcon}>✽</span> Strike Defender
      </div>

      {/* Links */}
      <div style={styles.links}>
        <span style={styles.link} onClick={() => navigate("/solutions")}>Solutions</span>
        <span style={styles.link} onClick={() => navigate("/Dashboard")}>Dashboard</span>
        <span style={{ ...styles.link, ...(location.pathname === "/plans" ? styles.active : {}) }} onClick={() => navigate("/plans")}>Pricing</span>
        <span style={styles.link} onClick={() => navigate("/about")}>About</span>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {isLoggedIn ? (
          // 👈 لو المستخدم عامل لوجين، هنعرض صورة البروفايل وزرار الخروج
          <div style={styles.profileContainer}>
            <div style={styles.avatar} onClick={() => navigate("/profile")} title="Go to Profile">
              {/* ممكن تحط صورة هنا بـ <img /> لو راجعة من الـ API، دي أيقونة مؤقتة */}
              👤
            </div>
            <button style={styles.logout} onClick={handleLogout}>
              Log Out
            </button>
          </div>
        ) : (
          // 👈 لو مش عامل لوجين، هنعرض الزراير العادية
          <>
            <button style={styles.primary} onClick={() => navigate("/register")}>
              Get Started
            </button>
            <button style={styles.login} onClick={() => navigate("/login")}>
              Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    position: "absolute",
    top: 0,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 60px",
    background: "transparent",
    color: "#fff",
    zIndex: 1000,
    fontFamily: "Inter, sans-serif",
  },
  logo: {
    fontWeight: "700",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    color: "#a855f7",
    fontSize: "22px",
  },
  links: {
    display: "flex",
    gap: "35px",
    fontSize: "14px",
  },
  link: {
    cursor: "pointer",
    color: "#94a3b8",
    transition: "0.3s",
  },
  active: {
    color: "#a855f7",
  },
  actions: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  login: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  primary: {
    background: "#9333ea",
    border: "none",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  // 👇 الاستايلات الجديدة الخاصة بالبروفايل
  profileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#1e293b",
    border: "2px solid #a855f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "20px",
    transition: "transform 0.2s",
  },
  logout: {
    background: "transparent",
    border: "none",
    color: "#ef4444", // لون أحمر يعبر عن الخروج
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  }
};