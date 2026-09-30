import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import AlertBanner from '../../components/AlertBanner';
import { 
  Building2, 
  Map, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertTriangle, 
  FileCheck2, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  FileText,
  UserCheck
} from 'lucide-react';

export default function GovDashboard() {
  const { currentUser, isSubRegistrar, isRevenueOfficer, isFieldSurveyor, isAuditor } = useAuth();
  const { applications, parcels } = useData();
  const navigate = useNavigate();

  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN || currentUser?.role === 'SUPER_ADMIN';
  const [scopeFilter, setScopeFilter] = useState(isSuperAdmin ? 'ALL' : 'ASSIGNED');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if an application is assigned to the current official
  const isOfficerApp = (app) => {
    if (isSuperAdmin) return true;
    const officerId = (currentUser?.officialId || currentUser?.id || '').toLowerCase();
    const officerUser = (currentUser?.username || '').toLowerCase();
    const officerName = (currentUser?.name || '').toLowerCase();
    const officerOffice = (currentUser?.office || '').toLowerCase();

    const appOfficerId = (app.assignedOfficerId || '').toLowerCase();
    const appOfficerName = (app.assignedOfficerName || '').toLowerCase();
    const appOffice = (app.assignedOffice || '').toLowerCase();

    return (
      (officerId && appOfficerId === officerId) ||
      (officerUser && appOfficerId === officerUser) ||
      (officerName && appOfficerName === officerName) ||
      (officerOffice && appOffice && (appOffice.includes(officerOffice) || officerOffice.includes(appOffice)))
    );
  };

  const assignedApps = applications.filter(isOfficerApp);
  const activeScopedApps = (scopeFilter === 'ASSIGNED' && !isSuperAdmin) ? assignedApps : applications;

  // Metrics computation for active scope
  const totalApps = activeScopedApps.length;
  const pendingApps = activeScopedApps.filter(a => a.status === 'SUBMITTED').length;
  const underVerificationApps = activeScopedApps.filter(a => a.status === 'UNDER_VERIFICATION').length;
  const clarificationApps = activeScopedApps.filter(a => a.status === 'CLARIFICATION_REQUIRED').length;
  const approvedApps = activeScopedApps.filter(a => a.status === 'APPROVED').length;
  const rejectedApps = activeScopedApps.filter(a => a.status === 'REJECTED').length;

  const filteredApps = activeScopedApps.filter(app => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      app.applicationId.toLowerCase().includes(term) ||
      app.ulpin.toLowerCase().includes(term) ||
      app.surveyNumber.toLowerCase().includes(term) ||
      app.applicant?.fullName?.toLowerCase().includes(term) ||
      app.currentOwner?.name?.toLowerCase().includes(term)
    );
  });

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
      {/* Official Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
              OFFICIAL GOVERNMENT PORTAL • {currentUser?.role?.replace('_', ' ')}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-white rounded font-mono">
              {currentUser?.id || 'OFF-1024'}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {currentUser?.office || 'Sub-Registrar Office, Rampur'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Officer: <strong>{currentUser?.name}</strong> ({currentUser?.designation}) • Jurisdiction: {currentUser?.district}, {currentUser?.mandal}
          </p>
        </div>

        {/* Quick Nav Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/explorer"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            <span>GIS Explorer</span>
          </Link>
          <Link
            to="/field-verification"
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Field Tasks</span>
          </Link>
          <Link
            to="/gov/audit"
            className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* Mandatory Governance Principle */}
      <AlertBanner compact={true} />

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Queued</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">{totalApps}</span>
          <span className="text-[10px] text-slate-400">Applications</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-700 uppercase block">Pending Scrutiny</span>
          <span className="text-2xl font-black text-blue-600 font-mono mt-0.5 block">{pendingApps}</span>
          <span className="text-[10px] text-blue-600 font-medium">New Submissions</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-indigo-700 uppercase block">Under Verification</span>
          <span className="text-2xl font-black text-indigo-600 font-mono mt-0.5 block">{underVerificationApps}</span>
          <span className="text-[10px] text-indigo-600 font-medium">In Scrutiny</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-700 uppercase block">Clarifications</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-0.5 block">{clarificationApps}</span>
          <span className="text-[10px] text-amber-600 font-medium">Citizen Action</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Approved</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-0.5 block">{approvedApps}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Records Mutated</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-rose-700 uppercase block">Rejected</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-0.5 block">{rejectedApps}</span>
          <span className="text-[10px] text-rose-600 font-medium">Order Recorded</span>
        </div>
      </div>

      {/* Transfer Applications Management Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Land Ownership Transfer Applications Queue
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded">
                STATUTORY ADJUDICATION
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review submitted deeds, verify encumbrances & cadastral geometry, and execute official mutations.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Scope Switcher for Operational Officers */}
            {!isSuperAdmin && (
              <div className="flex items-center bg-slate-200/90 p-0.5 rounded border border-slate-300">
                <button
                  type="button"
                  onClick={() => setScopeFilter('ASSIGNED')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    scopeFilter === 'ASSIGNED'
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                  title="Applications assigned to your account or office station"
                >
                  My Assigned ({assignedApps.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScopeFilter('ALL')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    scopeFilter === 'ALL'
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                  title="All applications in system"
                >
                  All Queue ({applications.length})
                </button>
              </div>
            )}
            {isSuperAdmin && (
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                Statewide Queue ({applications.length})
              </span>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search ULPIN, Survey, App ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono w-48"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="ALL">All Statuses ({totalApps})</option>
              <option value="SUBMITTED">Pending / Submitted ({pendingApps})</option>
              <option value="UNDER_VERIFICATION">Under Verification ({underVerificationApps})</option>
              <option value="CLARIFICATION_REQUIRED">Clarification Required ({clarificationApps})</option>
              <option value="APPROVED">Approved ({approvedApps})</option>
              <option value="REJECTED">Rejected ({rejectedApps})</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Application ID & Date</th>
                <th className="py-3 px-4">Target Parcel & ULPIN</th>
                <th className="py-3 px-4">Applicant (Transferee)</th>
                <th className="py-3 px-4">Transfer Deed & Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Adjudication Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No applications in this view</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {scopeFilter === 'ASSIGNED' && !isSuperAdmin
                        ? `No applications are currently assigned to ${currentUser?.name || currentUser?.username} (${currentUser?.id || ''}). Click "All Queue" to view system submissions.`
                        : 'No applications match the search term or status filter.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">{app.applicationId}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        Survey No. {app.surveyNumber} ({app.village})
                      </div>
                      <div className="font-mono text-[10px] text-blue-700 truncate max-w-[170px]">
                        {app.ulpin}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Extent: {app.areaAcres} Acres
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">{app.applicant?.fullName}</strong>
                      <span className="text-[10px] text-slate-500 block">
                        Seller: {app.currentOwner?.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">
                        {app.transferDetails?.transferType}
                      </span>
                      <span className="font-mono font-semibold text-slate-900">
                        {app.transferDetails?.considerationAmountINR}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/gov/review/${app.applicationId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-xs shadow-sm transition-colors"
                      >
                        <span>Review & Adjudicate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
