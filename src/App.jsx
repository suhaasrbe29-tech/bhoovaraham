import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import LandExplorer from './pages/LandExplorer';
import Parcel360 from './pages/Parcel360';
import ChangeDetection from './pages/ChangeDetection';
import GovernmentDashboard from './pages/GovernmentDashboard';
import FieldVerification from './pages/FieldVerification';
import About from './pages/About';

// Inner layout to handle route-specific layouts (e.g. LandExplorer gets full screen map without footer)
function AppLayout() {
  const location = useLocation();
  const isExplorer = location.pathname === '/explorer';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<LandExplorer />} />
          <Route path="/parcel/:ulpin" element={<Parcel360 />} />
          <Route path="/parcel-360" element={<Navigate to="/parcel/IN29-0412-0018-7711" replace />} />
          <Route path="/change-detection" element={<ChangeDetection />} />
          <Route path="/government-dashboard" element={<GovernmentDashboard />} />
          <Route path="/field-verification" element={<FieldVerification />} />
          <Route path="/about" element={<About />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isExplorer && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
