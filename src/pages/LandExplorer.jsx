import React, { useState } from 'react';
import MapViewer from '../components/MapViewer';
import ParcelCard from '../components/ParcelCard';
import { useData } from '../context/DataContext';
import { LOCATIONS } from '../data/cadastralGeoJSON';
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ShieldCheck, 
  Sparkles,
  Building2
} from 'lucide-react';

export default function LandExplorer() {
  const { parcels: parcelsData } = useData();
  
  // Default to HMT Nagar Colony, Nacharam, Hyderabad (Real Cadastral Data & Case Study)
  const [activeLocation, setActiveLocation] = useState(LOCATIONS.HMT_NAGAR);

  // Default to Plot 12 (IN36-5840-0072-0012) in HMT Nagar
  const [selectedParcel, setSelectedParcel] = useState(() => {
    return parcelsData.find(p => p.ulpin === 'IN36-5840-0072-0012') || parcelsData[0];
  });

  const handleLocationChange = (loc) => {
    setActiveLocation(loc);
    if (loc.id === 'hmt_nagar') {
      const hmtMatch = parcelsData.find(p => p.ulpin === 'IN36-5840-0072-0012');
      if (hmtMatch) setSelectedParcel(hmtMatch);
    } else if (loc.id === 'varaha_nagar') {
      const varahaMatch = parcelsData.find(p => p.survey_number === '18/3');
      if (varahaMatch) setSelectedParcel(varahaMatch);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      {/* Top Context Subheader */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Land Explorer GIS Workspace</span>
              {activeLocation.isCaseStudy ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  NON-ENCROACHED CASE STUDY
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  AI ANOMALY DEMO
                </span>
              )}
            </div>
            <span className="text-slate-500 hidden sm:inline text-xs mt-0.5">
              Cadastral Map: <strong className="text-slate-700">{activeLocation.name}</strong> ({activeLocation.subtext})
            </span>
          </div>
        </div>

        {/* Location Switcher & Metrics Summary */}
        <div className="flex items-center gap-2.5">
          {/* Quick Header Location Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => handleLocationChange(LOCATIONS.HMT_NAGAR)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeLocation.id === 'hmt_nagar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Hyderabad (HMT Nagar)</span>
            </button>
            <button
              onClick={() => handleLocationChange(LOCATIONS.VARAHA_NAGAR)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeLocation.id === 'varaha_nagar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-700'
              }`}
            >
              <span>Ballari (Varaha Nagar)</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-600 text-xs pl-2 border-l border-slate-200">
            {activeLocation.id === 'hmt_nagar' ? (
              <>
                <span className="flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  100% Boundary Compliant
                </span>
                <span className="text-[11px] bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200 font-medium">
                  14 AI Reconstructed Parcels • 2D Cadastre Active
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Verified: 1,348
                </span>
                <span className="flex items-center gap-1 font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span>
                  AI Lake Alert
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Map & Inspector Split Layout */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Full-bleed Leaflet Map Component with 2D GIS, Satellite, Terrain & Google Places Search */}
        <div className="flex-1 h-full w-full">
          <MapViewer
            selectedParcel={selectedParcel}
            onSelectParcel={(parcel) => setSelectedParcel(parcel)}
            activeLocation={activeLocation}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Side Inspector Drawer (Desktop Floating or Right Column) */}
        {selectedParcel && (
          <div className="absolute top-4 right-4 bottom-4 w-96 max-w-[calc(100%-2rem)] z-[400] flex flex-col pointer-events-auto">
            <ParcelCard
              parcel={selectedParcel}
              onClose={() => setSelectedParcel(null)}
            />
          </div>
        )}

        {/* Helper Hint when no parcel is selected */}
        {!selectedParcel && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 pointer-events-none">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Click any parcel or building footprint on the map to inspect its dossier</span>
          </div>
        )}
      </div>
    </div>
  );
}
