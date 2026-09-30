import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Map, 
  Layers, 
  Activity, 
  Building2, 
  FileCheck2, 
  Info, 
  Menu, 
  X, 
  Compass, 
  ShieldAlert,
  Search,
  User,
  Shield,
  RotateCcw,
  ChevronDown,
  CheckCircle,
  Lock,
  FileText,
  LogOut,
  Cloud,
  SlidersHorizontal
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    currentUser, 
    switchRole, 
    logout, 
    isSupabaseConfigured,
    isDemoMode,
    setIsDemoMode
  } = useAuth();
  const { resetToDefaults } = useData();

  const handleRoleChange = (role) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === ROLES.CITIZEN && (location.pathname.startsWith('/gov') || location.pathname.startsWith('/admin'))) {
      navigate('/citizen');
    } else if (role === ROLES.SUPER_ADMIN && !location.pathname.startsWith('/admin')) {
      navigate('/admin');
    } else if (role !== ROLES.CITIZEN && !location.pathname.startsWith('/gov') && !location.pathname.startsWith('/admin')) {
      navigate('/gov/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm("Reset all demo data (transfers, mutated owners, and audit logs) back to seed defaults?")) {
      resetToDefaults();
      alert("Demo data successfully restored to factory defaults.");
    }
  };

  const isPortalActive = (prefix) => location.pathname.startsWith(prefix);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-md">
      {/* Top Official DPI Header Strip */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          {/* Left Brand Identifier */}
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-semibold text-amber-300 tracking-wide text-[11px] uppercase">
              GOVERNMENT OF INDIA • DIGITAL PUBLIC INFRASTRUCTURE
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-400 text-[11px]">
              Bhu-Aadhaar ULPIN National Land Governance System
            </span>
            {isSupabaseConfigured ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                <Cloud className="w-3 h-3" />
                <span>Cloud DB Active</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                <span>Local Prototype Mode</span>
              </span>
            )}
          </div>

          {/* Right Session & Production Controls */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Authenticated User Profile Pill */}
            {currentUser?.isAuthenticated ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
                <span className={`w-2 h-2 rounded-full ${
                  currentUser.role === ROLES.SUPER_ADMIN ? 'bg-purple-400' :
                  currentUser.role === ROLES.SUB_REGISTRAR ? 'bg-blue-400' :
                  currentUser.role === ROLES.REVENUE_OFFICER ? 'bg-indigo-400' : 'bg-emerald-400'
                }`} />
                <span className="font-semibold text-slate-200">
                  {currentUser.username || currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  {currentUser.role?.replace('_', ' ')}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 ml-1 p-0.5 transition-colors"
                  title="Logout Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to="/user/login"
                  className="text-[11px] text-blue-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 bg-slate-900"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/editor/login"
                  className="text-[11px] text-indigo-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 bg-slate-900"
                >
                  Officer Login
                </Link>
                <Link
                  to="/admin/login"
                  className="text-[11px] text-purple-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 bg-slate-900"
                >
                  Admin Login
                </Link>
                <Link
                  to="/login"
                  className="text-[11px] text-amber-400 hover:text-white px-2 py-0.5 rounded border border-amber-500/40 bg-amber-950/40 font-semibold hidden sm:inline"
                >
                  Select Role →
                </Link>
              </div>
            )}

            {/* Demo Mode Toggle (Subtle developer switch) */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`p-1 rounded text-[10px] border flex items-center gap-1 transition-colors ${
                isDemoMode 
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
              title="Toggle Demo Testing Switcher"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden md:inline">{isDemoMode ? 'Demo Mode: ON' : 'Demo Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEMO MODE WARNING BANNER (Only visible when explicitly turned ON) */}
      {isDemoMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              DEMO MODE — NOT REAL AUTHENTICATION (Use for visual demonstration only; real accounts must authenticate via login).
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] font-bold">Quick Role:</span>
              <button
                onClick={() => handleRoleChange(ROLES.CITIZEN)}
                className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px]"
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleChange(ROLES.SUB_REGISTRAR)}
                className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px]"
              >
                Sub-Registrar
              </button>
              <button
                onClick={() => handleRoleChange(ROLES.SUPER_ADMIN)}
                className="px-2 py-0.5 bg-purple-900 text-white rounded text-[10px]"
              >
                Super Admin
              </button>
              <button
                onClick={() => setIsDemoMode(false)}
                className="ml-2 text-slate-950 font-bold hover:underline text-[11px]"
              >
                ✕ Close Demo Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Emblem Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-sm border border-amber-500/40">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <path d="m5.6 5.6 12.8 12.8" />
                <path d="m18.4 5.6-12.8 12.8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white">
                  BHOOVARAHAM
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700">
                  DPI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Integrated Land Governance Platform
              </p>
            </div>
          </Link>

          {/* Primary Portals Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {/* Portal 1: Citizen Portal */}
            <Link
              to={currentUser?.isAuthenticated && currentUser?.role === ROLES.CITIZEN ? "/user" : "/citizen"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isPortalActive('/citizen') || isPortalActive('/user')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentUser?.isAuthenticated && currentUser?.role === ROLES.CITIZEN ? "1. CITIZEN DASHBOARD" : "1. CITIZEN PORTAL"}</span>
            </Link>

            {/* Portal 2: Government Official / Editor Portal */}
            <Link
              to="/editor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isPortalActive('/editor') || isPortalActive('/gov')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. EDITOR / OFFICER</span>
            </Link>

            {/* Portal 3: Administration & Overall Monitoring */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isPortalActive('/admin')
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>3. MONITORING / ADMIN</span>
            </Link>

            <span className="h-4 w-px bg-slate-800 mx-1"></span>

            {/* GIS Core Tools */}
            <Link
              to="/explorer"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location.pathname === '/explorer'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Land Explorer</span>
            </Link>

            <Link
              to="/parcel/IN29-0412-0014-9201"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location.pathname.startsWith('/parcel/')
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Parcel 360°</span>
            </Link>

            <Link
              to="/change-detection"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location.pathname === '/change-detection'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>AI Satellite</span>
              <span className="px-1 py-0.2 bg-amber-500 text-slate-950 font-bold text-[9px] rounded">
                AI
              </span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </Link>
          </nav>

          {/* Quick Access Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Portals</div>
          <Link
            to={currentUser?.isAuthenticated && currentUser?.role === ROLES.CITIZEN ? "/user" : "/citizen"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-blue-400 hover:bg-slate-800"
          >
            <User className="w-4 h-4" />
            <span>{currentUser?.isAuthenticated && currentUser?.role === ROLES.CITIZEN ? "1. Citizen Dashboard" : "1. Citizen Portal"}</span>
          </Link>
          <Link
            to="/editor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-indigo-400 hover:bg-slate-800"
          >
            <Building2 className="w-4 h-4" />
            <span>2. Editor / Officer Portal</span>
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-purple-400 hover:bg-slate-800"
          >
            <Shield className="w-4 h-4" />
            <span>3. Monitoring & Administration</span>
          </Link>
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-amber-400 hover:bg-slate-800 border border-amber-500/20"
          >
            <Lock className="w-4 h-4" />
            <span>Identity Gateway (Select Role)</span>
          </Link>

          <div className="border-t border-slate-800 my-2"></div>
          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">GIS Services</div>
          
          <Link
            to="/explorer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            <Map className="w-4 h-4" />
            <span>Land Explorer</span>
          </Link>
          <Link
            to="/parcel/IN29-0412-0014-9201"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            <Layers className="w-4 h-4" />
            <span>Parcel 360°</span>
          </Link>
          <Link
            to="/change-detection"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            <Activity className="w-4 h-4" />
            <span>AI Satellite Change Detection</span>
          </Link>
          <Link
            to="/field-verification"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Field Surveyor Workstation</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            <Info className="w-4 h-4" />
            <span>About Architecture</span>
          </Link>
        </div>
      )}
    </header>
  );
}
