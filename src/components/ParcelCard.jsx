import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  MapPin, 
  Building, 
  CreditCard, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Badge from './Badge';

export default function ParcelCard({ parcel, onClose }) {
  if (!parcel) return null;

  const isAlert = parcel.ai_alert && parcel.ai_alert.has_alert;

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-right duration-200">
      {/* Header with ULPIN & Close Button */}
      <div className="bg-slate-900 text-white p-4 flex items-start justify-between border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-blue-600 rounded text-white uppercase">
              ULPIN
            </span>
            <span className="font-mono text-sm font-semibold tracking-wide text-amber-300">
              {parcel.ulpin}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Survey No. <strong className="text-white">{parcel.survey_number}</strong> ({parcel.village}, {parcel.mandal}, {parcel.district})
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* AI Alert Alert Banner (if applicable) */}
      {isAlert && (
        <div className="bg-rose-50 border-b border-rose-200 p-3 text-xs text-rose-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0 animate-bounce" />
          <div>
            <span className="font-bold text-rose-950 uppercase tracking-wide text-[10px] bg-rose-200 px-1.5 py-0.5 rounded mr-1">
              AI Alert
            </span>
            <strong className="text-rose-950">Possible change detected:</strong> {parcel.ai_alert.detail || 'Spatial variance identified'}
            <p className="text-[11px] text-rose-700 mt-1 italic">
              Principle: AI Detects → Human Verifies → Authority Acts. Under ground review.
            </p>
          </div>
        </div>
      )}

      {/* Scrollable Attributes Body */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs">
        {/* Core Land Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
          <div>
            <span className="text-slate-500 text-[11px] block">Total Extent</span>
            <span className="font-bold text-slate-800 text-sm">{parcel.area_acres} Acres</span>
            <span className="text-[10px] text-slate-500 block">({parcel.area_sq_m?.toLocaleString()} sq.m)</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Land Classification</span>
            <span className="font-bold text-slate-800 text-sm">{parcel.land_use}</span>
            <span className="text-[10px] text-slate-500 block">{parcel.current_crop || 'Plotted / Built'}</span>
          </div>
        </div>

        {/* Status Indicators Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Record of Rights (RoR):</span>
            <Badge variant={parcel.ror?.status?.includes('Verified') ? 'success' : 'warning'}>
              {parcel.ror?.status || 'Active'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Primary Owner:</span>
            <span className="font-semibold text-slate-900 text-right max-w-[180px] truncate">
              {parcel.ror?.owners?.[0]?.name || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Zoning Master Plan:</span>
            <span className="text-slate-800 font-medium text-right max-w-[200px] truncate">
              {parcel.zoning?.masterplan_zone || 'Rural Area'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Registration Deed:</span>
            <Badge variant="primary">
              {parcel.registration?.registered_deed_no || 'Recorded'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Property Tax Status:</span>
            <Badge variant={parcel.property_tax?.status?.includes('Paid') ? 'success' : 'warning'}>
              {parcel.property_tax?.status || 'Assessed'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Encumbrance Status:</span>
            <Badge variant={parcel.encumbrance?.is_encumbered ? 'danger' : 'success'}>
              {parcel.encumbrance?.is_encumbered ? 'Mortgage Registered' : 'Clean / Free of Liens'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-600 font-medium">AI Alert Status:</span>
            <Badge variant={isAlert ? 'alert' : 'success'}>
              {isAlert ? 'Possible Change Flagged' : 'Clear / No Anomaly'}
            </Badge>
          </div>
        </div>

        {/* Guidance Valuation */}
        <div className="p-2.5 rounded bg-blue-50/60 border border-blue-100 flex items-center justify-between">
          <span className="text-blue-900 font-medium text-xs">Estimated Market Value:</span>
          <span className="font-bold text-blue-950 font-mono text-sm">
            {parcel.market_valuation_inr || 'Government Property'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 mt-auto flex items-center gap-2">
        <Link
          to={`/parcel/${parcel.ulpin}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow transition-colors"
        >
          <span>View Full Parcel 360° Dossier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        {isAlert && (
          <Link
            to="/change-detection"
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-xs flex items-center gap-1 shadow transition-colors"
            title="Inspect Satellite Variance"
          >
            <span>Inspect AI</span>
          </Link>
        )}
      </div>
    </div>
  );
}
