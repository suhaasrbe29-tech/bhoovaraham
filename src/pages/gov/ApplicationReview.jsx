import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import MapViewer from '../../components/MapViewer';
import Badge from '../../components/Badge';
import courtCasesData from '../../data/courtCases.json';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck2, 
  MapPin, 
  User, 
  FileText, 
  CreditCard, 
  Scale, 
  Clock, 
  ShieldCheck, 
  Download,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

export default function ApplicationReview() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSubRegistrar, isRevenueOfficer, isAuditor, isFieldSurveyor } = useAuth();
  const { 
    applications, 
    parcels, 
    verifyApplicationDocument, 
    updateApplicationStatus 
  } = useData();

  // Find target application
  const app = applications.find(a => a.applicationId.toLowerCase() === (appId || '').toLowerCase()) || applications[0];

  // Find associated parcel in reactive store
  const targetParcel = parcels.find(p => p.ulpin === app?.ulpin) || parcels[0];

  // Find court cases for this parcel
  const parcelCases = (courtCasesData.parcelCases || []).filter(c => c.ulpin === app?.ulpin);
  const activeCourtCases = parcelCases.filter(c => c.current_status !== 'Disposed' && c.current_status !== 'Closed');

  // Officer remark input
  const [remarks, setRemarks] = useState(
    app?.officerRemarks || "All title documents verified against Sub-Registrar records. Stamp duty validated. Approved for mutation."
  );
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Permission to approve transfers
  const canApprove = isSubRegistrar || isRevenueOfficer || currentUser?.role === ROLES.SUPER_ADMIN;

  // Handle single doc verification toggle
  const handleDocToggle = (docId, currentStatus) => {
    verifyApplicationDocument(app.applicationId, docId, !currentStatus, 'Verified by SRO Officer', currentUser);
  };

  // Handle statutory decision
  const handleDecision = (newStatus) => {
    if (!canApprove && (newStatus === 'APPROVED' || newStatus === 'REJECTED')) {
      alert(`Access Restricted: Your role (${currentUser?.role}) is not authorized to sign official transfer orders. Only Sub-Registrars or Revenue Officers may approve.`);
      return;
    }

    if (!remarks.trim()) {
      alert("Please enter official statutory remarks before submitting decision.");
      return;
    }

    updateApplicationStatus(app.applicationId, newStatus, remarks.trim(), currentUser);

    if (newStatus === 'APPROVED') {
      setActionSuccessMsg(`Transfer Order successfully issued for ${app.applicationId}. Official Record of Rights (Jamabandi/RoR) for parcel ${app.ulpin} has been mutated to ${app.applicant.fullName}.`);
    } else if (newStatus === 'REJECTED') {
      setActionSuccessMsg(`Application ${app.applicationId} has been rejected. Statutory order recorded in audit logs.`);
    } else if (newStatus === 'CLARIFICATION_REQUIRED') {
      setActionSuccessMsg(`Clarification notice dispatched to citizen applicant for ${app.applicationId}.`);
    }
  };

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">
        Application not found. <Link to="/gov/dashboard" className="text-blue-600 underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/gov/dashboard"
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Back to Government Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                OFFICIAL STATUTORY ADJUDICATION CONSOLE
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                app.status === 'CLARIFICATION_REQUIRED' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {app.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
              Review: {app.applicationId}
            </h1>
          </div>
        </div>

        {/* Officer Context Badge */}
        <div className="flex items-center gap-2 text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-indigo-700" />
          <span>Reviewing Officer: <strong>{currentUser?.name}</strong> ({currentUser?.role})</span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <Link
            to={`/parcel/${app.ulpin}`}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold ml-4"
          >
            Inspect Mutated Parcel
          </Link>
        </div>
      )}

      {/* Role permission notice if Auditor or Surveyor */}
      {!canApprove && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Read-Only Scrutiny Mode:</strong> Logged in as <strong>{currentUser?.role}</strong>. 
            Final transfer approval is restricted to Sub-Registrar / Revenue Officers.
          </span>
        </div>
      )}

      {/* Main Review Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: GIS Map & Parcel Cadastral Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Cadastral GIS Preview */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[400px]">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">Cadastral Parcel GIS Boundary</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">
                Survey: {app.surveyNumber}
              </span>
            </div>
            <div className="flex-1 relative">
              <MapViewer selectedParcel={targetParcel} onSelectParcel={() => {}} />
            </div>
          </div>

          {/* Current Official Land Record (Before/After Mutation) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Current Official Land Record (RoR)</span>
              </h3>
              <Badge variant="primary">ULPIN: {targetParcel.ulpin}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Survey Number</span>
                <strong className="text-slate-900 font-mono text-sm">{targetParcel.survey_number}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Cadastral Extent</span>
                <strong className="text-slate-900 font-mono text-sm">{targetParcel.area_acres} Acres</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Land Classification</span>
                <strong className="text-slate-900">{targetParcel.land_use}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Government Guidance</span>
                <strong className="text-slate-900 font-mono">{targetParcel.market_valuation_inr}</strong>
              </div>
            </div>

            {/* Current Recorded Owners */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Current Registered Owner(s) in Jamabandi:
              </span>
              {targetParcel.ror?.owners?.map((owner, idx) => (
                <div key={idx} className="p-2.5 rounded bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 text-sm block">{owner.name}</strong>
                    <span className="text-slate-500 text-[11px]">{owner.relation}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-900">{owner.extent_acres} Acres</span>
                    <span className="text-[10px] text-slate-500 block">Share: {owner.share_percent}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Mutation Order */}
            <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[11px]">
              <span>Active Mutation Order: </span>
              <strong className="font-mono text-slate-900">{targetParcel.ror?.mutation_number}</strong>
              <span> ({targetParcel.ror?.mutation_date})</span>
            </div>
          </div>

          {/* Encumbrance & Litigation Risk Warnings */}
          <div className="space-y-3">
            {/* Encumbrance */}
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              targetParcel.encumbrance?.is_encumbered
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>Encumbrance & Lien Registry</span>
                </div>
                <Badge variant={targetParcel.encumbrance?.is_encumbered ? 'danger' : 'success'}>
                  {targetParcel.encumbrance?.is_encumbered ? 'MORTGAGE RECORDED' : 'CLEAR TITLE / NEC'}
                </Badge>
              </div>
              <p className="text-[11px] leading-relaxed">
                {targetParcel.encumbrance?.status}
              </p>
              {targetParcel.encumbrance?.bank_name !== 'None' && (
                <div className="text-[11px] font-bold text-rose-800">
                  Lien Holder: {targetParcel.encumbrance?.bank_name} • Loan Charge: {targetParcel.encumbrance?.loan_amount}
                </div>
              )}
            </div>

            {/* Court Litigation */}
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              activeCourtCases.length > 0
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <Scale className="w-4 h-4" />
                  <span>Litigation & Injunction Status</span>
                </div>
                <Badge variant={activeCourtCases.length > 0 ? 'danger' : 'success'}>
                  {activeCourtCases.length > 0 ? `${activeCourtCases.length} ACTIVE LITIGATIONS` : 'CLEAR OF DISPUTES'}
                </Badge>
              </div>
              {activeCourtCases.length > 0 ? (
                <div className="space-y-1 text-[11px]">
                  <strong className="text-rose-900 block font-semibold">{activeCourtCases[0].court_name}</strong>
                  <div>Case No: <span className="font-mono font-bold">{activeCourtCases[0].case_number}</span></div>
                  <div className="italic text-rose-800 font-medium">Interim: {activeCourtCases[0].interim_orders}</div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-600">
                  No civil suits or injunctive restraints found in judicial court database.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Application Details, Document Verification, and Statutory Decision (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Transferee & Transaction Terms */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Transferee / Proposed Purchaser Particulars</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Proposed New Owner</span>
                <strong className="text-slate-900 text-sm block">{app.applicant?.fullName}</strong>
                <span className="text-slate-500">{app.applicant?.relation}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Identity / Synthetic Aadhaar</span>
                <strong className="text-slate-900 font-mono text-sm block">{app.applicant?.aadhaarHash}</strong>
                <span className="text-slate-500">{app.applicant?.phone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Deed Category</span>
                <strong className="text-slate-900 block">{app.transferDetails?.transferType}</strong>
                <span className="text-slate-500">Proposed Share: {app.transferDetails?.proposedShare || 100}%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Consideration Amount</span>
                <strong className="text-slate-900 font-mono text-sm block">{app.transferDetails?.considerationAmountINR}</strong>
                <span className="text-slate-500 font-mono">Challan: {app.transferDetails?.challanNumber}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              <strong>Applicant Address:</strong> {app.applicant?.address}
            </div>

            {app.citizenClarification && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 text-xs space-y-1">
                <strong className="block font-bold">Latest Clarification Received from Applicant:</strong>
                <p>"{app.citizenClarification}"</p>
              </div>
            )}
          </div>

          {/* Document Verification Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Mandatory Statutory Documents Verification</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Click the verification checkbox to affix your officer digital stamp to each instrument.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {app.documents?.filter(d => d.isVerified).length} of {app.documents?.length} Verified
              </span>
            </div>

            <div className="space-y-3">
              {app.documents?.map(doc => (
                <div
                  key={doc.id}
                  className={`p-3.5 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                    doc.isVerified
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-semibold">{doc.name}</strong>
                      <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {doc.fileSize}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Ref: {doc.docNumber || 'Attached PDF'}
                    </div>
                    {doc.remarks && (
                      <p className="text-[10px] text-slate-600 italic">
                        Note: {doc.remarks}
                      </p>
                    )}
                    {doc.isVerified && doc.verifiedBy && (
                      <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified by {doc.verifiedBy} at {new Date(doc.verifiedAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Toggle */}
                  <button
                    type="button"
                    onClick={() => handleDocToggle(doc.id, doc.isVerified)}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                      doc.isVerified
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{doc.isVerified ? 'Verified' : 'Verify'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Adjudication Decision & Remarks Console */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Statutory Officer Remarks & Decision Order</span>
            </h3>

            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">
                Official Recorded Remarks (Will be appended to statutory audit trail and citizen dossier):
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter statutory verification findings, compliance notes, or clarification requirements..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-sans"
              />
            </div>

            {/* Statutory Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDecision('CLARIFICATION_REQUIRED')}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Clarification</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleDecision('REJECTED')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('APPROVED')}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Mutate Record</span>
                </button>
              </div>
            </div>
          </div>

          {/* Audit Timeline of this Application */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Immutable Application Audit Log</span>
            </h3>

            <div className="space-y-2">
              {app.auditTrail?.map((trail, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-slate-100 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{trail.action.replace('_', ' ')}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(trail.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{trail.details}</p>
                    <span className="text-[10px] text-slate-400">Actor: {trail.actor} ({trail.actorRole})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
