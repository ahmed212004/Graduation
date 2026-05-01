import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/About.css";

const About = () => {
  // بيانات الـ 6 طلاب
  const teamMembers = [
    { name: "Ahmed Momtaz", role: "Lead AI Architect", bio: "Generative AI & Neural Defense.", img: "/images/team/1.jpg" },
    { name: "Abdulrahman Khalil ", role: "Security Officer", bio: "WAF Hardening & Mitigation.", img: "/images/team/2.jpg" },
    { name: "Ahmed Kamal", role: "Backend Engineer", bio: "Security Infrastructure Architect.", img: "/images/team/3.jpg" },
    { name: "Ahmed Saber", role: "Neural Researcher", bio: "Deep Learning Pattern Analysis.", img: "/images/team/4.jpg" },
    { name: "Ziad Mahmoud", role: "Red Team Ops", bio: "Advanced Penetration Simulation.", img: "/images/team/5.jpg" },
    { name: "Ahmed Abdullah", role: "Frontend Lead", bio: "Security Interface Designer.", img: "/images/team/6.jpg" },
  ];

  return (
    <div className="about-page-root">
      <Navbar />

      <main className="container my-5 pt-5">
        <section className="text-center mb-5">
          <h1 className="display-4 fw-bold text-white mb-3">
            Strike <span style={{ color: "#389db5" }}>Defender</span> Team
          </h1>
          <p className="text-secondary mx-auto" style={{ maxWidth: "700px" }}>
            Professional Team of 6 Students dedicated to pioneering AI-powered web defense.
          </p>
        </section>

        <section className="team-grid-section">
          {/* g-4 تعطي مسافات بين الكروت ، و row تنظمهم أفقياً */}
          <div className="row g-4 justify-content-center">
            {teamMembers.map((member, index) => (
              /* col-lg-4 تعني 3 كروت في الصف في الشاشات الكبيرة */
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="team-card-v2"
                >
                  <div className="member-avatar-container">
                    <img src={member.img} alt={member.name} />
                  </div>
                  <div className="member-details">
                    <h3 className="name text-white">{member.name}</h3>
                    <span className="role">{member.role}</span>
                    <p className="bio">{member.bio}</p>
                    <div className="social-actions gap-2 d-flex justify-content-center">
                      <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
                      <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;