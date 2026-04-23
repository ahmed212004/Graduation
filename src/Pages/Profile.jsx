import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import "../style/Admin.css"; 

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      // محاولة المسار الأكثر استقراراً بناءً على تجربتك السابقة
      const response = await api.get("/api/Accounts/Get_Profile"); 
      setProfileData(response.data);
    } catch (err) {
      setError("FAILED TO ACCESS AGENT PROFILE");
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* 1. السايدبار ثابت في أقصى اليسار */}
      <Sidebar isOpen={true} />

      <div className="admin-main-content">
        {/* 2. النافبار ثابت في الأعلى ولا يغطي المحتوى */}
        <Navbar />

        {/* 3. حاوية المحتوى مع مسافة أمان (Margin) من الأعلى واليسار */}
        <motion.div 
          className="admin-container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ 
            marginTop: "20px", 
            padding: "30px", 
            width: "100%",
            boxSizing: "border-box" 
          }}
        >
          {loading ? (
            <div className="admin-loading" style={{ textAlign: 'center', color: '#3b82f6', marginTop: '50px' }}>
              📡 DECRYPTING AGENT DATA...
            </div>
          ) : error ? (
            <div className="auth-error-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
              ⚠️ {error}
            </div>
          ) : (
            <div className="profile-wrapper" style={{ maxWidth: "1100px", margin: "0 auto" }}>
              
              {/* هيدر البروفايل */}
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-title">AGENT PROFILE</h1>
                  <p className="admin-subtitle">IDENTITY VERIFIED // CLEARANCE: {profileData?.role || "AGENT"}</p>
                </div>
                <div className="admin-stats-brief">ACCESS: GRANTED</div>
              </div>

              {/* شبكة البيانات */}
              <div className="profile-content-grid" style={{ 
                display: 'flex', 
                gap: '40px', 
                marginTop: '40px',
                flexWrap: 'wrap' // لضمان التوافق مع الشاشات الصغيرة
              }}>
                
                {/* القسم الأيسر: الأفاتار */}
                <div className="profile-image-section" style={{ minWidth: '200px', textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={profileData?.imagePath || `https://ui-avatars.com/api/?name=${profileData?.fullName}&background=3b82f6&color=fff&size=200`} 
                      alt="Agent Avatar" 
                      style={{ 
                        width: '200px', 
                        height: '200px', 
                        borderRadius: '15px', 
                        border: '3px solid #3b82f6', 
                        boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <button className="refresh-btn" style={{ marginTop: '25px', width: '100%', py: '12px' }}>
                    CHANGE AVATAR
                  </button>
                </div>

                {/* القسم الأيمن: تفاصيل الحساب */}
                <div className="profile-info-section" style={{ flex: '2', minWidth: '300px' }}>
                  <div className="info-card" style={{ 
                    background: 'rgba(15, 23, 42, 0.8)', 
                    padding: '30px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                      <div className="info-group">
                        <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>AGENT FULL NAME</label>
                        <p style={{ color: '#f8fafc', fontSize: '18px', margin: '8px 0', borderBottom: '1px solid #1e293b', pb: '5px' }}>
                          {profileData?.fullName || "UNKNOWN"}
                        </p>
                      </div>

                      <div className="info-group">
                        <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>SECURE EMAIL</label>
                        <p style={{ color: '#f8fafc', fontSize: '18px', margin: '8px 0', borderBottom: '1px solid #1e293b', pb: '5px' }}>
                          {profileData?.email}
                        </p>
                      </div>

                      <div className="info-group">
                        <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>PHONE CONTACT</label>
                        <p style={{ color: '#f8fafc', fontSize: '18px', margin: '8px 0', borderBottom: '1px solid #1e293b', pb: '5px' }}>
                          {profileData?.phoneNumber || "NOT ASSIGNED"}
                        </p>
                      </div>

                      <div className="info-group">
                        <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>ENLISTMENT DATE</label>
                        <p style={{ color: '#f8fafc', fontSize: '18px', margin: '8px 0', borderBottom: '1px solid #1e293b', pb: '5px' }}>
                          {profileData?.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : "---"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                    <button className="refresh-btn" style={{ flex: 1, padding: '14px' }}>MODIFY INFORMATION</button>
                    <button className="btn-delete" style={{ padding: '14px 25px', borderRadius: '8px', fontWeight: 'bold' }}>LOGOUT SESSION</button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;