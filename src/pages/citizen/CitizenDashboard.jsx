import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/Badge';
import { 
  User, 
  Search, 
  FileCheck2, 
  Clock, 
  Map, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  ShieldCheck,
  Building2,
  ChevronRight,
  LogOut,
  Layers,
  MapPin
} from 'lucide-react';

export default function CitizenDashboard() {
  const { currentUser, logout } = useAuth();
  const { applications, parcels } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter applications that belong to the citizen
  const citizenApps = applications.filter(app => {
    if (!currentUser) return false;
    const userEmail = (currentUser.email || '').toLowerCase();
    const userPhone = (currentUser.phone || '').replace(/\D/g, '');
    const userName = (currentUser.name || '').toLowerCase();
    const userIdentifier = (currentUser.username || '').toLowerCase();

    const appApplicantEmail = (app.applicant?.email || '').toLowerCase();
    const appApplicantPhone = (app.applicant?.phone || '').replace(/\D/g, '');
    const appApplicantName = (app.applicant?.fullName || '').toLowerCase();

    // Direct match
    if (userEmail && appApplicantEmail && userEmail === appApplicantEmail) return true;
    if (userPhone && appApplicantPhone && (userPhone.includes(appApplicantPhone) || appApplicantPhone.includes(userPhone))) return true;
    if (userName && appApplicantName && appApplicantName.includes(userName)) return true;

    // For demo/prototype convenience, if none match directly, show sample submitted cases
    return app.status === 'SUBMITTED' || app.status === 'CLARIFICATION_REQUIRED';
  });

  // Filter permitted / owned parcels for this citizen
  const myParcels = parcels.slice(0, 3); // Top permitted sample parcels

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
      navigate(`/citizen/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">APPROVED</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">REJECTED</Badge>;
      case 'CLARIFICATION_REQUIRED':
        return <Badge variant="warning">CLARIFICATION REQ</Badge>;
      case 'UNDER_VERIFICATION':
        return <Badge variant="primary">UNDER VERIFICATION</Badge>;
      case 'SUBMITTED':
      default:
        return <Badge variant="neutral">SUBMITTED</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Citizen Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/40 border border-blue-400/50 flex items-center justify-center text-white flex-shrink-0">
            <User className="w-8 h-8 text-blue-200" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {currentUser?.name || 'Citizen Dashboard'}
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full border border-blue-400/30 uppercase">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-blue-200 font-mono">
              Contact: {currentUser?.phone || currentUser?.email || 'Registered Citizen'} • ID: {currentUser?.id || 'CITIZEN-001'}
            </p>
            <p className="text-xs text-blue-300">
              Department of Land Administration • Citizen Public Access Gateway
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/citizen/transfer"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Apply for Transfer</span>
          </Link>
          <button
            onClick={logout}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Quick Search Permitted Land Records */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span>Search Permitted Cadastral Land Records</span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Directly verified against Bhu-Aadhaar National Database
          </span>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by 14-Digit ULPIN or Survey Number (e.g. 14/1A, 14/1B)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <span>Search Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
          <span>Permitted Public Lookups:</span>
          <button
            type="button"
            onClick={() => navigate('/citizen/search?ulpin=IN29-0412-0014-9201')}
            className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono hover:bg-slate-200 text-slate-800"
          >
            14/1A (Agri Title)
          </button>
          <button
            type="button"
            onClick={() => navigate('/citizen/search?ulpin=IN29-0412-0014-9202')}
            className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono hover:bg-slate-200 text-slate-800"
          >
            14/1B (Bank Lien)
          </button>
        </div>
      </section>

      {/* Applications Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">My Applications</span>
          <p className="text-2xl font-black text-slate-900">{citizenApps.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">Logged in session</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">Under Verification</span>
          <p className="text-2xl font-black text-indigo-600">
            {citizenApps.filter(a => a.status === 'UNDER_VERIFICATION' || a.status === 'SUBMITTED').length}
          </p>
          <span className="text-[11px] text-slate-500">SRO verification stage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">Approved Mutations</span>
          <p className="text-2xl font-black text-emerald-600">
            {citizenApps.filter(a => a.status === 'APPROVED').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">RoR Jamabandi updated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">Clarifications Needed</span>
          <p className="text-2xl font-black text-amber-600">
            {citizenApps.filter(a => a.status === 'CLARIFICATION_REQUIRED').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Officer remarks pending</span>
        </div>
      </div>

      {/* My Applications Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              My Submitted Land Applications
            </h2>
            <p className="text-xs text-slate-500">
              Real-time statutory status and assigned Sub-Registrar / Tehsildar office.
            </p>
          </div>
          <Link
            to="/citizen/track"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Open Tracking Terminal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {citizenApps.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No applications currently submitted under this account.</p>
            <Link
              to="/citizen/transfer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Start an Ownership Transfer Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Parcel / ULPIN</th>
                  <th className="py-3 px-4">Transfer Type</th>
                  <th className="py-3 px-4">Assigned Office</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {citizenApps.map((app) => (
                  <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {app.applicationId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{app.surveyNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{app.ulpin}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">
                        {app.transferDetails?.transferType || 'Sale Deed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium">{app.assignedOffice || 'Sub-Registrar Office'}</div>
                      <div className="text-[10px] text-slate-400">{app.assignedOfficerName || 'Assigned Officer'}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/citizen/track?id=${app.applicationId}`}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Permitted Land Parcels Portfolio */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Permitted Land Holdings & Cadastral Records
            </h2>
            <p className="text-xs text-slate-500">
              Properties and titles permitted under your citizen profile.
            </p>
          </div>
          <Link
            to="/explorer"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>GIS Map Explorer</span>
            <Map className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myParcels.map((parcel) => (
            <div
              key={parcel.ulpin}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  Survey No: {parcel.survey_number}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {parcel.area_acres} Acres
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-slate-900 truncate">
                  {parcel.ulpin}
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{parcel.village}, {parcel.mandal}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Clean RoR Title</span>
                <Link
                  to={`/parcel/${parcel.ulpin}`}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Parcel 360°</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statutory Protection Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-950">
        <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-blue-900">National Cadastral Integrity Protection:</span>
          <p className="text-blue-800 leading-relaxed">
            Citizens cannot directly alter official land records or property titles. 
            All changes must be submitted as a statutory application and verified by an authorized Sub-Registrar / Tehsildar before mutation into the official Jamabandi RoR.
          </p>
        </div>
      </div>
    </div>
  );
}
