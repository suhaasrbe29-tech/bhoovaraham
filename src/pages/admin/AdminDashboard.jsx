import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import AuditLogTable from '../../components/AuditLogTable';
import Badge from '../../components/Badge';
import anomaliesData from '../../data/anomalies.json';
import { 
  Shield, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Clock, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  Power, 
  Lock, 
  LogOut, 
  Settings, 
  Smartphone, 
  Layers, 
  Edit, 
  Save, 
  X, 
  FileCheck2, 
  Check, 
  AlertCircle,
  Map,
  Activity,
  AlertTriangle,
  Compass,
  FileText,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, logout, changePassword } = useAuth();
  const { officials, toggleOfficialStatus, resetOfficialCredentials, auditLogs, parcels = [], applications = [] } = useData();
  const navigate = useNavigate();

  // Active section state: default to 'dashboard'
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard' | 'officials' | 'applications' | 'map' | 'alerts' | 'roles' | 'sessions' | 'audit' | 'security'

  // Filtering & search for officials
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Applications filtering for admin
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');

  // Edit official modal state
  const [editingOfficial, setEditingOfficial] = useState(null);

  // Password change form state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  // Statewide Statistics
  const totalParcels = parcels.length;
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_VERIFICATION').length;
  const approvedApps = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedApps = applications.filter(a => a.status === 'REJECTED').length;
  const clarificationApps = applications.filter(a => a.status === 'CLARIFICATION_REQUIRED').length;

  const totalOfficials = officials.length;
  const activeOfficials = officials.filter(o => o.isActive !== false && o.status !== 'INACTIVE').length;
  const inactiveOfficials = officials.filter(o => o.isActive === false || o.status === 'INACTIVE').length;


  const filteredOfficials = officials.filter(o => {
    if (roleFilter !== 'ALL' && o.role !== roleFilter) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      (o.officialId && o.officialId.toLowerCase().includes(term)) ||
      (o.username && o.username.toLowerCase().includes(term)) ||
      (o.name && o.name.toLowerCase().includes(term)) ||
      (o.department && o.department.toLowerCase().includes(term)) ||
      (o.designation && o.designation.toLowerCase().includes(term)) ||
      (o.district && o.district.toLowerCase().includes(term)) ||
      (o.mandal && o.mandal.toLowerCase().includes(term))
    );
  });

  const handleToggle = (officialId, name, currentStatus) => {
    toggleOfficialStatus(officialId, currentUser);
    setFeedbackMsg(`Account ${officialId} (${name}) has been ${currentStatus ? 'deactivated' : 'activated'}. Status synced across all devices.`);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleReset = (officialId, name) => {
    const tempToken = resetOfficialCredentials(officialId, currentUser);
    setFeedbackMsg(`Password reset for ${officialId} (${name}). One-Time Temporary Auth Token: ${tempToken}`);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (pwdForm.newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await changePassword(pwdForm.currentPassword, pwdForm.newPassword);
      setPwdMsg({ type: 'success', text: res.message || 'Password changed successfully across all devices.' });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
              ADMINISTRATION CONSOLE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-white rounded font-mono">
              USER: {currentUser?.username || 'Bhoovaram'}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-900 rounded font-mono">
              SUPER_ADMIN
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            State Land Records Administration Console
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Cloud Credential Management, Role-Based Access Control & Immutable Statutory Audit
          </p>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/officials/new"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Official</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 border border-slate-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Persistent Feedback Alert */}
      {feedbackMsg && (
        <div className="p-3.5 bg-purple-50 border border-purple-300 text-purple-950 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm animate-in fade-in duration-150">
          <Shield className="w-4 h-4 text-purple-700 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Administration Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-medium">
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'dashboard'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveSection('officials')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'officials'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Officers Roster ({totalOfficials})</span>
        </button>

        <button
          onClick={() => setActiveSection('applications')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'applications'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>System Applications ({totalApps})</span>
        </button>

        <button
          onClick={() => setActiveSection('map')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'map'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Map Monitoring</span>
        </button>

        <button
          onClick={() => setActiveSection('alerts')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'alerts'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>AI Alerts ({anomaliesData.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('roles')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'roles'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>RBAC Matrix</span>
        </button>

        <button
          onClick={() => setActiveSection('audit')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'audit'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('security')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
            activeSection === 'security'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* SECTION 1: DASHBOARD OVERVIEW */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Statewide KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-slate-500 block">Total Parcels</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{totalParcels}</span>
              <span className="text-[10px] text-slate-400">Digitized ULPINs</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-slate-500 block">Total Applications</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{totalApps}</span>
              <span className="text-[10px] text-slate-400">All Offices</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-amber-700 block">Pending Queue</span>
              <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">{pendingApps}</span>
              <span className="text-[10px] text-amber-700 font-medium">Awaiting Action</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-emerald-700 block">Approved</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">{approvedApps}</span>
              <span className="text-[10px] text-emerald-700 font-medium">Mutated Titles</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-purple-700 block">Active Officers</span>
              <span className="text-2xl font-black text-purple-600 font-mono mt-1 block">{activeOfficials}</span>
              <span className="text-[10px] text-purple-700 font-medium">{inactiveOfficials} Deactivated</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold uppercase text-rose-700 block">AI Anomalies</span>
              <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">{anomaliesData.length}</span>
              <span className="text-[10px] text-rose-700 font-medium">Satellite Variance</span>
            </div>
          </div>

          {/* Map Monitoring Snapshot & Quick Supervision */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Statewide GIS Jurisdiction Monitoring</h3>
                </div>
                <button
                  onClick={() => setActiveSection('map')}
                  className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
                >
                  <span>Expand Map Console</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Ballari District</span>
                  <p className="text-lg font-black text-slate-900">4 Parcels • 2 SROs</p>
                  <p className="text-[11px] text-slate-500">1 Encroachment Alert (Survey 18/3)</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Hyderabad Central</span>
                  <p className="text-lg font-black text-slate-900">12 Parcels • 4 SROs</p>
                  <p className="text-[11px] text-emerald-600 font-medium">99.4% Adjudication Rate</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Warangal Urban</span>
                  <p className="text-lg font-black text-slate-900">6 Parcels • 2 SROs</p>
                  <p className="text-[11px] text-slate-500">Cadastral Boundary Sync Active</p>
                </div>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
                <span>Direct full-scale spatial GIS map inspection with 14-digit ULPIN overlay:</span>
                <Link
                  to="/explorer"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow"
                >
                  Open Land Explorer
                </Link>
              </div>
            </div>

            {/* Recent Audit Stream */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Recent System Activity</span>
                </h3>
                <button
                  onClick={() => setActiveSection('audit')}
                  className="text-xs text-purple-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.slice(0, 4).map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[150px]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{log.details}</p>
                    <div className="text-[10px] text-purple-700 font-mono">
                      Actor: {log.actorName || log.username || 'System'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* SECTION 2: GOVERNMENT OFFICIALS DIRECTORY */}
      {activeSection === 'officials' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Topbar */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Commissioned Government Officials Directory</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage login accounts, toggle ACTIVE/INACTIVE status, and reset security credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Name, Username, Office..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono w-56"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
              >
                <option value="ALL">All Roles ({officials.length})</option>
                <option value="SUB_REGISTRAR">Sub-Registrar</option>
                <option value="REVENUE_OFFICER">Revenue Officer / Tehsildar</option>
                <option value="FIELD_SURVEYOR">Field Surveyor</option>
                <option value="AUDITOR">Auditor</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Official ID & Username</th>
                  <th className="py-3 px-4">Officer Details</th>
                  <th className="py-3 px-4">Jurisdiction & Office</th>
                  <th className="py-3 px-4">Role & Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOfficials.map(official => {
                  const isActive = official.isActive !== false && official.status !== 'INACTIVE';
                  return (
                    <tr key={official.officialId || official.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{official.officialId}</span>
                        <span className="font-mono text-purple-700 font-bold block">@{official.username || official.officialId}</span>
                        <span className="text-[10px] text-slate-400">{official.email}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block text-xs">{official.name}</strong>
                        <span className="text-[11px] text-slate-600 block">{official.designation}</span>
                        <span className="text-[10px] text-slate-500 block">{official.department}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-slate-800 block text-xs">{official.office}</strong>
                        <span className="text-[11px] text-slate-500 block">
                          {official.district}, {official.mandal} ({official.state || 'Telangana'})
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Jurisdiction: {official.jurisdiction || official.mandal}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider block w-fit mb-1 ${
                          official.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          official.role === 'SUB_REGISTRAR' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          official.role === 'REVENUE_OFFICER' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                          official.role === 'FIELD_SURVEYOR' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {official.role?.replace('_', ' ')}
                        </span>
                        <Badge variant={isActive ? 'success' : 'danger'}>
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        <div>
                          <span>Created: </span>
                          <span className="font-mono text-slate-700">
                            {official.createdAt ? new Date(official.createdAt).toLocaleDateString() : 'Active'}
                          </span>
                        </div>
                        <div>
                          <span>Last Login: </span>
                          <span className="font-mono text-slate-700">
                            {official.lastLogin ? new Date(official.lastLogin).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        {/* Toggle Status (Active / Inactive) */}
                        <button
                          type="button"
                          onClick={() => handleToggle(official.officialId, official.name, isActive)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            isActive
                              ? 'border border-rose-300 text-rose-700 hover:bg-rose-50'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                          title={isActive ? 'Deactivate Account' : 'Reactivate Account'}
                        >
                          {isActive ? 'Deactivate' : 'Reactivate'}
                        </button>

                        {/* Reset Password */}
                        <button
                          type="button"
                          onClick={() => handleReset(official.officialId, official.name)}
                          className="px-2.5 py-1 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition-colors"
                          title="Generate new temporary access token"
                        >
                          Reset Pwd
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: SYSTEM-WIDE APPLICATIONS SUPERVISION */}
      {activeSection === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Statewide Applications Supervision</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor all land transfer and mutation applications across Sub-Registrar and Taluk offices statewide.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, Survey, Applicant..."
                  value={appSearchTerm}
                  onChange={(e) => setAppSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono w-56"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
              >
                <option value="ALL">All Statuses ({applications.length})</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_VERIFICATION">Under Verification</option>
                <option value="CLARIFICATION_REQUIRED">Clarification Required</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Parcel / ULPIN</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Assigned Office / Officer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications
                  .filter((app) => {
                    if (appStatusFilter !== 'ALL' && app.status !== appStatusFilter) return false;
                    if (!appSearchTerm.trim()) return true;
                    const term = appSearchTerm.toLowerCase();
                    return (
                      app.applicationId.toLowerCase().includes(term) ||
                      app.ulpin.toLowerCase().includes(term) ||
                      app.surveyNumber.toLowerCase().includes(term) ||
                      (app.applicant?.fullName && app.applicant.fullName.toLowerCase().includes(term))
                    );
                  })
                  .map((app) => (
                    <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {app.applicationId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{app.surveyNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{app.ulpin}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{app.applicant?.fullName || 'Citizen Applicant'}</div>
                        <div className="text-[10px] text-slate-500">{app.applicant?.phone || app.applicant?.email || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">{app.assignedOffice || 'Sub-Registrar Office'}</div>
                        <div className="text-[10px] text-slate-500">{app.assignedOfficerName || 'Assigned Officer'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                          app.status === 'CLARIFICATION_REQUIRED' ? 'bg-amber-100 text-amber-800' :
                          app.status === 'UNDER_VERIFICATION' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 text-[11px] max-w-[200px] truncate">
                        {app.officerRemarks || 'No active remarks'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: MAP-BASED MONITORING */}
      {activeSection === 'map' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-600" />
                <span>Map-Based Cadastral Supervision</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Spatial distribution of registered parcels, active mutations, and land classifications across revenue jurisdictions.
              </p>
            </div>
            <Link
              to="/explorer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2"
            >
              <span>Launch Full GIS Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                DISTRICT OVERVIEW
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Ballari Revenue Division</h3>
              <p className="text-xs text-slate-600">Rampur Taluk • Varaha Nagar Circle</p>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Digitized Parcels:</span>
                  <span className="font-mono font-bold">4 Parcels (26.6 Acres)</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Transfers:</span>
                  <span className="font-mono font-bold text-amber-600">2 Applications</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                METROPOLITAN REGISTRY
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Hyderabad Central Division</h3>
              <p className="text-xs text-slate-600">Charminar SRO • Secunderabad SRO</p>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Digitized Parcels:</span>
                  <span className="font-mono font-bold">12 Parcels</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Transfers:</span>
                  <span className="font-mono font-bold text-emerald-600">0 Overdue</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                AGRICULTURAL BELT
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Warangal Urban Division</h3>
              <p className="text-xs text-slate-600">Hanamkonda • Kazipet Revenue Mandal</p>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Digitized Parcels:</span>
                  <span className="font-mono font-bold">6 Parcels</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Transfers:</span>
                  <span className="font-mono font-bold text-indigo-600">1 Under Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: AI SATELLITE ANOMALIES & ALERTS */}
      {activeSection === 'alerts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                <span>AI Satellite Variance & Encroachment Alerts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Optical and SAR change detections flagged automatically against cadastral survey boundaries.
              </p>
            </div>
            <Link
              to="/change-detection"
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
            >
              <span>Satellite Change Detection Module →</span>
            </Link>
          </div>

          <div className="space-y-3">
            {anomaliesData.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{alert.id}</span>
                    <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded">
                      {alert.priority} Priority
                    </span>
                    <span className="font-mono text-slate-600">{alert.ulpin} (Survey {alert.survey_number})</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Confidence: <strong>{alert.confidence_score}%</strong>
                  </span>
                </div>
                <p className="font-medium text-slate-800">{alert.change_type}</p>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Status: <strong>{alert.status}</strong></span>
                  <span>Jurisdiction: {alert.village}, {alert.mandal}, {alert.district}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ROLES & PERMISSIONS MATRIX */}
      {activeSection === 'roles' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Role-Based Access Control (RBAC) Architecture</span>
            </h2>
            <p className="text-slate-600 mt-1">
              Every officer account is bound to a strict statutory role. Permissions are enforced at the database level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-purple-950">SUPER_ADMIN</strong>
                <Badge variant="primary">Root Administrator</Badge>
              </div>
              <p className="text-purple-900 leading-relaxed">
                Manages government officials, commissions SRO accounts, assigns jurisdictions, resets passwords, and monitors system-wide audit logs.
              </p>
              <div className="text-[11px] font-mono text-purple-800">
                Permissions: MANAGE_OFFICIALS, ASSIGN_ROLES, VIEW_SYSTEM_AUDIT, SYSTEM_CONFIG, OVERRIDE_LOCKS
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-blue-950">SUB_REGISTRAR</strong>
                <Badge variant="primary">Registration Department</Badge>
              </div>
              <p className="text-blue-900 leading-relaxed">
                Accesses the Government Official Portal, reviews transfer applications, validates deeds, checks encumbrance certificates, and executes official ownership mutations.
              </p>
              <div className="text-[11px] font-mono text-blue-800">
                Permissions: VIEW_APPLICATIONS, VERIFY_DOCUMENTS, PROCESS_TRANSFERS, APPROVE_TRANSFERS, REJECT_TRANSFERS
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-indigo-950">REVENUE_OFFICER</strong>
                <Badge variant="primary">Revenue & Taluk Administration</Badge>
              </div>
              <p className="text-indigo-900 leading-relaxed">
                Processes Jamabandi records, conducts revenue inquiries, dispatches surveyors for field verification, and certifies partitions.
              </p>
              <div className="text-[11px] font-mono text-indigo-800">
                Permissions: VIEW_APPLICATIONS, APPROVE_MUTATIONS, DISPATCH_SURVEYOR, ADJUDICATE_DISPUTES
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-emerald-950">FIELD_SURVEYOR</strong>
                <Badge variant="primary">Survey, Settlement & Land Records</Badge>
              </div>
              <p className="text-emerald-900 leading-relaxed">
                Inspects cadastral boundaries, ground-truths AI change detection alerts, uploads geo-tagged evidence. Cannot perform final ownership approval.
              </p>
              <div className="text-[11px] font-mono text-emerald-800">
                Permissions: VIEW_ASSIGNED_TASKS, SUBMIT_FIELD_EVIDENCE, UPLOAD_GEO_PHOTOS
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-amber-950">AUDITOR</strong>
                <Badge variant="warning">Internal Audit & Vigilance</Badge>
              </div>
              <p className="text-amber-900 leading-relaxed">
                Read-only scrutiny of all land records, mutation orders, and cryptographic audit logs. Cannot modify land records.
              </p>
              <div className="text-[11px] font-mono text-amber-800">
                Permissions: VIEW_ALL_RECORDS, VIEW_SYSTEM_AUDIT, EXPORT_AUDIT_LOGS
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-slate-900">CITIZEN</strong>
                <Badge variant="neutral">Public User</Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Public access to cadastral land search, RoR lookups, transfer application lodging, and milestone tracking. No administrative access.
              </p>
              <div className="text-[11px] font-mono text-slate-600">
                Permissions: PUBLIC_SEARCH, SUBMIT_TRANSFER, TRACK_APPLICATION
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ACTIVE SESSIONS */}
      {activeSection === 'sessions' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span>Multi-Device Active Sessions Monitor</span>
            </h2>
            <p className="text-slate-500 mt-0.5">
              Persistent cloud sessions authenticated across devices via Supabase JWT tokens.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Device / Terminal</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Gateway IP</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    Current Web Terminal (This Device)
                  </td>
                  <td className="py-3 px-3 font-mono text-purple-700 font-bold">
                    @{currentUser?.username || 'Bhoovaram'}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="primary">{currentUser?.role}</Badge>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    10.24.110.12 (Gov VPN)
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ACTIVE NOW
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    Secondary Laptop / Remote Terminal
                  </td>
                  <td className="py-3 px-3 font-mono text-purple-700">
                    @SRO_HYD_001
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="neutral">SUB_REGISTRAR</Badge>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    10.28.45.88 (NIC Terminal)
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] text-slate-500">Cloud Synced</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: AUDIT LOGS */}
      {activeSection === 'audit' && (
        <div className="space-y-4">
          <AuditLogTable
            logs={auditLogs}
            title="System-Wide Cryptographic Statutory Audit Trail"
            subtitle="Immutable chronological register of logins, official creations, password changes, and mutation orders."
          />
        </div>
      )}

      {/* SECTION 6: SECURITY SETTINGS & CHANGE PASSWORD */}
      {activeSection === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs max-w-2xl mx-auto">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">
                Security Settings: Change Super Admin Password
              </h2>
            </div>
            <p className="text-slate-600 mt-1">
              Update the initial bootstrap credential for <strong className="font-mono text-purple-900">@{currentUser?.username || 'Bhoovaram'}</strong>. 
              Once changed, the old password will stop working across all devices.
            </p>
          </div>

          {pwdMsg.text && (
            <div className={`p-3.5 rounded-lg border text-xs flex items-center gap-2 ${
              pwdMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              {pwdMsg.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{pwdMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Current Password:
              </label>
              <input
                type="password"
                required
                placeholder="Enter current password (e.g. 12345678)..."
                value={pwdForm.currentPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                New Password (minimum 6 characters):
              </label>
              <input
                type="password"
                required
                placeholder="Enter new password..."
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Confirm New Password:
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password..."
                value={pwdForm.confirmPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={pwdLoading}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow flex items-center gap-2 transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>{pwdLoading ? 'Updating Password...' : 'Update Password across Cloud'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
