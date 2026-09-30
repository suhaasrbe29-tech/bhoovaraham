import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Map, 
  Layers, 
  Activity, 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Satellite,
  Lock,
  Compass,
  User,
  Shield,
  FileText,
  Clock
} from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import StatCard from '../components/StatCard';
import statsData from '../data/stats.json';
import { useData } from '../context/DataContext';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const { parcels, applications } = useData();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim().toLowerCase();
    const match = parcels.find(
      p => p.ulpin.toLowerCase() === clean || p.survey_number.toLowerCase() === clean
    );
    if (match) {
      navigate(`/citizen/search?ulpin=${match.ulpin}`);
    } else {
      navigate(`/citizen/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden py-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-medium">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>National Digital Public Infrastructure</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-semibold">Bhu-Aadhaar ULPIN Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            BHOOVARAHAM
            <span className="block text-xl sm:text-2xl font-semibold text-slate-300 mt-2 font-mono">
              Integrated Land Governance Platform
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A unified, parcel-centric spatial digital public infrastructure connecting 
            <strong> Citizens</strong>, <strong>Government Officials</strong>, and <strong>State Administrators</strong> on the 14-digit ULPIN key.
          </p>

          {/* Central Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700 shadow-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter 14-Digit ULPIN or Survey No (e.g. 14/1A, 18/3)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Search Records</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
              <span>Quick Sample Lookups:</span>
              <button
                onClick={() => navigate('/citizen/search?ulpin=IN29-0412-0014-9201')}
                className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 font-mono"
              >
                14/1A (Clean Agri Title)
              </button>
              <button
                onClick={() => navigate('/citizen/search?ulpin=IN29-0412-0014-9202')}
                className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 font-mono"
              >
                14/1B (Bank Mortgage)
              </button>
              <button
                onClick={() => navigate('/citizen/search?ulpin=IN29-0412-0018-7711')}
                className="px-2.5 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900 font-mono"
              >
                18/3 (Lake Buffer & Court Injunction)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Core Governance Principle Banner */}
        <AlertBanner />

        {/* 3 CLEARLY SEPARATED PORTALS SECTION */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              THREE SEPARATED PORTAL INTERFACES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Select Your Operational Interface
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              BHOOVARAHAM segregates public access from official adjudication and high-security account provisioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PORTAL 1: CITIZEN PORTAL */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ring-1 ring-blue-500/10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      1. CITIZEN PORTAL
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                      PUBLIC
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Publicly accessible without government login. Search authentic land records, inspect parcel boundaries on the GIS map, 
                    submit transfer requests, and track application milestones.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ULPIN & Survey Number GIS Lookup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Public Record of Rights (RoR) View</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submit Ownership Transfer Wizard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Track Status by Reference ID (TRF-2026-XXXXX)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <Link
                  to="/user/login"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <span>Citizen Login (via OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/citizen"
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <span>Browse Public Services</span>
                </Link>
              </div>
            </div>

            {/* PORTAL 2: GOVERNMENT OFFICIAL / EDITOR PORTAL */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ring-1 ring-indigo-500/10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      2. EDITOR / OFFICER PORTAL
                    </h3>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">
                      2FA PROTECTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Protected gateway for Sub-Registrars, Tehsildars, and Revenue Inspectors. 
                    Review transfer requests, verify legal documents, inspect encumbrances, and execute official mutations.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pending Transfer Applications Queues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>15-Step Statutory Adjudication Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Document Checklist & Verification Stamps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Official Jamabandi RoR Mutation Engine</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <Link
                  to="/editor/login"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <span>Officer Login (2-Step OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/editor"
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <span>Open Officer Workstation</span>
                </Link>
              </div>
            </div>

            {/* PORTAL 3: GOVERNMENT ADMINISTRATION */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ring-1 ring-purple-500/10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      3. MONITORING / ADMIN
                    </h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                      MFA PROTECTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Restricted administration console for State Land Commissioners and System Admins. 
                    Commission official accounts, assign roles and granular permissions, activate/deactivate officers, and monitor system-wide audit logs.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Statewide Analytics & Application Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Commission Official Accounts (OFF-XXXX)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Activate / Deactivate Official Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>System-Wide Immutable Audit Trail</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <Link
                  to="/admin/login"
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <span>Administrator Login (MFA)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/admin"
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <span>Open Monitoring Console</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Jurisdiction Metrics */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Administrative Jurisdiction: Varaha Nagar Revenue Circle
            </h2>
            <span className="text-xs text-slate-500 font-mono">Ballari District • Karnataka</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Digitized Parcels"
              value={statsData.summary.total_parcels.toLocaleString()}
              subtitle="Cadastral boundary polygons mapped"
              trend="98.6% Saturation"
              trendType="positive"
              icon={Map}
            />
            <StatCard
              title="Verified Titles (RoR)"
              value={statsData.summary.verified_parcels.toLocaleString()}
              subtitle="Mutated & registered digitally"
              trend="+12 this month"
              trendType="positive"
              icon={CheckCircle2}
            />
            <StatCard
              title="Queued Transfer Requests"
              value={applications.length}
              subtitle="Statutory applications under review"
              trend="Live Queue"
              trendType="warning"
              icon={FileCheck2}
            />
            <StatCard
              title="Active AI Spatial Alerts"
              value={statsData.summary.ai_alerts_active}
              subtitle="Possible change detected"
              trend="3 High Priority"
              trendType="negative"
              icon={Activity}
            />
          </div>
        </section>

        {/* The 4 Core DPI Pillars */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Foundational Pillars of BHOOVARAHAM
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 mb-3">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">1. Cadastral GIS Integration</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Every parcel is a geographic polygon, not an abstract text document. Seamlessly overlay cadastral maps on satellite basemaps.
                </p>
              </div>
              <Link to="/explorer" className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Open Land Explorer →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">2. Parcel 360° Dossier</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Consolidates 18 parameters: RoR, deed registration, encumbrances, property tax, utilities, and master plan zoning into one view.
                </p>
              </div>
              <Link to="/parcel/IN29-0412-0014-9201" className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                Explore Parcel 360° →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">3. AI Land Change Detection</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Automated comparison of multi-temporal satellite imagery to flag unapproved construction and environmental buffer encroachment early.
                </p>
              </div>
              <Link to="/change-detection" className="mt-4 text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                Launch AI Visualizer →
              </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">4. Multi-Departmental Workflow</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Connects Tehsildars, Town Planners, Municipalities, and Field Surveyors with immutable audit trails for every statutory action.
                </p>
              </div>
              <Link to="/gov/dashboard" className="mt-4 text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1">
                View Gov Dashboard →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
