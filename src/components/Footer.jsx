import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content row">
          
          {/* Section 1: Brand & Bio */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand">
              <span className="brand-strike">STRIKE</span>
              <span className="brand-defender">DEFENDER</span>
            </div>
            <p className="footer-description">
              Advanced AI-powered security platform dedicated to protecting web applications 
              from evolving digital threats and zero-day vulnerabilities.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="col-lg-4 col-md-6 mb-4 text-lg-center">
            <h5 className="footer-title">Platform</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/about">About Team</Link></li>
              <li><Link to="/plans">Pricing Plans</Link></li>
              <li><Link to="/successful-attacks">Live Monitor</Link></li>
            </ul>
          </div>

          {/* Section 3: Social & Contact */}
          <div className="col-lg-4 col-md-12 mb-4 text-lg-end">
            <h5 className="footer-title">Connect With Us</h5>
            <div className="social-icons d-flex justify-content-lg-end gap-3 mt-3">
              <motion.a whileHover={{ y: -3 }} href="https://github.com" target="_blank" rel="noreferrer">
                <i className="fab fa-github"></i>
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="https://linkedin.com" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin"></i>
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter"></i>
              </motion.a>
            </div>
            <p className="contact-email mt-3 text-secondary small">contact@strikedefender.net</p>
          </div>

        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
          <p className="copyright-text">
            © {new Date().getFullYear()} Strike Defender AI. All rights reserved.
          </p>
          <div className="legal-links">
            <span className="badge-status">SYSTEM_ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;