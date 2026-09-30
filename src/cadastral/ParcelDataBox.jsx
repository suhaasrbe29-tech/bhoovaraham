import React from 'react';
import { 
  Building2, 
  Ruler, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Compass, 
  X, 
  Activity, 
  Sparkles, 
  Navigation 
} from 'lucide-react';

/**
 * Module 11: ParcelDataBox
 * 
 * Interactive data box displaying the complete cadastral dossier for a selected parcel.
 */
export default function ParcelDataBox({ parcel, onClose }) {
  if (!parcel) return null;

  const p = parcel.properties || parcel;
  const buildings = p.enclosed_buildings || [];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-300 shadow-2xl p-4 text-xs font-sans max-h-[85vh] overflow-y-auto space-y-3 pointer-events-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-600 text-white uppercase tracking-wider">
              {p.parcel_id || p.id}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              {p.confidence}% Confidence
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-1">
            {p.title || `Candidate Parcel ${p.parcel_id || p.id}`}
          </h3>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Classification: <strong className="text-slate-700">{p.land_type || 'Residential'}</strong>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
          title="Close Data Box"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Spatial Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Calculated Area</span>
          <strong className="text-slate-900 text-sm">{p.area_sqm} m²</strong>
          <span className="text-slate-500 block text-[10px]">({p.area_sqyds} sq.yds)</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Road Proximity</span>
          <strong className="text-emerald-700 text-sm">
            {p.road_adjacent ? 'Yes (Adjacent)' : 'Interior Holding'}
          </strong>
          <span className="text-slate-500 block text-[10px]">
            Setback: {p.road_clearance_m || 3.5}m Corridor
          </span>
        </div>
      </div>

      {/* Enclosed Structural Footprints */}
      <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-2.5 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-orange-900 font-semibold text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-orange-700" />
            <span>Enclosed Structures ({p.building_count || buildings.length})</span>
          </span>
        </div>

        {buildings.length > 0 ? (
          <div className="space-y-1.5 pt-0.5">
            {buildings.map((b, idx) => (
              <div key={b.building_id || idx} className="bg-white/90 p-2 rounded border border-orange-200 text-slate-800">
                <div className="font-semibold text-xs text-slate-900">{b.name}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5 flex-wrap">
                  <span>Plinth: <strong>{b.area || b.plinth_sq_m} m²</strong></span>
                  <span>•</span>
                  <span>Storeys: <strong>{b.storeys}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-indigo-700 font-medium">
                    <Compass className="w-3 h-3" />
                    <span>{b.orientation || 0}° Orientation</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 italic text-[10px] py-1">
            Zero enclosed structures (Open space / vacant plotted site holding).
          </div>
        )}
      </div>

      {/* Boundary Evidence */}
      <div className="space-y-1.5 text-[11px]">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Boundary Evidence Segments
        </span>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1 text-slate-700">
          <div><strong className="text-slate-900">North:</strong> {p.boundary_evidence?.north || 'Road Edge'}</div>
          <div><strong className="text-slate-900">South:</strong> {p.boundary_evidence?.south || 'Service Lane Margin'}</div>
          <div><strong className="text-slate-900">East:</strong> {p.boundary_evidence?.east || 'Partition Boundary'}</div>
          <div><strong className="text-slate-900">West:</strong> {p.boundary_evidence?.west || 'Demarcation Evidence'}</div>
        </div>
      </div>

      {/* Technical Provenance & Disclaimer */}
      <div className="bg-slate-100 p-2 rounded-lg text-[10px] text-slate-600 space-y-1 border border-slate-200 font-mono">
        <div className="flex justify-between">
          <span>Source:</span>
          <strong className="text-slate-800">{p.source_type || 'AI_IMAGE_DERIVED'}</strong>
        </div>
        <div className="flex justify-between">
          <span>Verification:</span>
          <strong className="text-amber-700">{p.verification_status || 'SIMULATED'}</strong>
        </div>
        <div className="text-[9px] text-slate-500 italic pt-1 border-t border-slate-200 font-sans">
          Provisional boundary reconstructed from physical optical features. Demonstration/reference data; not legally authoritative.
        </div>
      </div>
    </div>
  );
}
