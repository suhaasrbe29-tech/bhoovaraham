import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import courtCasesData from '../data/courtCases.json';
import { estimateCourtResolution } from '../utils/courtEstimator';
import Badge from '../components/Badge';
import AlertBanner from '../components/AlertBanner';
import { 
  FileText, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  Building, 
  CreditCard, 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Printer, 
  Share2, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2,
  TreePine,
  Zap,
  Droplets,
  Building2,
  ExternalLink,
  Scale,
  Gavel,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';

export default function Parcel360() {
  const { ulpin } = useParams();
  const navigate = useNavigate();
  const { parcels: parcelsData } = useData();

  // Find parcel by ULPIN from URL parameter, or fallback to first parcel
  const currentParcel = parcelsData.find(p => p.ulpin === ulpin) || parcelsData[1] || parcelsData[0];
  const [activeTab, setActiveTab] = useState('identity');

  const isAlert = currentParcel.ai_alert && currentParcel.ai_alert.has_alert;

  // Filter court cases for the current parcel
  const parcelCases = courtCasesData.parcelCases?.filter(c => c.ulpin === currentParcel.ulpin) || [];
  const activeCases = parcelCases.filter(c => c.current_status !== 'Disposed' && c.current_status !== 'Closed');
  const disposedCases = parcelCases.filter(c => c.current_status === 'Disposed' || c.current_status === 'Closed');
  const hasHighRisk = parcelCases.some(c => c.priority === 'High' && c.current_status !== 'Disposed');
  const hasMediumRisk = parcelCases.some(c => c.priority === 'Medium' && c.current_status !== 'Disposed');
  const highestRisk = hasHighRisk ? 'HIGH' : (hasMediumRisk ? 'MEDIUM' : (parcelCases.length > 0 ? 'LOW' : 'CLEAR'));

  // Expandable accordion state for court cases
  const [expandedCaseId, setExpandedCaseId] = useState(parcelCases[0]?.id || null);

  useEffect(() => {
    // When switching parcels, reset expanded case to first available
    setExpandedCaseId(parcelCases[0]?.id || null);
  }, [currentParcel.ulpin]);

  const toggleCaseAccordion = (caseId) => {
    setExpandedCaseId(prev => (prev === caseId ? null : caseId));
  };

  const tabs = [
    { id: 'identity', label: '1. Land Identity', icon: MapPin },
    { id: 'ror', label: '2. Record of Rights (RoR)', icon: User },
    { id: 'registration', label: '3. Registration & Deed', icon: FileText },
    { id: 'zoning', label: '4. Zoning & Building Permits', icon: Building },
    { id: 'fiscal', label: '5. Encumbrance & Property Tax', icon: CreditCard },
    { id: 'environment', label: '6. Environmental & Utilities', icon: TreePine },
    { id: 'ai_verification', label: '7. AI Monitoring & Verification', icon: Activity, badge: isAlert ? 'Alert' : null },
    { id: 'court_cases', label: '8. Legal & Court Cases', icon: Scale, badge: activeCases.length > 0 ? `${activeCases.length} Active` : null },
    { id: 'audit', label: '9. Immutable Audit Timeline', icon: Clock }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Sample Parcel Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/explorer"
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Back to Land Explorer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                PARCEL 360° DOSSIER
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-300">
                OFFICIAL RECORD DOSSIER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              {currentParcel.ulpin}
            </h1>
          </div>
        </div>

        {/* Quick Parcel Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Switch Parcel:</label>
          <select
            value={currentParcel.ulpin}
            onChange={(e) => navigate(`/parcel/${e.target.value}`)}
            className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          >
            {parcelsData.map((p) => (
              <option key={p.ulpin} value={p.ulpin}>
                {p.survey_number} - {p.land_use} ({p.ai_alert?.has_alert ? '⚠️ AI Alert' : 'Clear'})
              </option>
            ))}
          </select>
          <Link
            to={`/citizen/transfer?ulpin=${currentParcel.ulpin}`}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors"
          >
            <span>Apply Transfer</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs hidden sm:flex items-center gap-1"
            title="Print Record"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Governance Principle Banner */}
      <AlertBanner compact={true} />

      {/* Hero Overview Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="navy">Survey No. {currentParcel.survey_number}</Badge>
              <Badge variant="primary">{currentParcel.land_use}</Badge>
              {isAlert ? (
                <Badge variant="alert">⚠️ Possible Change Flagged</Badge>
              ) : (
                <Badge variant="success">✓ Verified Clean Title</Badge>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentParcel.village} Revenue Circle, {currentParcel.mandal} Taluk
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>District: {currentParcel.district}, {currentParcel.state} • Khata: {currentParcel.khata_number}</span>
            </p>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 space-y-1">
            <span className="text-xs text-slate-500 block">Total Parcel Extent</span>
            <span className="text-2xl font-black text-slate-900">{currentParcel.area_acres} Acres</span>
            <span className="text-xs text-slate-500 block font-mono">({currentParcel.area_sq_m?.toLocaleString()} sq.meters)</span>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 space-y-1">
            <span className="text-xs text-slate-500 block">Assessed Valuation</span>
            <span className="text-xl font-bold text-blue-900 font-mono">
              {currentParcel.market_valuation_inr}
            </span>
            <span className="text-xs text-slate-500 block">Guidance: {currentParcel.guidance_value_inr}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 text-[9px] bg-rose-500 text-white font-bold rounded">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 min-h-[420px]">
        {/* TAB 1: LAND IDENTITY */}
        {activeTab === 'identity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 1: Cadastral Land Identity & Geometry
              </h3>
              <Badge variant="navy">ULPIN SPEC v2.4</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">Spatial Anchor</span>
                <div>
                  <span className="text-slate-500 block">Unique Land Parcel Identifier (ULPIN):</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{currentParcel.ulpin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Survey & Sub-Division Number:</span>
                  <span className="font-bold text-slate-900">{currentParcel.survey_number} (Sub-div: {currentParcel.sub_division})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Revenue Khata Number:</span>
                  <span className="font-mono font-semibold text-slate-900">{currentParcel.khata_number}</span>
                </div>
              </div>

              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">Administrative Hierarchy</span>
                <div>
                  <span className="text-slate-500 block">Revenue Village:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.village}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Taluk / Mandal:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.mandal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">District & State:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.district}, {currentParcel.state}</span>
                </div>
              </div>

              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">Physical Extent & Use</span>
                <div>
                  <span className="text-slate-500 block">Total Area (Acres & Guntas):</span>
                  <span className="font-bold text-slate-900">{currentParcel.area_acres} Acres</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Metric Area (Square Meters):</span>
                  <span className="font-mono font-semibold text-slate-900">{currentParcel.area_sq_m?.toLocaleString()} sq.m</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Classification:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.land_use} ({currentParcel.current_crop})</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <Link to="/explorer" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>View Parcel Boundary on Interactive GIS Explorer →</span>
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: RECORD OF RIGHTS (RoR) */}
        {activeTab === 'ror' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 2: Record of Rights, Tenancy & Crops (RoR / Jamabandi)
              </h3>
              <Badge variant="success">Verified Against State Revenue DB</Badge>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Registered Title Holders</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Owner Name</th>
                      <th className="p-3">Father / Spouse Relation</th>
                      <th className="p-3">Ownership Share</th>
                      <th className="p-3">Extent (Acres)</th>
                      <th className="p-3">e-KYC Hash (Synthetic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentParcel.ror?.owners?.map((owner, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-900">{owner.name}</td>
                        <td className="p-3 text-slate-600">{owner.relation}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">{owner.share_percent}%</td>
                        <td className="p-3 font-mono">{owner.extent_acres}</td>
                        <td className="p-3 font-mono text-slate-500">{owner.aadhaar_hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Tenancy Classification:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.ror?.tenancy_type}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Last Mutation Order:</span>
                  <span className="font-mono font-semibold text-slate-900">{currentParcel.ror?.mutation_number}</span>
                  <span className="text-slate-500 text-[10px] block">Certified on {currentParcel.ror?.mutation_date}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-500 block">Litigation / Dispute Status:</span>
                    <span className="font-semibold text-slate-900">{currentParcel.ror?.dispute_status}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('court_cases')}
                    className="mt-2 text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start group"
                  >
                    <Scale className="w-3 h-3 text-blue-600" />
                    <span className="underline decoration-dotted group-hover:decoration-solid">
                      View Court Cases ({parcelCases.length} on record) →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRATION & DEED */}
        {activeTab === 'registration' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 3: Sub-Registrar Office (SRO) Deed Registration
              </h3>
              <Badge variant="primary">{currentParcel.registration?.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">Deed Metadata</span>
                <div>
                  <span className="text-slate-500 block">Registered Deed Number:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {currentParcel.registration?.registered_deed_no}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Deed Nature:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.registration?.deed_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Registration Execution Date:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.registration?.registration_date}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">Registration Authority & Duty</span>
                <div>
                  <span className="text-slate-500 block">Jurisdictional Office:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.registration?.sub_registrar_office}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stamp Duty & Registration Fee Paid:</span>
                  <span className="font-mono font-bold text-slate-900">{currentParcel.registration?.stamp_duty_paid}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Digital Verification Hash:</span>
                  <span className="font-mono text-[11px] text-slate-500">SHA256: 4f89a712...99b2 (Mock Stamp Integrity)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ZONING & BUILDING PERMITS */}
        {activeTab === 'zoning' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 4: Master Plan Zoning & Building Permissions
              </h3>
              <Badge variant="navy">Town Planning Authority</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Zoning Rules */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">Master Plan Zoning</span>
                  <Badge variant="primary">{currentParcel.zoning?.masterplan_zone}</Badge>
                </div>
                <div>
                  <span className="text-slate-500 block">Permitted Land Uses:</span>
                  <p className="text-slate-900 font-medium leading-relaxed">{currentParcel.zoning?.permitted_uses}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Max Permissible FSI:</span>
                    <span className="font-bold text-slate-900 font-mono">{currentParcel.zoning?.max_fsi}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mandatory Setback:</span>
                    <span className="font-bold text-slate-900 font-mono">{currentParcel.zoning?.setback_front_m} meters</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 block">Conversion Regulatory Status:</span>
                  <span className="text-slate-800 text-[11px]">{currentParcel.zoning?.conversion_eligibility}</span>
                </div>
              </div>

              {/* Building Permissions */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">Municipal Building Permit</span>
                  <Badge variant={currentParcel.building_permission?.has_permission ? 'success' : 'warning'}>
                    {currentParcel.building_permission?.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500 block">Sanction Permit Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{currentParcel.building_permission?.permit_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Approved Nature & Floors:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.building_permission?.approved_floors}</span>
                  <span className="text-slate-600 block text-[11px] mt-0.5">{currentParcel.building_permission?.approved_use}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Sanction Validity:</span>
                  <span className="text-slate-800">{currentParcel.building_permission?.validity_expiry}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FISCAL & ENCUMBRANCES */}
        {activeTab === 'fiscal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 5: Encumbrances (Mortgages / Liens) & Property Tax
              </h3>
              <Badge variant="navy">Fiscal Convergence</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Encumbrance & Bank Liens */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">Encumbrance Status</span>
                  <Badge variant={currentParcel.encumbrance?.is_encumbered ? 'danger' : 'success'}>
                    {currentParcel.encumbrance?.is_encumbered ? 'Encumbered' : 'Clean Title (NEC)'}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500 block">Charge Description:</span>
                  <p className="font-semibold text-slate-900">{currentParcel.encumbrance?.status}</p>
                </div>
                {currentParcel.encumbrance?.is_encumbered && (
                  <div className="p-3 bg-rose-50 rounded border border-rose-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-rose-900 font-medium">Mortgagee Bank:</span>
                      <span className="font-bold text-rose-950">{currentParcel.encumbrance.bank_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-rose-900 font-medium">Lien Amount:</span>
                      <span className="font-bold text-rose-950 font-mono">{currentParcel.encumbrance.loan_amount}</span>
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block">Search Period Verified:</span>
                  <span className="text-slate-700 font-mono">{currentParcel.encumbrance?.last_search_period}</span>
                </div>
              </div>

              {/* Property Tax */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">Property Tax (ULB / Panchayat)</span>
                  <Badge variant={currentParcel.property_tax?.status?.includes('Paid') ? 'success' : 'neutral'}>
                    {currentParcel.property_tax?.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">Assessment Number:</span>
                    <span className="font-mono font-bold text-slate-900">{currentParcel.property_tax?.assessment_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Financial Year:</span>
                    <span className="font-semibold text-slate-900">{currentParcel.property_tax?.financial_year}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Annual Demand / Paid:</span>
                  <span className="font-bold font-mono text-slate-900">{currentParcel.property_tax?.amount_paid}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span>Receipt Ref: </span>
                  <span className="font-mono text-slate-800">{currentParcel.property_tax?.receipt_number || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ENVIRONMENTAL & UTILITIES */}
        {activeTab === 'environment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 6: Environmental Restrictions & Utility Feeds
              </h3>
              <Badge variant="navy">Eco-Spatial Overlay</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Environmental Constraints */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[10px]">Environmental Zone</span>
                  <Badge variant={currentParcel.environmental_restrictions?.is_sensitive ? 'danger' : 'success'}>
                    {currentParcel.environmental_restrictions?.is_sensitive ? 'Eco-Sensitive Buffer' : 'Standard Zone'}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500 block">Buffer Zone Rule:</span>
                  <span className="font-semibold text-slate-900">{currentParcel.environmental_restrictions?.buffer_zone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Water Body Proximity:</span>
                  <span className="font-medium text-slate-800">{currentParcel.environmental_restrictions?.water_body_proximity}</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-slate-200 text-[11px]">
                  <span className="text-slate-500 block">Compliance Assessment:</span>
                  <span className="font-bold text-slate-900">{currentParcel.environmental_restrictions?.status}</span>
                </div>
              </div>

              {/* Utilities */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-slate-500 uppercase font-semibold text-[10px] block">Public Utility Infrastructure</span>
                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Power Connection:</span>
                    <span className="font-medium text-slate-900">{currentParcel.utilities?.electricity_connection}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Water Source:</span>
                    <span className="font-medium text-slate-900">{currentParcel.utilities?.water_source}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block">Sewerage Network:</span>
                    <span className="font-medium text-slate-900">{currentParcel.utilities?.sewerage_network}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI MONITORING & FIELD VERIFICATION */}
        {activeTab === 'ai_verification' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 7: AI Land Change Detection & Verification Workflow
              </h3>
              <Badge variant={isAlert ? 'alert' : 'success'}>
                {isAlert ? 'Possible Change Detected' : 'Clear / No Anomaly'}
              </Badge>
            </div>

            {/* Crucial Banner */}
            <AlertBanner />

            {isAlert ? (
              <div className="p-5 rounded-lg bg-rose-50 border border-rose-200 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-200 px-2 py-0.5 rounded">
                      Alert ID: {currentParcel.ai_alert.alert_id}
                    </span>
                    <h4 className="text-base font-bold text-rose-950 mt-1">
                      {currentParcel.ai_alert.alert_type}: {currentParcel.ai_alert.detail}
                    </h4>
                    <p className="text-xs text-rose-800 mt-1">
                      Automated optical confidence score: <strong>{(currentParcel.ai_alert.confidence_score * 100).toFixed(0)}%</strong> • Flagged on {currentParcel.ai_alert.detected_date}
                    </p>
                  </div>
                  <Link
                    to="/change-detection"
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Open Satellite Visualizer</span>
                  </Link>
                </div>

                <div className="p-3 bg-white/80 rounded border border-rose-200 text-xs text-slate-800 leading-relaxed">
                  <strong className="text-rose-950">Current Governance Workflow Stage:</strong>
                  <div className="mt-2 flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded font-bold">1. AI Detected ✓</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded font-bold animate-pulse">2. Assigned to Field Surveyor (In Progress)</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded">3. Authority Action Pending</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to="/field-verification"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Open Field Surveyor Inspection Record</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">No Active Spatial Anomaly Detected</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Multi-temporal satellite optical and spectral comparison indicates that current ground conditions conform to registered parcel boundaries and sanctioned permits.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: LEGAL & COURT CASES */}
        {activeTab === 'court_cases' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Section 8: Judicial & Revenue Court Litigations (Case Ledger)
                  </h3>
                  <Badge variant="navy">DPI NJDG Convergence</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Spatial intersection linking active civil suits, stays, and disposals anchored on ULPIN: <span className="font-mono font-semibold text-slate-700">{currentParcel.ulpin}</span>
                </p>
              </div>

              <div>
                {activeCases.length > 0 ? (
                  <Badge variant="danger" size="md">
                    ⚠️ {activeCases.length} Active Dispute{activeCases.length > 1 ? 's' : ''} Pending
                  </Badge>
                ) : (
                  <Badge variant="success" size="md">
                    ✓ Clear Title / Zero Active Litigations
                  </Badge>
                )}
              </div>
            </div>

            {/* Prototype Notice */}
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-950">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Synthetic Judicial DPI Prototype:</span> Simulated integration between State Land Records (Bhoomi / RoR) and National Judicial Data Grid (NJDG). Case records and resolution timelines are for demonstration purposes.
              </div>
            </div>

            {/* Summary Metrics Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-600" />
                  Total Cases
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">{parcelCases.length}</span>
                <span className="text-[10px] text-slate-500 block">Associated with this ULPIN</span>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-[11px] font-semibold text-amber-800 uppercase block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Active / Under Hearing
                </span>
                <span className="text-2xl font-black text-amber-950 font-mono">{activeCases.length}</span>
                <span className="text-[10px] text-amber-800 block">Requires legal caution</span>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Disposed / Resolved
                </span>
                <span className="text-2xl font-black text-emerald-950 font-mono">{disposedCases.length}</span>
                <span className="text-[10px] text-emerald-800 block">Final orders on record</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                  Highest Risk Level
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-black tracking-tight ${
                    highestRisk === 'HIGH' ? 'text-rose-700' :
                    highestRisk === 'MEDIUM' ? 'text-amber-700' :
                    highestRisk === 'LOW' ? 'text-blue-700' : 'text-emerald-700'
                  }`}>
                    {highestRisk}
                  </span>
                  {highestRisk === 'HIGH' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block">Judicial exposure rating</span>
              </div>
            </div>

            {/* If 0 Cases: Reassuring Clean State */}
            {parcelCases.length === 0 && (
              <div className="p-8 text-center rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    No Court Cases or Adverse Claims Found
                  </h4>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Judicial and Revenue registry cross-referencing indicates zero active injunctions, pending partition suits, lis pendens, or land acquisition appeals recorded for ULPIN <strong className="font-mono text-slate-800">{currentParcel.ulpin}</strong>.
                  </p>
                </div>
                <div className="inline-flex items-center gap-4 text-xs font-medium text-emerald-800 pt-2 border-t border-slate-200 flex-wrap justify-center">
                  <span>✓ Clean Title in Jamabandi</span>
                  <span>•</span>
                  <span>✓ Free of Injunctions</span>
                  <span>•</span>
                  <span>✓ Certified by SRO Rampur</span>
                </div>
              </div>
            )}

            {/* If Cases Exist: Render Expandable Accordions */}
            {parcelCases.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Linked Court Case Dockets ({parcelCases.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Click any case to expand/collapse full evidentiary details & AI analytics
                  </span>
                </div>

                <div className="space-y-3">
                  {parcelCases.map((caseItem) => {
                    const isExpanded = expandedCaseId === caseItem.id;
                    const isActiveCase = caseItem.current_status !== 'Disposed' && caseItem.current_status !== 'Closed';
                    
                    // Compute indicative estimate using utility
                    const estimate = estimateCourtResolution(
                      caseItem.case_type,
                      currentParcel.area_acres,
                      courtCasesData.historicalCases
                    );

                    return (
                      <div
                        key={caseItem.id}
                        className={`rounded-lg border transition-all duration-200 ${
                          isExpanded
                            ? 'border-blue-300 bg-white shadow-md'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Accordion Header / Click Target */}
                        <div
                          onClick={() => toggleCaseAccordion(caseItem.id)}
                          className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg mt-0.5 ${
                              isActiveCase ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              <Gavel className="w-4 h-4" />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm text-slate-900">
                                  {caseItem.case_number}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-xs font-semibold text-slate-700">
                                  {caseItem.case_type}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  Docket #{caseItem.id}
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-slate-800">{caseItem.court_name}</span>
                                <span>•</span>
                                <span>Filed: <strong className="text-slate-700">{caseItem.filing_date}</strong></span>
                                <span>•</span>
                                <span>Duration: <strong className="text-slate-700">{caseItem.duration_so_far_months} Months so far</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Status Badge */}
                            <Badge
                              variant={
                                caseItem.current_status === 'Under Hearing' ? 'warning' :
                                caseItem.current_status === 'Pending' ? 'primary' :
                                caseItem.current_status === 'Stayed' ? 'danger' :
                                caseItem.current_status === 'Disposed' ? 'success' : 'neutral'
                              }
                            >
                              {caseItem.current_status}
                            </Badge>

                            {/* Risk Badge */}
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                              caseItem.priority === 'High' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                              caseItem.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {caseItem.priority} Risk
                            </span>

                            <div className="p-1 rounded text-slate-400 hover:text-slate-700 ml-1">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-600" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Accordion Body Details */}
                        {isExpanded && (
                          <div className="px-4 pb-5 pt-2 border-t border-slate-100 space-y-5 text-xs">
                            {/* Parties and Stage Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                  Litigating Parties
                                </span>
                                <div>
                                  <span className="text-slate-500 text-[11px] block">Petitioner / Plaintiff:</span>
                                  <span className="font-semibold text-slate-900">{caseItem.parties?.petitioner}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[11px] block">Respondent / Defendant:</span>
                                  <span className="font-semibold text-slate-900">{caseItem.parties?.respondent}</span>
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                  Procedural Stage & Scope
                                </span>
                                <div>
                                  <span className="text-slate-500 text-[11px] block">Current Stage of Proceedings:</span>
                                  <span className="font-semibold text-blue-900">{caseItem.current_stage}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[11px] block">Affected Land Extent:</span>
                                  <span className="font-semibold text-slate-900">{caseItem.affected_extent}</span>
                                </div>
                              </div>
                            </div>

                            {/* Hearing Dates & Orders */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                                <span className="text-slate-500 text-[11px] block">Last Hearing:</span>
                                <span className="font-semibold text-slate-800 font-mono">{caseItem.last_hearing_date}</span>
                              </div>
                              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                                <span className="text-slate-500 text-[11px] block">Next Hearing Date:</span>
                                <span className="font-semibold text-slate-900 font-mono">
                                  {caseItem.next_hearing_date || 'N/A (Disposed)'}
                                </span>
                              </div>
                              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                                <span className="text-slate-500 text-[11px] block">Interim Orders / Injunctions:</span>
                                <span className="font-medium text-slate-800 text-[11px]">
                                  {caseItem.interim_orders || 'None on record'}
                                </span>
                              </div>
                            </div>

                            {/* Case Description */}
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                Dispute Description & Cause of Action
                              </span>
                              <p className="text-slate-800 leading-relaxed">
                                {caseItem.case_description}
                              </p>
                            </div>

                            {/* If Disposed: Show Disposition Summary */}
                            {caseItem.disposition_summary && (
                              <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1">
                                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Final Disposition Summary</span>
                                </div>
                                <p className="text-emerald-950 font-medium">
                                  {caseItem.disposition_summary}
                                </p>
                              </div>
                            )}

                            {/* AI / Analytics Indicative Resolution Card (Shown for Active Cases) */}
                            {isActiveCase && (
                              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200 shadow-sm space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-blue-600 text-white">
                                      <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-bold text-slate-900 text-xs tracking-wide">
                                      Estimated Average Resolution Time (Indicative Analytics)
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-slate-500">Confidence:</span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                      estimate.confidence === 'High' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                      estimate.confidence === 'Moderate' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                      'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}>
                                      {estimate.confidence}
                                    </span>
                                  </div>
                                </div>

                                {/* Core Estimate Display */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                  <div className="space-y-1">
                                    <span className="text-[11px] text-slate-600 font-medium block">
                                      Indicative Expected Timeline:
                                    </span>
                                    <div className="text-2xl font-black text-blue-950 font-mono">
                                      ~{estimate.estimatedMonths} Months
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium">
                                      Expected Range: <strong className="text-slate-900 font-mono">{estimate.rangeMin} – {estimate.rangeMax} Months</strong>
                                    </div>
                                  </div>

                                  <div className="p-3 bg-white/90 rounded-md border border-blue-100 text-[11px] space-y-1.5 shadow-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Elapsed so far:</span>
                                      <span className="font-bold font-mono text-slate-900">{caseItem.duration_so_far_months} Months</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Historical benchmark average:</span>
                                      <span className="font-mono text-slate-800">{estimate.historicalAverage} Months</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Precedent cases evaluated:</span>
                                      <span className="font-mono font-semibold text-blue-700">{estimate.sampleSize} Similar Disposed Cases</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-100 pt-1">
                                      <span className="text-slate-500">Parcel size adjustment ({currentParcel.area_acres} ac):</span>
                                      <span className="font-mono text-slate-800">
                                        {estimate.sizeAdjustmentPercent >= 0 ? `+${estimate.sizeAdjustmentPercent}%` : `${estimate.sizeAdjustmentPercent}%`}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Transparent Explanation Text */}
                                <p className="text-[11px] text-slate-600 leading-relaxed bg-white/60 p-2.5 rounded border border-blue-100">
                                  Based on <strong className="text-slate-800">{estimate.sampleSize} historical cases</strong> of similar type ({estimate.caseTypeUsed}) with bounded adjustment for parcel extent (<strong className="text-slate-800">{currentParcel.area_acres} Acres</strong> vs 2.0 Acre median holding).
                                </p>

                                {/* Strict Disclaimer Notice */}
                                <div className="flex items-start gap-2 text-[10px] text-slate-500 pt-1 border-t border-blue-200/50">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <span className="font-medium">
                                    <strong>AI/Analytics-based indicative estimate — not a legal prediction.</strong> Duration subject to roster scheduling, witness attendance, commissioner delays, and judicial orders.
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: IMMUTABLE AUDIT TIMELINE */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Section 9: Immutable Parcel Audit Trail
              </h3>
              <Badge variant="navy">Tamper-Evident Ledger</Badge>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentParcel.audit_trail?.map((entry, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100"></div>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-slate-800">{entry.actor}</span>
                      <span className="font-mono text-[11px]">{entry.date}</span>
                    </div>
                    <div className="font-bold font-mono text-blue-700 text-[11px]">{entry.action}</div>
                    <p className="text-slate-700 mt-1 leading-relaxed">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
