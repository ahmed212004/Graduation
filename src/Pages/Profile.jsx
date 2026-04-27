import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

import "../style/Admin.css"; 
import "../style/Profile.css"; 

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageBlob, setImageBlob] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ fixed with useCallback
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Accounts/Get_Profile");
      setProfileData(response.data);

      if (response.data.photoUrl) {
        fetchSecureImage(response.data.photoUrl);
      }
    } catch (err) {
      console.error("خطأ في جلب بيانات البروفايل:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchSecureImage = async (imageUrl) => {
    try {
      const res = await api.get(imageUrl, { responseType: "blob" });
      const localImageUrl = URL.createObjectURL(res.data);
      setImageBlob(localImageUrl);
    } catch (err) {
      console.error("فشل تحميل الصورة بالتوكن:", err);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="admin-main-content">
        <Navbar />

        <motion.div 
          className="profile-page-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="admin-page-header">
            <div>
              <h1 className="admin-title">Agent Profile</h1>
              <p className="admin-subtitle">Secure dossier management</p>
            </div>

            <div className="admin-stats-brief">
              ID: {profileData?.id?.substring(0, 8) || "---"}
            </div>
          </header>

          {loading ? (
            <div className="admin-loading" style={{textAlign:'center', marginTop:'50px'}}>
              <h2>DECRYPTING IDENTITY...</h2>
            </div>
          ) : (
            <div className="profile-flex-layout">
              
              <section className="profile-details-card">
                <div className="profile-info-field">
                  <label>Full Identity Name</label>
                  <p>{profileData?.fullName || "Ahmed Abdullah"}</p>
                </div>

                <div className="profile-info-field">
                  <label>Secure Email</label>
                  <p>{profileData?.email}</p>
                </div>

                <div className="profile-info-field">
                  <label>Member Since</label>
                  <p>
                    {profileData?.createdOn
                      ? new Date(profileData.createdOn).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div style={{marginTop: '30px'}}>
                  <button className="refresh-btn">Edit Profile</button>
                </div>
              </section>

              <section className="profile-side-card">
                <div className="avatar-display-wrapper">
                  <img 
                    src={
                      imageBlob ||
                      `https://ui-avatars.com/api/?name=${profileData?.fullName}&background=3b82f6&color=fff`
                    } 
                    alt="Agent Avatar" 
                    className="profile-avatar-large"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${profileData?.fullName}&background=ef4444&color=fff`;
                    }}
                  />
                  <div className="status-indicator">
                    <span className="dot"></span> SYSTEM ACTIVE
                  </div>
                </div>
              </section>

            </div>
          )}
        </motion.div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>
    </div>
  );
}

export default Profile;