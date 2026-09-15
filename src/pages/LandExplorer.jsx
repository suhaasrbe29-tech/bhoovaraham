import React, { useState } from 'react';
import MapViewer from '../components/MapViewer';
import ParcelCard from '../components/ParcelCard';
import AlertBanner from '../components/AlertBanner';
import parcelsData from '../data/parcels.json';
import { Layers, MapPin, AlertTriangle, CheckCircle, Search, Info } from 'lucide-react';

export default function LandExplorer() {
  // Default to the lake buffer parcel (IN29-0412-0018-7711) so user immediately sees rich data and AI alert
  const [selectedParcel, setSelectedParcel] = useState(
    parcelsData.find(p => p.survey_number === '18/3') || parcelsData[0]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      {/* Top Context Subheader */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-20 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm">Land Explorer GIS Workspace</span>
            <span className="text-slate-500 hidden sm:inline ml-2">
              Cadastral Map: Varaha Nagar Village (Circle 04, Rampur Taluk, Ballari)
            </span>
          </div>
        </div>

        {/* Quick Legend & Status Summary */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-slate-600 text-xs">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Verified: 1,348
            </span>
            <span className="flex items-center gap-1 font-medium text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
              AI Alerts: 3
            </span>
          </div>

          <div className="text-[11px] bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200 font-medium">
            Active Spatial Layer • 8 Cadastral Sectors
          </div>
        </div>
      </div>

      {/* Main Map & Inspector Split Layout */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Full-bleed Leaflet Map Component */}
        <div className="flex-1 h-full w-full">
          <MapViewer
            selectedParcel={selectedParcel}
            onSelectParcel={(parcel) => setSelectedParcel(parcel)}
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
            <span>Click any parcel on the map to inspect its ULPIN and 18-point dossier</span>
          </div>
        )}
      </div>
    </div>
  );
}
