import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import "./Home.css";
import logoImg from "./assets/logo.jpeg";
import admissionLogo from "./assets/admission.png";
import libraryLogo from "./assets/library.png";
import attendanceLogo from "./assets/attendance.jpg";
import aicteLogo from "./assets/aicte.jpg";
import cafeteriaLogo from "./assets/cafeteria.jpg";
import AdmissionFeesPage from "./AdmissionPage";


function FullWidthFiveButtons() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleAction = (a) => { 
    setMenuOpen(false); 
    if (a === 'student') navigate('/student-portal'); 
    if (a === 'settings') alert('Settings (not implemented)'); 
    if (a === 'logout') alert('Logged out (client)'); 
  };

  const buttons = [
    { name: "Admission Fees", logo: admissionLogo, route: "/admission-fees" },
    { name: "Library", logo: libraryLogo, route: "/library" },
    { name: "Attendance", logo: attendanceLogo, route: "/student-portal" },
    { name: "AICTE Points", logo: aicteLogo, route: "/aicte" },
    { name: "Cafeteria", logo: cafeteriaLogo, route: "/cafeteria" }
  ];

  return (
    <main className="page">
      {/* Modern Profile Dropdown */}
      <div className="profile-container">
        <div 
          className={`profile-trigger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="profile-avatar-wrapper">
            <img src={logoImg} alt="User" className="profile-img" />
            <div className="online-indicator"></div>
          </div>
          <div className="profile-info">
            <span className="profile-name">Ashish Choudhary</span>
            <span className="profile-role">Student ID: 2024CS01</span>
          </div>
          <svg 
            className={`chevron-icon ${menuOpen ? 'rotate' : ''}`} 
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {menuOpen && (
          <div className="profile-dropdown-menu">
            <div className="dropdown-header">Account Settings</div>
            <div className="dropdown-item" onClick={() => handleAction('student')}>
              <div className="item-icon">👤</div>
              <span>My Profile</span>
            </div>
            <div className="dropdown-item" onClick={() => handleAction('settings')}>
              <div className="item-icon">⚙️</div>
              <span>Settings</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout" onClick={() => handleAction('logout')}>
              <div className="item-icon">🚪</div>
              <span>Log out</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-container {
          position: absolute;
          top: 30px;
          right: 30px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }
        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .profile-trigger:hover, .profile-trigger.active {
          background: #fff;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        .profile-avatar-wrapper {
          position: relative;
        }
        .profile-img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid #667eea;
          object-fit: cover;
        }
        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #10b981;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
        }
        .profile-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
        }
        .profile-role {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }
        .chevron-icon {
          color: #94a3b8;
          transition: transform 0.3s ease;
        }
        .chevron-icon.rotate {
          transform: rotate(180deg);
        }
        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 220px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          padding: 12px 20px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          background: #f8fafc;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background: #f1f5f9;
          color: #667eea;
          padding-left: 24px;
        }
        .dropdown-divider {
          height: 1px;
          background: #f1f5f9;
        }
        .dropdown-item.logout {
          color: #ef4444;
        }
        .dropdown-item.logout:hover {
          background: #fef2f2;
        }
        .item-icon {
          font-size: 1.1rem;
        }
        .button-logo {
          width: 96px;
          height: 96px;
          object-fit: contain;
          margin-bottom: 12px;
          transition: transform 0.3s;
        }
        .button-rect:hover .button-logo {
          transform: scale(1.08);
        }
      `}</style>
      <section className="full-width-buttons-grid">
        {buttons.map((btn) => (
          <button
            key={btn.name}
            className="button-rect"
            onClick={() => btn.route ? navigate(btn.route) : alert(btn.name)}
            aria-label={btn.name}
          >
            <img src={btn.logo} alt="" className="button-logo" />
            <span className="button-name">{btn.name}</span>
          </button>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const Library = React.lazy(() => import("./Library"));
  const CanteenPage = React.lazy(() => import("./Canteen"));
  const AICTEPortal = React.lazy(() => import("./AICTEPortal"));
  const StudentPortal = React.lazy(() => import("./StudentPortal"));
  return (
    <Router basename="/ERP">
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<FullWidthFiveButtons />} />
          <Route path="/admission-fees" element={<AdmissionFeesPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/cafeteria" element={<CanteenPage />} />
          <Route path="/aicte" element={<AICTEPortal />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}
