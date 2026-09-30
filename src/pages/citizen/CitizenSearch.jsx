import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import MapViewer from '../../components/MapViewer';
import Badge from '../../components/Badge';
import courtCasesData from '../../data/courtCases.json';
import { 
  Search, 
  MapPin, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  CreditCard, 
  Building, 
  FileText, 
  Scale, 
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function CitizenSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { parcels } = useData();

  const ulpinParam = searchParams.get('ulpin');
  const queryParam = searchParams.get('q');

  const [searchInput, setSearchInput] = useState(ulpinParam || queryParam || '');
  
  // Find selected parcel or default to first
  const initialParcel = parcels.find(p => 
    p.ulpin === ulpinParam || 
    p.survey_number.toLowerCase() === (queryParam || '').toLowerCase()
  ) || parcels[0];

  const [selectedParcel, setSelectedParcel] = useState(initialParcel);

  useEffect(() => {
    if (ulpinParam) {
      const match = parcels.find(p => p.ulpin === ulpinParam);
      if (match) setSelectedParcel(match);
    }
  }, [ulpinParam, parcels]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim().toLowerCase();
    const match = parcels.find(p => 
      p.ulpin.toLowerCase() === clean || 
      p.survey_number.toLowerCase() === clean
    );
    if (match) {
      setSelectedParcel(match);
      navigate(`/citizen/search?ulpin=${match.ulpin}`);
    } else {
      alert(`No parcel found matching "${searchInput}". Please check the ULPIN or Survey Number.`);
    }
  };

  // Find court cases for this parcel
  const parcelCases = (courtCasesData.parcelCases || []).filter(c => c.ulpin === selectedParcel?.ulpin);
  const activeCases = parcelCases.filter(c => c.current_status !== 'Disposed' && c.current_status !== 'Closed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CITIZEN PUBLIC REGISTRY
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded border border-blue-200">
              VERIFIED CADASTRAL RECORD
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Land Record & Cadastral GIS Lookup
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Publicly viewable ownership, spatial boundary, land-use zoning, and encumbrance information.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Enter ULPIN or Survey No..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono w-64 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Parcel Selection Switcher Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-medium">Quick Select Parcel:</span>
        {parcels.map(p => (
          <button
            key={p.ulpin}
            onClick={() => {
              setSelectedParcel(p);
              setSearchInput(p.ulpin);
              navigate(`/citizen/search?ulpin=${p.ulpin}`);
            }}
            className={`px-3 py-1 rounded-md font-mono text-xs transition-colors border ${
              selectedParcel?.ulpin === p.ulpin
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Survey {p.survey_number} ({p.land_use})
          </button>
        ))}
      </div>

      {/* Main Content Layout: GIS Map + Parcel Public Dossier */}
      {selectedParcel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: GIS Map Viewer (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[480px]">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold">Cadastral Boundary Map</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Survey: {selectedParcel.survey_number}
                </span>
              </div>
              <div className="flex-1 relative">
                <MapViewer
                  selectedParcel={selectedParcel}
                  onSelectParcel={(p) => setSelectedParcel(p)}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-200 flex items-center justify-between">
              <span>Interactive Leaflet Map with Cadastral Vector Overlay</span>
              <Link
                to="/explorer"
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Full Screen Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: Public Record Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Main Parcel Identity Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Top Title & Transfer CTA Button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                      ULPIN (Bhu-Aadhaar)
                    </span>
                    <span className="font-mono text-sm font-black text-slate-900">
                      {selectedParcel.ulpin}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    Survey Number {selectedParcel.survey_number} ({selectedParcel.village})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mandal: {selectedParcel.mandal} • District: {selectedParcel.district} • Karnataka
                  </p>
                </div>

                <Link
                  to={`/citizen/transfer?ulpin=${selectedParcel.ulpin}`}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-colors flex-shrink-0"
                >
                  <span>Apply for Ownership Transfer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 4 Key Public Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Total Area</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {selectedParcel.area_acres} Acres
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ({selectedParcel.area_sq_m?.toLocaleString()} m²)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Land Use</span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedParcel.land_use}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {selectedParcel.current_crop || 'Plotted'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Guidance Valuation</span>
                  <span className="text-xs font-bold text-blue-900 font-mono">
                    {selectedParcel.market_valuation_inr || 'Assessed'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Govt Tariff</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Khata Number</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {selectedParcel.khata_number || 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Revenue Circle</span>
                </div>
              </div>

              {/* Public Ownership / Record of Rights (RoR) */}
              <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Current Record Holder (Record of Rights)
                    </h3>
                  </div>
                  <Badge variant={selectedParcel.ror?.status?.includes('Verified') ? 'success' : 'warning'}>
                    {selectedParcel.ror?.status || 'Active'}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  {selectedParcel.ror?.owners?.map((owner, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/80">
                      <div>
                        <strong className="text-slate-900 text-sm">{owner.name}</strong>
                        <span className="text-slate-500 text-xs block">{owner.relation}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800 font-mono">{owner.extent_acres} Acres</span>
                        <span className="text-[10px] text-slate-500 block">Share: {owner.share_percent}%</span>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                    <div>
                      <span>Mutation Order: </span>
                      <strong className="text-slate-800 font-mono">{selectedParcel.ror?.mutation_number || 'MR-REG'}</strong>
                    </div>
                    <div>
                      <span>Mutation Date: </span>
                      <strong className="text-slate-800">{selectedParcel.ror?.mutation_date || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Encumbrance, Zoning & Court Case Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Encumbrance Check */}
                <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <CreditCard className="w-4 h-4 text-slate-600" />
                      <span>Encumbrance Status</span>
                    </div>
                    <Badge variant={selectedParcel.encumbrance?.is_encumbered ? 'danger' : 'success'}>
                      {selectedParcel.encumbrance?.is_encumbered ? 'Encumbered' : 'Clean Title'}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {selectedParcel.encumbrance?.status || 'No charges registered.'}
                  </p>
                  {selectedParcel.encumbrance?.bank_name !== 'None' && (
                    <div className="text-[11px] text-rose-800 font-medium">
                      Lien Holder: {selectedParcel.encumbrance?.bank_name}
                    </div>
                  )}
                </div>

                {/* Court Case Status */}
                <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Scale className="w-4 h-4 text-slate-600" />
                      <span>Litigation Status</span>
                    </div>
                    <Badge variant={activeCases.length > 0 ? 'danger' : 'success'}>
                      {activeCases.length > 0 ? `${activeCases.length} Active Cases` : 'No Litigation'}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {activeCases.length > 0
                      ? `${activeCases[0].case_number} (${activeCases[0].court_name})`
                      : 'No active civil or injunction suits flagged against this parcel.'}
                  </p>
                  {activeCases.length > 0 && activeCases[0].interim_orders && (
                    <div className="text-[11px] text-rose-700 font-medium">
                      Order: {activeCases[0].interim_orders}
                    </div>
                  )}
                </div>

                {/* Zoning & Master Plan */}
                <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Building className="w-4 h-4 text-slate-600" />
                    <span>Zoning & Master Plan</span>
                  </div>
                  <p className="text-slate-700 text-[11px] font-medium">
                    {selectedParcel.zoning?.masterplan_zone}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Permitted: {selectedParcel.zoning?.permitted_uses}
                  </p>
                </div>

                {/* Registration Deed */}
                <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>Registration Details</span>
                  </div>
                  <p className="text-slate-800 font-mono text-[11px]">
                    Deed No: {selectedParcel.registration?.registered_deed_no || 'Recorded'}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Office: {selectedParcel.registration?.sub_registrar_office} • Stamp Duty: {selectedParcel.registration?.stamp_duty_paid}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs">
                <Link
                  to={`/parcel/${selectedParcel.ulpin}`}
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View 18-Point Parcel 360° Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/citizen/transfer?ulpin=${selectedParcel.ulpin}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <span>Start Transfer Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
