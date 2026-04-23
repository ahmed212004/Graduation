import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import "../style/Admin.css";   // الستايل العام للداشبورد
import "../style/Profile.css"; // الستايل الخاص بالبروفايل اللي عملناه فوق

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Accounts/Get_Profile");
      setProfileData(response.data);
    } catch (err) {
      console.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`dashboard-main ${isSidebarOpen ? "blur-effect" : ""}`}>
        <Navbar />

        <motion.div
          className="profile-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* العنوان (نفس ستايل الداشبورد) */}
          <header className="dash-header">
            <div>
              <h1 className="dash-title">AGENT PROFILE</h1>
              <p className="dash-subtitle">MANAGE YOUR IDENTITY AND SECURITY</p>
            </div>
            <button className="secondary-btn" onClick={() => window.location.reload()}>SYNC DATA</button>
          </header>

          {loading ? (
            <div className="admin-loading">DECRYPTING...</div>
          ) : (
            <div className="profile-grid">
              
              {/* الجزء الأول: بيانات العميل */}
              <section className="metric-card">
                <h3 style={{ color: '#3b82f6', marginBottom: '25px', fontSize: '13px' }}>PERSONAL DOSSIER</h3>
                
                <div className="info-item">
                  <label>FULL NAME</label>
                  <span>{profileData?.fullName || "NOT FOUND"}</span>
                </div>

                <div className="info-item">
                  <label>AGENT EMAIL</label>
                  <span>{profileData?.email}</span>
                </div>

                <div className="info-item">
                  <label>CONTACT NUMBER</label>
                  <span>{profileData?.phoneNumber || "N/A"}</span>
                </div>

                <div style={{ marginTop: '30px' }}>
                   <button className="blue-action-btn">EDIT IDENTITY</button>
                </div>
              </section>

              {/* الجزء الثاني: الصورة والحالة */}
              <section className="profile-avatar-section">
                <div className="metric-card profile-avatar-container">
                  <img 
                    src={profileData?.imagePath || `https://ui-avatars.com/api/?name=${profileData?.fullName}&background=3b82f6&color=fff`} 
                    alt="Agent" 
                    className="profile-avatar-img"
                  />
                  <h2 className="metric-value" style={{fontSize: '22px'}}>ACTIVE</h2>
                  <p className="dash-subtitle">CLEARANCE LEVEL: {profileData?.role}</p>
                </div>
              </section>

            </div>
          )}
        </motion.div>

        {/* زر الموبايل العائم */}
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </main>
    </div>
  );
}

export default Profile;