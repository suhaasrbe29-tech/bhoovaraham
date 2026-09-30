import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  FileCheck2, 
  MapPin, 
  User, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Download,
  Info,
  Calendar,
  CreditCard
} from 'lucide-react';
import Badge from '../../components/Badge';

export default function TransferRequest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { parcels, submitTransferApplication } = useData();

  const ulpinParam = searchParams.get('ulpin');

  // Step state (1: Select Parcel, 2: Applicant & Transfer Info, 3: Documents, 4: Success)
  const [step, setStep] = useState(1);

  // Selected parcel
  const [selectedUlpin, setSelectedUlpin] = useState(ulpinParam || parcels[0]?.ulpin || '');
  const selectedParcel = parcels.find(p => p.ulpin === selectedUlpin) || parcels[0];

  // Form State
  const [formData, setFormData] = useState({
    applicantName: 'Aarav Kulkarni',
    applicantRelation: 'S/o Vittal Rao Kulkarni',
    applicantAadhaar: 'XXXX-XXXX-4521',
    applicantEmail: 'aarav.kulkarni@example.com',
    applicantPhone: '+91 98450 12345',
    applicantAddress: '#42, Temple Road, Ward 3, Rampur, Ballari - 583101',
    applicantType: 'BUYER',
    transferType: 'Sale Deed',
    considerationAmountINR: '₹ 48,00,000',
    guidanceValueINR: '₹ 44,10,000',
    stampDutyPaidINR: '₹ 2,64,000',
    registrationFeePaidINR: '₹ 48,000',
    challanNumber: 'KRN-E-CHALLAN-2026-90412',
    reason: 'Outright agricultural land purchase under Karnataka Land Revenue Act Section 95.'
  });

  // Simulated Document Files
  const [documents, setDocuments] = useState([
    { id: 'DOC-01', name: 'Registered Sale Deed (Draft)', fileName: 'SaleDeed_Draft_2026.pdf', size: '3.4 MB', attached: true },
    { id: 'DOC-02', name: 'Current Record of Rights (Pahani/RTC)', fileName: 'RTC_Current_KT4081.pdf', size: '1.2 MB', attached: true },
    { id: 'DOC-03', name: 'Non-Encumbrance Certificate (NEC)', fileName: 'EC_Search_30Years.pdf', size: '2.8 MB', attached: true },
    { id: 'DOC-04', name: 'Buyer & Seller Identity Proofs (Masked Aadhaar)', fileName: 'Aadhaar_KMS_Masked.pdf', size: '950 KB', attached: true },
    { id: 'DOC-05', name: 'Gram Panchayat Property Tax Clearance Receipt', fileName: 'TaxReceipt_FY2025_26.pdf', size: '680 KB', attached: true }
  ]);

  // Submission result
  const [submittedApp, setSubmittedApp] = useState(null);

  useEffect(() => {
    if (ulpinParam) {
      setSelectedUlpin(ulpinParam);
    }
  }, [ulpinParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedParcel) return;

    // Build submission payload
    const submissionPayload = {
      ulpin: selectedParcel.ulpin,
      surveyNumber: selectedParcel.survey_number,
      village: selectedParcel.village,
      mandal: selectedParcel.mandal,
      district: selectedParcel.district,
      state: selectedParcel.state,
      areaAcres: selectedParcel.area_acres,
      currentOwner: selectedParcel.ror?.owners?.[0] || { name: 'Current Registered Owner' },
      ...formData,
      documents: documents.map((doc, idx) => ({
        id: `DOC-0${idx + 1}`,
        name: doc.name,
        fileType: 'PDF',
        fileSize: doc.size,
        docNumber: `REG-${doc.id}-${Math.floor(1000 + Math.random() * 9000)}`,
        uploadedAt: new Date().toISOString(),
        isVerified: false,
        verifiedBy: null,
        verifiedAt: null,
        remarks: null
      }))
    };

    const created = submitTransferApplication(submissionPayload);
    setSubmittedApp(created);
    setStep(4); // Move to success step
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/citizen"
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                CITIZEN STATUTORY SERVICES
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                APPLICATION WIZARD
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Application for Ownership Transfer & Mutation
            </h1>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline">
          Form 14-A (Sec 128 KLR Act)
        </span>
      </div>

      {/* Stepper Progress Bar */}
      {step < 4 && (
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-lg text-xs font-medium text-center">
          <div className={`py-1.5 rounded ${step === 1 ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600'}`}>
            1. Select Parcel
          </div>
          <div className={`py-1.5 rounded ${step === 2 ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600'}`}>
            2. Applicant & Deed Info
          </div>
          <div className={`py-1.5 rounded ${step === 3 ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600'}`}>
            3. Documents & Submit
          </div>
        </div>
      )}

      {/* STEP 1: Select & Verify Parcel */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Step 1: Verify Land Parcel (Anchor: ULPIN / Survey Number)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select or confirm the land parcel for which the ownership transfer is being registered.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Choose Target Land Parcel:
              </label>
              <select
                value={selectedUlpin}
                onChange={(e) => setSelectedUlpin(e.target.value)}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 shadow-sm"
              >
                {parcels.map(p => (
                  <option key={p.ulpin} value={p.ulpin}>
                    {p.ulpin} — Survey No. {p.survey_number} ({p.land_use}, {p.area_acres} Acres, Owner: {p.ror?.owners?.[0]?.name})
                  </option>
                ))}
              </select>
            </div>

            {selectedParcel && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Parcel Verification Card
                  </span>
                  <Badge variant="primary">ULPIN: {selectedParcel.ulpin}</Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Survey Number</span>
                    <strong className="text-slate-900 font-mono">{selectedParcel.survey_number}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Area</span>
                    <strong className="text-slate-900 font-mono">{selectedParcel.area_acres} Acres</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Current Registered Owner</span>
                    <strong className="text-slate-900">{selectedParcel.ror?.owners?.[0]?.name || 'Registered Holder'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Village & Mandal</span>
                    <strong className="text-slate-900">{selectedParcel.village}, {selectedParcel.mandal}</strong>
                  </div>
                </div>

                {/* Pre-check encumbrance / litigation warning */}
                {selectedParcel.encumbrance?.is_encumbered && (
                  <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      <strong>Notice:</strong> This parcel has an active bank lien ({selectedParcel.encumbrance.bank_name}). 
                      You must provide a Bank NOC during document submission.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition-colors"
            >
              <span>Continue to Applicant Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Applicant & Transfer Details */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Step 2: Applicant, Transferee & Deed Specifications
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Provide legal details of the transferee / purchaser and the executed deed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Applicant / Buyer Full Name *</label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Father / Spouse Name *</label>
              <input
                type="text"
                name="applicantRelation"
                value={formData.applicantRelation}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Aadhaar (Synthetic / Masked) *</label>
              <input
                type="text"
                name="applicantAadhaar"
                value={formData.applicantAadhaar}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact Mobile Number *</label>
              <input
                type="text"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Transfer Deed Type *</label>
              <select
                name="transferType"
                value={formData.transferType}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded bg-white"
              >
                <option value="Sale Deed">Registered Sale Deed (Conveyance)</option>
                <option value="Gift Deed">Gift Deed (Danapathra)</option>
                <option value="Partition Deed">Family Partition / Settlement</option>
                <option value="Succession / Inheritance">Testamentary Succession (Varasdar)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sale Consideration Value (INR) *</label>
              <input
                type="text"
                name="considerationAmountINR"
                value={formData.considerationAmountINR}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded font-mono font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Treasury Challan / E-Stamp Reference *</label>
              <input
                type="text"
                name="challanNumber"
                value={formData.challanNumber}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded font-mono"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Residential Postal Address</label>
              <input
                type="text"
                name="applicantAddress"
                value={formData.applicantAddress}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Purpose / Brief Ground of Transfer</label>
              <textarea
                name="reason"
                rows={2}
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition-colors"
            >
              <span>Proceed to Document Uploads</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Documents & Submit */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Step 3: Upload Mandatory Legal Documentation
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Attach authenticated digital copies of the transfer deed and supporting certificates.
            </p>
          </div>

          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">{doc.name}</strong>
                    <span className="text-slate-500 text-[11px] font-mono">
                      {doc.fileName} • {doc.size}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Attached</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Declaration */}
          <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Statutory Legal Declaration</span>
            </div>
            <p className="leading-relaxed">
              I hereby declare that the particulars provided above are authentic and substantiated by 
              registered instruments. I understand that submitting this application creates an official 
              statutory queue item for verification by the Sub-Registrar and Revenue Department. 
              <strong>Official land records will only be updated after statutory verification and approval.</strong>
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Submit Transfer Application</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && submittedApp && (
        <div className="bg-white rounded-xl border border-emerald-300 p-8 text-center space-y-6 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Application Lodged Successfully
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Ownership Transfer Request Registered
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Your application has been assigned a unique tracking reference number and routed 
              to the designated statutory authority for document verification.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">Application ID:</span>
              <strong className="text-blue-700 text-base font-black">{submittedApp.applicationId}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Target Parcel (ULPIN):</span>
              <strong className="text-slate-900">{submittedApp.ulpin}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Survey Number:</span>
              <strong className="text-slate-900">{submittedApp.surveyNumber} ({submittedApp.village})</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Assigned Authority:</span>
              <strong className="text-slate-900">{submittedApp.assignedOffice}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Status:</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold font-sans">
                {submittedApp.status}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/citizen/track?id=${submittedApp.applicationId}`}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
              <span>Track Application Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Download Acknowledgment Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
