import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

// استدعاء ملفات الـ CSS بالترتيب
import "../style/Admin.css";         // الستايل العام للهيكل (layout)
import "../style/AdminAccounts.css"; // الستايل الخاص بالجدول والبحث

function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Accounts/Get-All-Accounts");
      setAccounts(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = accounts.filter(acc => 
    acc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout">
      {/* 1. السايدبار ثابت في مكانه */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="admin-main-content">
        {/* 2. النافبار ثابت في الأعلى */}
        <Navbar />

        {/* 3. حاوية المحتوى مع مسافة أمان من الأعلى (تعديل الـ Padding في Admin.css) */}
        <motion.div 
          className="accounts-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* هيدر الصفحة المحسن */}
          <header className="admin-page-header">
            <div className="header-text">
              <h1 className="admin-title">System Accounts</h1>
              <p className="admin-subtitle">Total Verified Agents: {accounts.length}</p>
            </div>
            <div className="admin-stats-brief">SECURE ACCESS</div>
          </header>

          {/* شريط البحث والأدوات */}
          <div className="accounts-tools">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input"
                placeholder="Search by Agent Identity or Email..." 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="refresh-btn" onClick={fetchAccounts}>
              {loading ? "SYNCING..." : "REFRESH DATA"}
            </button>
          </div>

          {/* الجدول المتجاوب */}
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Secure Email</th>
                  <th>Clearance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((acc) => (
                    <tr key={acc.id} className="admin-tr">
                      <td>
                        <div className="agent-cell">
                          <img 
                            src={acc.imagePath || `https://ui-avatars.com/api/?name=${acc.fullName}&background=3b82f6&color=fff`} 
                            alt="avatar" 
                            className="agent-img"
                          />
                          <span className="agent-name">{acc.fullName}</span>
                        </div>
                      </td>
                      <td className="email-cell">{acc.email}</td>
                      <td><span className="role-badge">{acc.role || "Agent"}</span></td>
                      <td><span className="status-badge active">ACTIVE</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" title="Edit Agent">✏️</button>
                          <button className="btn-delete" title="Remove Agent">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      {loading ? "📡 DECRYPTING DATABASE..." : "⚠️ No matching agent identities found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* زر الموبايل */}
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>
    </div>
  );
}

export default AdminAccounts;