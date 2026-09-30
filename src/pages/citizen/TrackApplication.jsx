import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Badge from '../../components/Badge';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  FileText, 
  User, 
  ArrowRight, 
  Download, 
  MessageSquare, 
  Upload, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function TrackApplication() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { applications, submitCitizenClarification } = useData();

  const idParam = searchParams.get('id');
  const [trackInput, setTrackInput] = useState(idParam || applications[0]?.applicationId || '');
  
  // Find current application
  const currentApp = applications.find(a => 
    a.applicationId.toLowerCase() === (idParam || trackInput).toLowerCase()
  ) || applications[0];

  // Clarification form state
  const [clarificationText, setClarificationText] = useState('');
  const [supplementDocName, setSupplementDocName] = useState('Bank_NOC_Discharge_Certificate.pdf');
  const [clarificationSuccess, setClarificationSuccess] = useState(false);

  useEffect(() => {
    if (idParam) {
      setTrackInput(idParam);
    }
  }, [idParam]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setSearchParams({ id: trackInput.trim() });
    setClarificationSuccess(false);
  };

  const handleClarificationSubmit = (e) => {
    e.preventDefault();
    if (!clarificationText.trim() || !currentApp) return;
    submitCitizenClarification(currentApp.applicationId, clarificationText.trim(), supplementDocName);
    setClarificationText('');
    setClarificationSuccess(true);
  };

  // Determine stepper state
  const getStepState = (stepNumber) => {
    if (!currentApp) return 'upcoming';
    const status = currentApp.status;

    if (stepNumber === 1) return 'completed'; // always submitted
    
    if (stepNumber === 2) {
      if (status === 'SUBMITTED') return 'active';
      return 'completed';
    }

    if (stepNumber === 3) {
      if (status === 'CLARIFICATION_REQUIRED') return 'warning';
      if (status === 'SUBMITTED') return 'upcoming';
      if (status === 'UNDER_VERIFICATION') return 'active';
      return 'completed';
    }

    if (stepNumber === 4) {
      if (status === 'APPROVED') return 'completed';
      if (status === 'REJECTED') return 'danger';
      return 'upcoming';
    }

    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CITIZEN TRANSPARENCY CONSOLE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
              REAL-TIME APPLICATION TRACKING
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Track Ownership Transfer & Mutation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Monitor scrutiny stages, view official remarks, and submit clarifications.
          </p>
        </div>

        {/* Search by Reference Number */}
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="e.g. TRF-2026-00124"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono w-56 shadow-sm uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {/* Quick Select Chip List of Sample Applications */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-medium">Quick Pick Application:</span>
        {applications.map(app => (
          <button
            key={app.applicationId}
            onClick={() => {
              setTrackInput(app.applicationId);
              setSearchParams({ id: app.applicationId });
              setClarificationSuccess(false);
            }}
            className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors border ${
              currentApp?.applicationId === app.applicationId
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {app.applicationId} ({app.status})
          </button>
        ))}
      </div>

      {/* Main Tracking Dossier */}
      {currentApp ? (
        <div className="space-y-6">
          {/* Top Status & Processing Office Banner */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                    APPLICATION ID
                  </span>
                  <span className="font-mono text-base font-black text-slate-900">
                    {currentApp.applicationId}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Parcel: Survey No. {currentApp.surveyNumber} ({currentApp.village}, {currentApp.mandal})
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  ULPIN: {currentApp.ulpin} • Extent: {currentApp.areaAcres} Acres
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  currentApp.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  currentApp.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  currentApp.status === 'CLARIFICATION_REQUIRED' ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
                  'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {currentApp.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Stepper Visualization */}
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {/* Step 1 */}
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto shadow">
                    ✓
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">1. Submitted</strong>
                    <span className="text-[10px] text-slate-500">
                      {new Date(currentApp.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto shadow ${
                    getStepState(2) === 'completed' ? 'bg-emerald-600 text-white' :
                    getStepState(2) === 'active' ? 'bg-blue-600 text-white animate-pulse' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    2
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">2. Scrutiny</strong>
                    <span className="text-[10px] text-slate-500">Sub-Registrar</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto shadow ${
                    getStepState(3) === 'warning' ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
                    getStepState(3) === 'completed' ? 'bg-emerald-600 text-white' :
                    getStepState(3) === 'active' ? 'bg-blue-600 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {getStepState(3) === 'warning' ? '!' : '3'}
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">3. Verification</strong>
                    <span className="text-[10px] text-slate-500">
                      {currentApp.status === 'CLARIFICATION_REQUIRED' ? 'Action Needed' : 'Documents & Liens'}
                    </span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto shadow ${
                    currentApp.status === 'APPROVED' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                    currentApp.status === 'REJECTED' ? 'bg-rose-600 text-white ring-4 ring-rose-100' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {currentApp.status === 'APPROVED' ? '✓' : currentApp.status === 'REJECTED' ? '✗' : '4'}
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">4. Decision</strong>
                    <span className="text-[10px] text-slate-500">
                      {currentApp.status === 'APPROVED' ? 'Mutation Recorded' :
                       currentApp.status === 'REJECTED' ? 'Rejected' : 'Awaiting Sign-off'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Authority Callout */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-700 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Processing Government Office:</span>
                  <strong className="text-slate-900 text-sm">{currentApp.assignedOffice}</strong>
                  <span className="text-slate-600 ml-2">
                    (Officer In-Charge: {currentApp.assignedOfficerName}, {currentApp.assignedOfficerRole})
                  </span>
                </div>
              </div>
              <span className="text-slate-500 text-[11px] font-mono">
                Updated: {new Date(currentApp.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Special Banner: APPROVED $\rightarrow$ Mutation Order Available! */}
          {currentApp.status === 'APPROVED' && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-6 shadow-sm space-y-4 text-emerald-950">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-black text-emerald-950">
                      Ownership Transfer Approved & Official Record Mutated
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      The Sub-Registrar has verified all deeds, cleared encumbrances, and executed the mutation. 
                      The official Record of Rights (Jamabandi/RoR) for <strong>ULPIN {currentApp.ulpin}</strong> has 
                      been officially transferred to <strong>{currentApp.applicant.fullName}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-colors flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Mutation Order</span>
                </button>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs font-medium border-t border-emerald-200">
                <Link
                  to={`/parcel/${currentApp.ulpin}`}
                  className="text-emerald-900 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Mutated Record in Parcel 360° Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <span>•</span>
                <Link
                  to={`/citizen/search?ulpin=${currentApp.ulpin}`}
                  className="text-emerald-900 font-bold hover:underline"
                >
                  Inspect Updated Public RoR
                </Link>
              </div>
            </div>
          )}

          {/* Special Banner: CLARIFICATION_REQUIRED $\rightarrow$ Officer Remarks & Citizen Reply Form */}
          {currentApp.status === 'CLARIFICATION_REQUIRED' && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6 shadow-sm space-y-4 text-amber-950">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-950">
                    Additional Clarification / Document Requested by Officer
                  </h3>
                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    "{currentApp.officerRemarks}"
                  </p>
                </div>
              </div>

              {/* Citizen Response Form */}
              <form onSubmit={handleClarificationSubmit} className="pt-2 border-t border-amber-200 space-y-3">
                <div className="text-xs font-bold text-amber-900">
                  Submit Citizen Clarification / Supplemental Document:
                </div>
                
                <textarea
                  rows={3}
                  placeholder="Provide explanation or details for the officer..."
                  value={clarificationText}
                  onChange={(e) => setClarificationText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-amber-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Simulated Upload:</span>
                    <input
                      type="text"
                      value={supplementDocName}
                      onChange={(e) => setSupplementDocName(e.target.value)}
                      className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono w-64"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Send Clarification to Officer</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {clarificationSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Clarification submitted! The status has resumed to "UNDER VERIFICATION" for officer review.</span>
            </div>
          )}

          {/* Special Banner: REJECTED $\rightarrow$ Statutory Reason */}
          {currentApp.status === 'REJECTED' && (
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-6 shadow-sm space-y-2 text-rose-950">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-black text-rose-950">
                    Application Rejected by Competent Authority
                  </h3>
                  <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                    "{currentApp.officerRemarks}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Two-Column Details: Transferee & Document Verification Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant & Transfer Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                <span>Application Particulars</span>
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Applicant / Buyer:</span>
                  <strong className="text-slate-900">{currentApp.applicant.fullName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Current Owner (Seller):</span>
                  <strong className="text-slate-900">{currentApp.currentOwner?.name}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transfer Type:</span>
                  <span className="font-medium text-slate-800">{currentApp.transferDetails?.transferType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Consideration Amount:</span>
                  <span className="font-bold text-slate-900 font-mono">{currentApp.transferDetails?.considerationAmountINR}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Challan Ref:</span>
                  <span className="font-mono text-slate-700">{currentApp.transferDetails?.challanNumber}</span>
                </div>
              </div>
            </div>

            {/* Submitted Documents Status Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Submitted Documents Verification</span>
              </h3>

              <div className="space-y-2">
                {currentApp.documents?.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <div>
                      <strong className="text-slate-900 block">{doc.name}</strong>
                      <span className="text-slate-500 text-[10px] font-mono">{doc.docNumber || doc.fileType}</span>
                    </div>

                    <Badge variant={doc.isVerified ? 'success' : 'neutral'}>
                      {doc.isVerified ? '✓ Officer Verified' : 'Pending Review'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit History of this Application */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Application Milestones & Officer Log</span>
            </h3>

            <div className="space-y-2">
              {currentApp.auditTrail?.map((trail, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-slate-100 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{trail.action.replace('_', ' ')}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(trail.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{trail.details}</p>
                    <span className="text-[10px] text-slate-400">By: {trail.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 italic bg-white rounded-xl border border-slate-200">
          No application found matching the reference ID.
        </div>
      )}
    </div>
  );
}
