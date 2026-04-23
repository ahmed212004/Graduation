import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import "../style/Admin.css";

function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/Authentication/all-accounts"); 
      setAccounts(response.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to terminate this agent's access?")) {
      try {
        // افترضنا أن هذا هو رابط الحذف عندك
        await api.delete(`/api/Authentication/delete-account/${userId}`);
        // تحديث القائمة محلياً بعد الحذف
        setAccounts(accounts.filter(acc => acc.id !== userId));
        alert("Account terminated successfully.");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete account.");
      }
    }
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (acc.fullName && acc.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-layout">
      <Sidebar isOpen={true} /> {/* تأكد من تمرير حالة السايدبار */}
      <div className="admin-main-content">
        <Navbar />
        
        <motion.div 
          className="admin-container"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-page-header">
            <div>
              <h1 className="admin-title">AGENT REGISTRY</h1>
              <p className="admin-subtitle">CENTRAL COMMAND: ACCOUNT MANAGEMENT</p>
            </div>
            <div className="admin-stats-card">
              <span className="stats-label">ACTIVE AGENTS</span>
              <span className="stats-value">{accounts.length}</span>
            </div>
          </div>

          <div className="admin-table-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by ID, Email or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="admin-refresh-btn" onClick={fetchAccounts}>
              RE-SCAN SYSTEM
            </button>
          </div>

          <div className="admin-table-wrapper">
            {loading ? (
              <div className="admin-loading-spinner">
                <div className="scanner-line"></div>
                <span>ACCESSING ENCRYPTED DATABASE...</span>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>AGENT IDENTITY</th>
                    <th>CONTACT EMAIL</th>
                    <th>STATUS</th>
                    <th>CLEARANCE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredAccounts.map((acc) => (
                      <motion.tr 
                        key={acc.id} 
                        className="admin-tr"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <td>
                          <div className="agent-info">
                            <div className="avatar-wrapper">
                              <img src={acc.imagePath || "https://ui-avatars.com/api/?name="+acc.fullName} alt="Avatar" />
                            </div>
                            <span className="agent-name">{acc.fullName || "Unassigned"}</span>
                          </div>
                        </td>
                        <td><span className="agent-email">{acc.email}</span></td>
                        <td>
                          <span className={`status-pill ${acc.emailConfirmed ? 'verified' : 'unverified'}`}>
                            {acc.emailConfirmed ? "VERIFIED" : "PENDING"}
                          </span>
                        </td>
                        <td><span className="clearance-tag">{acc.role || "Level 1"}</span></td>
                        <td>
                          <div className="action-group">
                            <button className="action-btn edit" title="Modify Data">⚙️</button>
                            <button 
                              className="action-btn delete" 
                              title="Terminate"
                              onClick={() => handleDelete(acc.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminAccounts;