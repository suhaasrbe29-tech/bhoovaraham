import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Key, 
  CheckCircle2,
  Lock,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

const PERMISSION_OPTIONS = [
  { id: 'VIEW_APPLICATIONS', label: 'View Land Transfer Applications', roleMatch: ['SUB_REGISTRAR', 'REVENUE_OFFICER', 'AUDITOR'] },
  { id: 'VERIFY_DOCUMENTS', label: 'Verify Legal Deeds & Certificates', roleMatch: ['SUB_REGISTRAR', 'REVENUE_OFFICER'] },
  { id: 'APPROVE_TRANSFERS', label: 'Statutory Approval for Ownership Transfer', roleMatch: ['SUB_REGISTRAR'] },
  { id: 'REJECT_TRANSFERS', label: 'Issue Statutory Conveyance Rejection Orders', roleMatch: ['SUB_REGISTRAR'] },
  { id: 'APPROVE_MUTATIONS', label: 'Jamabandi RoR Mutation Certification', roleMatch: ['REVENUE_OFFICER'] },
  { id: 'VIEW_ASSIGNED_TASKS', label: 'Access Field Verification Workstation', roleMatch: ['FIELD_SURVEYOR'] },
  { id: 'SUBMIT_FIELD_EVIDENCE', label: 'Upload On-Ground GPS Evidence & Photos', roleMatch: ['FIELD_SURVEYOR'] },
  { id: 'VIEW_SYSTEM_AUDIT', label: 'Inspect System-Wide Statutory Audit Logs', roleMatch: ['AUDITOR', 'SUPER_ADMIN'] }
];

export default function CreateOfficial() {
  const navigate = useNavigate();
  const { createOfficialAccount } = useData();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: 'Ramesh Kumar',
    officialId: 'SRO-TS-001',
    username: 'SRO_HYD_001',
    department: 'Registration & Stamps Department',
    designation: 'Sub-Registrar',
    office: 'Hyderabad Sub-Registrar Office',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Charminar',
    jurisdiction: 'Hyderabad Central Sub-District',
    role: 'SUB_REGISTRAR',
    temporaryPassword: 'GovTemp@2026',
    status: 'ACTIVE',
    permissions: ['VIEW_APPLICATIONS', 'VERIFY_DOCUMENTS', 'APPROVE_TRANSFERS', 'REJECT_TRANSFERS']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    const defaultPerms = PERMISSION_OPTIONS
      .filter(p => p.roleMatch.includes(role))
      .map(p => p.id);

    let defaultDept = formData.department;
    let defaultDesig = formData.designation;
    let defaultOffice = formData.office;

    if (role === 'SUB_REGISTRAR') {
      defaultDept = 'Registration & Stamps Department';
      defaultDesig = 'Sub-Registrar';
      defaultOffice = 'Hyderabad Sub-Registrar Office';
    } else if (role === 'REVENUE_OFFICER') {
      defaultDept = 'Revenue Department';
      defaultDesig = 'Tehsildar & Taluk Magistrate';
      defaultOffice = 'Taluk Revenue Office, Charminar';
    } else if (role === 'FIELD_SURVEYOR') {
      defaultDept = 'Survey, Settlement & Land Records';
      defaultDesig = 'Senior Field Surveyor / Revenue Inspector';
      defaultOffice = 'Circle Cadastral Survey Station';
    } else if (role === 'AUDITOR') {
      defaultDept = 'Internal Audit & Vigilance Directorate';
      defaultDesig = 'Land Records Statutory Auditor';
      defaultOffice = 'State Vigilance Cell';
    }

    setFormData(prev => ({
      ...prev,
      role,
      department: defaultDept,
      designation: defaultDesig,
      office: defaultOffice,
      permissions: defaultPerms
    }));
  };

  const handlePermissionToggle = (permId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permId);
      const updated = exists 
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.officialId.trim() || !formData.username.trim()) {
      setErrorMsg("Please fill all mandatory identity fields (Name, Official ID, Username).");
      return;
    }

    setIsLoading(true);
    try {
      await createOfficialAccount({
        ...formData,
        email: `${formData.username.toLowerCase()}@sro.gov.in`
      }, currentUser);

      alert(`Official account for ${formData.name} (@${formData.username}) successfully commissioned. The officer can now log into 2. GOV OFFICIAL PORTAL from any device using their credentials.`);
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create official account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                OFFICIAL IDENTITY COMMISSIONING
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Create Government Official Account
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Provision persistent multi-device credentials for Sub-Registrars, Revenue Officers, Surveyors, and Auditors.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
        {/* Basic Identifiers */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            1. Official Identity & Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official ID (Gov Alphanumeric) *</label>
              <input
                type="text"
                name="officialId"
                placeholder="e.g. SRO-TS-001"
                value={formData.officialId}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Username (Login ID) *</label>
              <input
                type="text"
                name="username"
                placeholder="e.g. SRO_HYD_001"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-purple-700 bg-purple-50/50"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Registration & Stamps Department">Registration & Stamps Department</option>
                <option value="Revenue Department">Revenue Department</option>
                <option value="Survey, Settlement & Land Records">Survey, Settlement & Land Records</option>
                <option value="Internal Audit & Vigilance Directorate">Internal Audit & Vigilance Directorate</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Designation *</label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. Sub-Registrar"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Office Station *</label>
              <input
                type="text"
                name="office"
                placeholder="e.g. Hyderabad Sub-Registrar Office"
                value={formData.office}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Jurisdiction & Role */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            2. Statutory Jurisdiction & Role Assignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">State:</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">District:</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mandal / Taluk:</label>
              <input
                type="text"
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jurisdiction Extent:</label>
              <input
                type="text"
                name="jurisdiction"
                placeholder="e.g. Charminar / Hyderabad Central"
                value={formData.jurisdiction}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Statutory Role Assignment *</label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-bold text-purple-900"
              >
                <option value="SUB_REGISTRAR">SUB_REGISTRAR</option>
                <option value="REVENUE_OFFICER">REVENUE_OFFICER</option>
                <option value="FIELD_SURVEYOR">FIELD_SURVEYOR</option>
                <option value="AUDITOR">AUDITOR</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Temporary Initial Password *</label>
              <input
                type="text"
                name="temporaryPassword"
                value={formData.temporaryPassword}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Hashed securely in database.</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Account Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold text-emerald-800"
              >
                <option value="ACTIVE">ACTIVE (Authorized to log in)</option>
                <option value="INACTIVE">INACTIVE (Access Locked)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Role Permissions Checkboxes */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            3. Role-Based Permissions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
            {PERMISSION_OPTIONS.map(perm => (
              <label
                key={perm.id}
                className={`p-3 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  formData.permissions.includes(perm.id)
                    ? 'bg-purple-50/70 border-purple-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(perm.id)}
                  onChange={() => handlePermissionToggle(perm.id)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="font-mono font-bold text-[10px] text-slate-500 block">{perm.id}</span>
                  <span className="font-semibold text-slate-900 block">{perm.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-200">
          <Link
            to="/admin"
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-colors disabled:bg-purple-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Commissioning Cloud Account...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Commission Official Account</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
