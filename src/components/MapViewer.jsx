import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  Marker, 
  Popup, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { cadastralGeoJSON, MAP_CENTER, MAP_DEFAULT_ZOOM } from '../data/cadastralGeoJSON';
import parcelsData from '../data/parcels.json';
import { Layers, Search, Eye, Filter, AlertTriangle, Info } from 'lucide-react';

// Fix Leaflet Default Marker Icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pulsing alert icon for AI anomalies
const alertIcon = L.divIcon({
  className: 'custom-alert-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 28px; height: 28px; background-color: rgba(239, 68, 68, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 14px; height: 14px; background-color: #dc2626; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

// Helper component to center map dynamically when a parcel is searched/selected
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 17, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapViewer({ selectedParcel, onSelectParcel }) {
  const [activeBaseLayer, setActiveBaseLayer] = useState('osm'); // 'osm' | 'satellite'
  const [showCadastral, setShowCadastral] = useState(true);
  const [showZoning, setShowZoning] = useState(true);
  const [showAiAlerts, setShowAiAlerts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [flyToCoords, setFlyToCoords] = useState(null);

  // Land use color palette based on standard Indian Master Plan GIS guidelines
  const getStyleForLandUse = (feature, isSelected) => {
    const landUse = feature.properties.land_use;
    const hasAlert = feature.properties.has_ai_alert;

    let fillColor = '#94a3b8'; // default slate
    let fillOpacity = 0.55;
    let strokeColor = '#334155';
    let weight = 1.5;
    let dashArray = null;

    switch (landUse) {
      case 'Agricultural':
        fillColor = '#86efac'; // soft green
        strokeColor = '#166534';
        break;
      case 'Residential':
        fillColor = '#fde047'; // soft yellow
        strokeColor = '#a16207';
        break;
      case 'Commercial':
        fillColor = '#93c5fd'; // soft blue
        strokeColor = '#1d4ed8';
        break;
      case 'Water Body Buffer':
        fillColor = '#67e8f9'; // cyan
        strokeColor = '#0e7490';
        dashArray = '4, 4';
        break;
      case 'Government / Public':
        fillColor = '#c4b5fd'; // purple
        strokeColor = '#5b21b6';
        break;
      case 'Agro-Forestry':
        fillColor = '#a7f3d0'; // emerald
        strokeColor = '#047857';
        break;
      default:
        fillColor = '#e2e8f0';
    }

    if (hasAlert && showAiAlerts) {
      strokeColor = '#dc2626'; // bold red alert boundary
      weight = 2.5;
    }

    if (isSelected) {
      strokeColor = '#2563eb'; // vibrant primary blue highlight
      weight = 4;
      fillOpacity = 0.75;
    }

    return {
      fillColor,
      fillOpacity: showCadastral ? fillOpacity : 0.05,
      color: strokeColor,
      weight,
      dashArray
    };
  };

  // Feature interactions (hover & click)
  const onEachFeature = (feature, layer) => {
    const props = feature.properties;

    layer.on({
      click: () => {
        // Find comprehensive parcel details from json
        const match = parcelsData.find(p => p.ulpin === props.ulpin);
        onSelectParcel(match || {
          ulpin: props.ulpin,
          survey_number: props.survey_no,
          village: 'Varaha Nagar',
          mandal: 'Rampur',
          district: 'Ballari',
          area_acres: props.area_acres,
          land_use: props.land_use,
          encumbrance: { status: props.encumbrance_status }
        });
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ fillOpacity: 0.85, weight: 3 });
      },
      mouseout: (e) => {
        const l = e.target;
        const isSelected = selectedParcel && selectedParcel.ulpin === props.ulpin;
        l.setStyle(getStyleForLandUse(feature, isSelected));
      }
    });

    // Tooltip with ULPIN & Survey No
    layer.bindTooltip(
      `<div class="text-xs font-sans">
        <strong class="text-slate-900 block font-mono">${props.ulpin}</strong>
        <span class="text-slate-600">Survey No. ${props.survey_no}</span><br/>
        <span class="inline-block mt-0.5 px-1 py-0.2 bg-slate-100 rounded text-[10px] text-slate-800 font-semibold">${props.land_use}</span>
        ${props.has_ai_alert ? '<div class="text-[10px] text-red-600 font-bold mt-1">⚠️ Possible Change Flagged</div>' : ''}
      </div>`,
      { sticky: true, className: 'leaflet-custom-tooltip' }
    );
  };

  // Search handler (Search by ULPIN or Survey No)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = parcelsData.find(
      p => p.ulpin.toLowerCase().includes(query) || p.survey_number.toLowerCase().includes(query)
    );

    if (found) {
      onSelectParcel(found);
      // Center based on matching GeoJSON feature
      const featureMatch = cadastralGeoJSON.features.find(f => f.properties.ulpin === found.ulpin);
      if (featureMatch && featureMatch.geometry.coordinates[0]?.[0]) {
        const [lng, lat] = featureMatch.geometry.coordinates[0][0];
        setFlyToCoords([lat, lng]);
      }
    } else {
      alert(`No parcel found matching "${searchQuery}". Try "14/1A", "18/3", or "IN29-0412-0018-7711"`);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col bg-slate-100 rounded-lg overflow-hidden border border-slate-300 shadow-sm">
      {/* Search Bar & Layer Controls Floating Bar */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl w-[calc(100%-2rem)]">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex-1 flex shadow-md rounded-md overflow-hidden">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search ULPIN or Survey No (e.g. 18/3, 14/1A)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors"
          >
            Locate
          </button>
        </form>

        {/* Quick Demo Filter Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-300 shadow-md overflow-x-auto text-xs">
          <button
            onClick={() => {
              const lakeParcel = parcelsData.find(p => p.survey_number === '18/3');
              onSelectParcel(lakeParcel);
              setFlyToCoords([15.1395, 76.9280]);
            }}
            className="px-2 py-1 text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 whitespace-nowrap flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Lake Buffer (AI Alert)</span>
          </button>
          <button
            onClick={() => {
              const agriParcel = parcelsData.find(p => p.survey_number === '14/1A');
              onSelectParcel(agriParcel);
              setFlyToCoords([15.1395, 76.9215]);
            }}
            className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 rounded whitespace-nowrap"
          >
            Agri 14/1A
          </button>
        </div>
      </div>

      {/* Layer Switcher Floating Panel (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-md p-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 pb-1.5 border-b border-slate-200">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Layers</span>
        </div>
        <div className="mt-2 space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer hover:text-blue-700">
            <input
              type="checkbox"
              checked={showCadastral}
              onChange={(e) => setShowCadastral(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Cadastral Parcels</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-blue-700">
            <input
              type="checkbox"
              checked={showAiAlerts}
              onChange={(e) => setShowAiAlerts(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
            />
            <span className="text-rose-700 font-medium">AI Alert Flags</span>
          </label>
          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Basemap:</span>
            <button
              onClick={() => setActiveBaseLayer(activeBaseLayer === 'osm' ? 'satellite' : 'osm')}
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-700"
            >
              {activeBaseLayer === 'osm' ? 'Switch Satellite' : 'Switch OSM'}
            </button>
          </div>
        </div>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-[400] bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-md p-2.5 text-xs max-w-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 pb-1 border-b border-slate-200 mb-1.5">
          <Info className="w-3 h-3 text-slate-500" />
          <span>Cadastral Classification</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#86efac] border border-[#166534] inline-block"></span>
            <span>Agricultural</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#fde047] border border-[#a16207] inline-block"></span>
            <span>Residential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#93c5fd] border border-[#1d4ed8] inline-block"></span>
            <span>Commercial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#67e8f9] border border-[#0e7490] inline-block"></span>
            <span>Lake / Buffer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#c4b5fd] border border-[#5b21b6] inline-block"></span>
            <span>Government</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <span>AI Alert Flag</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full flex-1"
      >
        {flyToCoords && <MapRecenter center={flyToCoords} />}

        {/* Dynamic Basemap */}
        {activeBaseLayer === 'osm' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Vector Cadastral Polygons */}
        {showCadastral && (
          <GeoJSON
            key={`cadastral-${selectedParcel ? selectedParcel.ulpin : 'none'}-${showAiAlerts}`}
            data={cadastralGeoJSON}
            style={(feature) => {
              const isSelected = selectedParcel && selectedParcel.ulpin === feature.properties.ulpin;
              return getStyleForLandUse(feature, isSelected);
            }}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Pulsing AI Alert Marker over Anomaly Parcel (Survey 18/3 Lake Buffer) */}
        {showAiAlerts && (
          <Marker position={[15.1395, 76.9280]} icon={alertIcon}>
            <Popup>
              <div className="p-1 text-xs">
                <strong className="text-red-700 font-bold block">⚠️ Possible Change Detected</strong>
                <span className="text-slate-800 font-medium">Parcel ULPIN: IN29-0412-0018-7711</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Optical footprint flagged within 30m lake buffer. Assigned for field verification.
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
