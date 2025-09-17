
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import "./Home.css";
import admissionLogo from "./assets/admission.png";
import libraryLogo from "./assets/library.png";
import attendanceLogo from "./assets/attendance.jpg";
import aicteLogo from "./assets/aicte.jpg";
import cafeteriaLogo from "./assets/cafeteria.jpg";
import AdmissionFeesPage from "./AdmissionPage";


function FullWidthFiveButtons() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAction = (a) => { handleClose(); if (a === 'student') navigate('/student-portal'); if (a === 'settings') alert('Settings (not implemented)'); if (a === 'logout') alert('Logged out (client)'); };
  const buttons = [
    { name: "Admission Fees", logo: admissionLogo, route: "/admission-fees" },
    { name: "Library", logo: libraryLogo, route: "/library" },
    { name: "Attendance", logo: attendanceLogo, route: "/student-portal" },
    { name: "AICTE Points", logo: aicteLogo, route: "/aicte" },
    { name: "Cafeteria", logo: cafeteriaLogo, route: "/cafeteria" }
  ];

  return (
    <main className="page">
      <div className="landing-avatar">
        <Button onClick={handleClick} sx={{ minWidth: 0, p: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 40, height: 40 }} src="/logo.jpeg">A</Avatar>
          <span style={{ fontWeight: 700, color: '#0b2239' }}>Ashish Choudhary ▾</span>
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => handleAction('student')}>Student</MenuItem>
          <MenuItem onClick={() => handleAction('settings')}>Settings</MenuItem>
          <MenuItem onClick={() => handleAction('logout')}>Log out</MenuItem>
        </Menu>
      </div>
      <style>{`
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
    <Router>
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
