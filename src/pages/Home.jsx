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
  Compass
} from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import StatCard from '../components/StatCard';
import statsData from '../data/stats.json';
import parcelsData from '../data/parcels.json';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim();
    // Check if match exists in sample parcels
    const match = parcelsData.find(
      p => p.ulpin.toLowerCase() === clean.toLowerCase() || p.survey_number.toLowerCase() === clean.toLowerCase()
    );
    if (match) {
      navigate(`/parcel/${match.ulpin}`);
    } else {
      // Navigate to explorer with query
      navigate('/explorer');
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-medium">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>National Land Governance Initiative</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-semibold">Digital Public Infrastructure (DPI)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            BHOOVARAHAM
            <span className="block text-xl sm:text-2xl font-semibold text-slate-300 mt-2 font-mono">
              Integrated GIS Digital Public Infrastructure for Land Governance
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transitioning land administration from disjointed, deed-based silos into a unified, 
            <strong className="text-white"> parcel-centric spatial ecosystem</strong> anchored on the 14-digit ULPIN (Bhu-Aadhaar).
          </p>

          {/* Central ULPIN / Survey Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-lg border border-slate-700 shadow-xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter 14-Digit ULPIN or Survey No (e.g. 18/3, 14/1A)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-900 text-white rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Search Parcel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Sample Search Chips */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
              <span>Sample Parcels:</span>
              <button
                onClick={() => navigate('/parcel/IN29-0412-0018-7711')}
                className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900 font-mono"
              >
                18/3 (Lake Buffer AI Alert)
              </button>
              <button
                onClick={() => navigate('/parcel/IN29-0412-0014-9201')}
                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 font-mono"
              >
                14/1A (Clean Agri Title)
              </button>
              <button
                onClick={() => navigate('/parcel/IN29-0412-0016-4402')}
                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 font-mono"
              >
                16/A (Commercial Mortgage)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Core Governance Principle Banner */}
        <AlertBanner />

        {/* High-level DPI Metrics */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
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
              title="Pending Verifications"
              value={statsData.summary.pending_verification}
              subtitle="Field inspection queued"
              trend="Active Queue"
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
            {/* Card 1 */}
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

            {/* Card 2 */}
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
              <Link to="/parcel/IN29-0412-0018-7711" className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                Explore Parcel 360° →
              </Link>
            </div>

            {/* Card 3 */}
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

            {/* Card 4 */}
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
              <Link to="/government-dashboard" className="mt-4 text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1">
                View Gov Dashboard →
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Spotlight: AI Detects -> Human Verifies -> Authority Acts */}
        <section className="bg-slate-50 rounded-xl border border-slate-300 p-6 sm:p-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-100/80 px-2.5 py-1 rounded">
              Responsible Governance Framework
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Why AI Never Determines Legal Encroachment
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              In constitutional administrative law, algorithms cannot strip citizens of property rights. 
              BHOOVARAHAM embeds this safeguard into every workflow:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <span className="text-amber-600 font-mono text-xs font-bold block mb-1">STAGE 1</span>
                <h4 className="font-bold text-slate-900 text-sm">AI Detects</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Optical & spectral change detection flags "Possible change detected" with a confidence score.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <span className="text-emerald-600 font-mono text-xs font-bold block mb-1">STAGE 2</span>
                <h4 className="font-bold text-slate-900 text-sm">Human Verifies</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Field Surveyor inspects ground, checks permits, and records geo-tagged photographic evidence.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <span className="text-blue-600 font-mono text-xs font-bold block mb-1">STAGE 3</span>
                <h4 className="font-bold text-slate-900 text-sm">Authority Acts</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Tehsildar or Municipal Commissioner reviews human evidence and issues statutory notice under law.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <Link
                to="/field-verification"
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Inspect Surveyor Interface →
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Read Platform Concept & Architecture
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
