import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import "../style/Auth.css";

function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", phoneNumber: "", birthDate: "", profileImage: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState(""); // إضافة: لعرض اسم الملف المختَار
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التأكد من أن الملف صورة
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file (jpg, png).");
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setImagePreview(URL.createObjectURL(file));
      setFileName(file.name); // حفظ اسم الملف
      setError(""); // مسح أي خطأ سابق
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.profileImage) {
        setError("Please upload a profile image.");
        setLoading(false);
        return;
    }

    const data = new FormData();
    data.append("FullName", formData.fullName);
    data.append("Phone", formData.phoneNumber);
    data.append("DateOfBirth", formData.birthDate);
    data.append("Image", formData.profileImage);

    try {
      await api.post("/api/Accounts/Complete-Profile", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Profile Error:", err.response?.data);
      const serverError = err.response?.data?.message || "Failed to finalize profile.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo-box">🆔</div>
          <h1 className="auth-brand-title">IDENTITY INITIALIZATION</h1>
          <p className="auth-brand-subtitle">COMPLETE YOUR AGENT PROFILE</p>
        </div>

        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence>
            {error && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="auth-error-box">
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            
            {/* 📸 قسم رفع الصورة المطور (Drop Zone Style) */}
            <div className="auth-input-group">
              <label className="auth-label">PROFILE PHOTO (REQUIRED)</label>
              
              <div className={`image-upload-zone ${imagePreview ? 'has-image' : ''} ${error && !formData.profileImage ? 'zone-error' : ''}`}>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="file-input-hidden"
                />
                
                {imagePreview ? (
                  <div className="preview-overlay">
                    <img src={imagePreview} alt="Preview" className="profile-final-preview" />
                    <label htmlFor="file-upload" className="change-photo-btn">Change Photo</label>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="upload-placeholder-label">
                    <div className="upload-icon">📸</div>
                    <span className="upload-text">Click to upload or drag & drop</span>
                    <span className="upload-hint">PNG, JPG (Max 5MB)</span>
                  </label>
                )}
              </div>
              {fileName && <p className="file-name-display">📎 {fileName}</p>}
            </div>

            <div className="auth-input-group">
              <label className="auth-label">FULL NAME</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">👤</span>
                <input type="text" className="auth-input" placeholder="John Doe" required onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">PHONE NUMBER</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">📞</span>
                <input type="tel" className="auth-input" placeholder="+20 1XX XXX XXXX" required onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">DATE OF BIRTH</label>
              <div className="auth-input-wrapper">
                <span className="auth-icon">📅</span>
                <input type="date" className="auth-input" required onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading} style={{marginTop: '25px'}}>
              {loading ? "INITIALIZING AGENCY IDENTITY..." : "FINALIZE PROFILE"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default CompleteProfile;