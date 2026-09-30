import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Central Portal & Security Gateway
import LoginGateway from './pages/auth/LoginGateway';
import Forbidden403 from './pages/Forbidden403';

// Core & Existing Page Imports
import Home from './pages/Home';
import LandExplorer from './pages/LandExplorer';
import Parcel360 from './pages/Parcel360';
import ChangeDetection from './pages/ChangeDetection';
import FieldVerification from './pages/FieldVerification';
import About from './pages/About';

// Portal 1: Citizen Pages
import CitizenHome from './pages/citizen/CitizenHome';
import CitizenLogin from './pages/citizen/CitizenLogin';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenSearch from './pages/citizen/CitizenSearch';
import TransferRequest from './pages/citizen/TransferRequest';
import TrackApplication from './pages/citizen/TrackApplication';

// Portal 2: Government Official / Editor Pages
import GovLogin from './pages/gov/GovLogin';
import GovDashboard from './pages/gov/GovDashboard';
import ApplicationReview from './pages/gov/ApplicationReview';
import GovAudit from './pages/gov/GovAudit';

// Portal 3: Overall Monitoring / Administration Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateOfficial from './pages/admin/CreateOfficial';
import SystemAudit from './pages/admin/SystemAudit';

// Inner layout to handle route-specific layouts
function AppLayout() {
  const location = useLocation();
  const isExplorer = location.pathname === '/explorer';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Main DPI Gateway */}
          <Route path="/" element={<Home />} />

          {/* CENTRAL 3-ROLE AUTHENTICATION GATEWAY */}
          <Route path="/login" element={<LoginGateway />} />
          <Route path="/403" element={<Forbidden403 />} />

          {/* PORTAL 1: CITIZEN SERVICES */}
          <Route path="/user/login" element={<CitizenLogin />} />
          <Route path="/citizen/login" element={<Navigate to="/user/login" replace />} />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requireCitizen={true}>
                <CitizenDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/citizen/dashboard" element={<Navigate to="/user" replace />} />
          <Route path="/citizen" element={<CitizenHome />} />
          <Route path="/citizen/search" element={<CitizenSearch />} />
          <Route path="/citizen/transfer" element={<TransferRequest />} />
          <Route path="/citizen/track" element={<TrackApplication />} />

          {/* PORTAL 2: EDITOR / GOVERNMENT OFFICIAL PORTAL (Protected) */}
          <Route path="/editor/login" element={<GovLogin />} />
          <Route path="/gov/login" element={<Navigate to="/editor/login" replace />} />
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute requireOfficer={true}>
                <GovDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/gov/dashboard" element={<Navigate to="/editor" replace />} />
          <Route 
            path="/editor/review/:appId" 
            element={
              <ProtectedRoute requireOfficer={true}>
                <ApplicationReview />
              </ProtectedRoute>
            } 
          />
          <Route path="/gov/review/:appId" element={<Navigate to="/editor" replace />} />
          <Route 
            path="/editor/audit" 
            element={
              <ProtectedRoute requireOfficer={true}>
                <GovAudit />
              </ProtectedRoute>
            } 
          />
          <Route path="/gov/audit" element={<Navigate to="/editor/audit" replace />} />

          {/* PORTAL 3: OVERALL MONITORING / ADMINISTRATION (Restricted) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/officials/new" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateOfficial />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/audit" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <SystemAudit />
              </ProtectedRoute>
            } 
          />

          {/* PRESERVED CORE GIS & ANALYTICS WORKSPACES */}
          <Route path="/explorer" element={<LandExplorer />} />
          <Route path="/parcel/:ulpin" element={<Parcel360 />} />
          <Route path="/parcel-360" element={<Navigate to="/parcel/IN29-0412-0014-9201" replace />} />
          <Route path="/change-detection" element={<ChangeDetection />} />
          <Route path="/field-verification" element={<FieldVerification />} />
          <Route path="/about" element={<About />} />

          {/* Backward Compatibility Aliases */}
          <Route path="/government-dashboard" element={<Navigate to="/editor" replace />} />

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
      <AuthProvider>
        <DataProvider>
          <AppLayout />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
