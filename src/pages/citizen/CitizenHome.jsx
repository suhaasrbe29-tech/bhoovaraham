import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  Search, 
  Map, 
  Layers, 
  FileCheck2, 
  Clock, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import AlertBanner from '../../components/AlertBanner';

export default function CitizenHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackIdInput, setTrackIdInput] = useState('');
  const { parcels, applications } = useData();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim().toLowerCase();
    const match = parcels.find(
      p => p.ulpin.toLowerCase() === clean || p.survey_number.toLowerCase() === clean
    );
    if (match) {
      navigate(`/citizen/search?ulpin=${match.ulpin}`);
    } else {
      navigate(`/citizen/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackIdInput.trim()) return;
    navigate(`/citizen/track?id=${trackIdInput.trim()}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Citizen Banner Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700 text-blue-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>CITIZEN SERVICES PORTAL</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-semibold">Public Access Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Digital Land Services for Citizens
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search authentic land records, inspect parcel boundaries on the cadastral GIS map, 
            submit ownership transfer applications, and track verification status in real time.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-600 shadow-xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by 14-Digit ULPIN or Survey No (e.g. 14/1A, 18/3)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Quick Sample Links */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
              <span>Quick Try:</span>
              <Link
                to="/citizen/search?ulpin=IN29-0412-0014-9201"
                className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 font-mono"
              >
                14/1A (Clean Agri Title)
              </Link>
              <Link
                to="/citizen/search?ulpin=IN29-0412-0014-9202"
                className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 font-mono"
              >
                14/1B (Bank Lien Record)
              </Link>
              <Link
                to="/citizen/search?ulpin=IN29-0412-0018-7711"
                className="px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 font-mono"
              >
                18/3 (Court Case & Lake Buffer)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Statutory Rule Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs text-blue-950">
          <ShieldCheck className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <strong className="text-sm font-bold text-blue-900 block">
              Citizen Rights & Statutory Protection Rule
            </strong>
            <p className="leading-relaxed text-blue-900">
              Under Indian Land Governance law, citizens cannot directly alter official land records or property titles. 
              Citizens may submit an ownership transfer application with requisite deeds and evidence. 
              The application is assigned a unique Application ID and forwarded to the <strong>Sub-Registrar Office</strong> and <strong>Revenue Authority</strong> for verification, encumbrance check, and statutory approval.
            </p>
          </div>
        </div>

        {/* 3 Core Citizen Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Search Land Records */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                1. Search Land Records
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lookup authentic land record details, parcel boundaries on the GIS map, verified Record of Rights (RoR), 
                guidance valuation, encumbrance certificates, and court case status.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/citizen/search"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Land Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Transfer Application */}
          <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ring-1 ring-blue-500/20">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  2. Apply for Ownership Transfer
                </h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit an online application for Sale Deed registration, family partition, or inheritance mutation. 
                Upload deeds and obtain an instant tracking reference number.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/citizen/transfer"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow transition-colors"
              >
                <span>Initiate Transfer Request</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Track Application */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                3. Track Application Status
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track processing milestones, view the assigned government office, respond to clarification requests, 
                and download the official mutation order once approved.
              </p>
              
              {/* Quick Track Input */}
              <form onSubmit={handleTrackSubmit} className="pt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TRF-2026-00124"
                  value={trackIdInput}
                  onChange={(e) => setTrackIdInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800"
                >
                  Track
                </button>
              </form>
            </div>
            <div className="pt-4">
              <Link
                to="/citizen/track"
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Tracking Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Workflow Diagram Section */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              TRANSPARENT PUBLIC SERVICE WORKFLOW
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              How Land Mutation Operates under BHOOVARAHAM
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <strong className="block text-slate-900 font-bold">Citizen Submits Request</strong>
              <p className="text-slate-600">Citizen fills applicant and buyer details and attaches registration deeds.</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <strong className="block text-slate-900 font-bold">Reference ID Generated</strong>
              <p className="text-slate-600">System generates unique tracking number (e.g. TRF-2026-00124) with acknowledgement receipt.</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <strong className="block text-slate-900 font-bold">Government Verification</strong>
              <p className="text-slate-600">Sub-Registrar checks deeds, encumbrances, and cadastral boundaries.</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">4</span>
              <strong className="block text-slate-900 font-bold">Statutory Decision</strong>
              <p className="text-slate-600">Officer approves, rejects, or requests clarifications with remarks.</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">5</span>
              <strong className="block text-emerald-950 font-bold">Land Record Mutated</strong>
              <p className="text-emerald-800">Only upon approval is the official Jamabandi/RoR updated with the new owner.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
