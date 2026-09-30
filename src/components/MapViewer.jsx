import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  Marker, 
  Popup, 
  useMap,
  useMapEvents,
  Polyline
} from 'react-leaflet';
import L from 'leaflet';
import { 
  cadastralGeoJSON, 
  buildingFootprintsGeoJSON, 
  LOCATIONS, 
  MAP_CENTER, 
  MAP_DEFAULT_ZOOM 
} from '../data/cadastralGeoJSON';
import parcelsData from '../data/parcels.json';
import { CADASTRAL_CONFIG } from '../utils/cadastralConfig';
import { reconstructCadastralLayer } from '../cadastral/CadastralEngine';
import CadastralLayer from '../cadastral/CadastralLayer';
import ParcelDataBox from '../cadastral/ParcelDataBox';
import GooglePlacesSearch from './GooglePlacesSearch';
import { 
  Layers, 
  Compass, 
  Sparkles, 
  Ruler, 
  AlertCircle, 
  ZoomIn, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Box,
  Cpu
} from 'lucide-react';

// Fix Leaflet Default Marker Icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom search pin icon
const searchMarkerIcon = L.divIcon({
  className: 'custom-search-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; background-color: rgba(37, 99, 235, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 16px; height: 16px; background-color: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
        <div style="width: 5px; height: 5px; background-color: white; border-radius: 50%;"></div>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Helper component to center map dynamically when coordinates change
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 17, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Map Click Listener for Distance Measurement Tool
function MapMeasurementListener({ isMeasuring, onAddMeasurePoint }) {
  const map = useMap();
  useEffect(() => {
    if (!isMeasuring) return;
    const onClick = (e) => {
      onAddMeasurePoint([e.latlng.lat, e.latlng.lng]);
    };
    map.on('click', onClick);
    return () => map.off('click', onClick);
  }, [isMeasuring, map, onAddMeasurePoint]);
  return null;
}

// Dynamic Viewport & Zoom Level Watcher
function MapViewportWatcher({ onViewportChange }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      onViewportChange({
        zoom,
        bounds: {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth()
        }
      });
    },
    zoomend: () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      onViewportChange({
        zoom,
        bounds: {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth()
        }
      });
    }
  });

  useEffect(() => {
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    onViewportChange({
      zoom,
      bounds: {
        west: bounds.getWest(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        north: bounds.getNorth()
      }
    });
  }, [map, onViewportChange]);

  return null;
}

export default function MapViewer({ 
  selectedParcel, 
  onSelectParcel,
  activeLocation = LOCATIONS.HMT_NAGAR,
  onLocationChange 
}) {
  // Basemap state: 'osm' (Standard) | 'satellite' | 'terrain' | 'hybrid'
  const [activeBaseLayer, setActiveBaseLayer] = useState('satellite');
  
  // View mode: 'comparison' | 'ai_candidates' | 'official'
  const [viewMode, setViewMode] = useState('comparison'); 
  const [showCadastral, setShowCadastral] = useState(true);
  const [showAiCandidates, setShowAiCandidates] = useState(true);
  const [showBuildingFootprints, setShowBuildingFootprints] = useState(true);
  const [showRoadCorridors, setShowRoadCorridors] = useState(true);

  // Zoom & Viewport tracking
  const [currentZoom, setCurrentZoom] = useState(MAP_DEFAULT_ZOOM);
  const [currentBounds, setCurrentBounds] = useState(null);

  // Selected candidate parcel for ParcelDataBox
  const [selectedCadastralParcel, setSelectedCadastralParcel] = useState(null);

  // Search & Navigation state
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [flyToZoom, setFlyToZoom] = useState(17);
  const [searchPin, setSearchPin] = useState(null);
  const [areaNotice, setAreaNotice] = useState(null);

  // Measurement Tool state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measuredDistanceM, setMeasuredDistanceM] = useState(0);

  // Cadastral Reconstruction Engine State
  const [setbackDistance, setSetbackDistance] = useState(3.5);
  const [isReconstructing, setIsReconstructing] = useState(false);

  // Run the Cadastral Reconstruction Pipeline
  const [engineResult, setEngineResult] = useState(() => 
    reconstructCadastralLayer({
      areaId: activeLocation?.id || 'controlled_test_area',
      setbackDistance: 3.5,
      mergeSlivers: true
    })
  );

  // Update whenever active location or setback changes
  useEffect(() => {
    const res = reconstructCadastralLayer({
      areaId: activeLocation?.id || 'controlled_test_area',
      setbackDistance,
      mergeSlivers: true
    });
    setEngineResult(res);
  }, [activeLocation, setbackDistance]);

  const handleViewportChange = useCallback(({ zoom, bounds }) => {
    setCurrentZoom(zoom);
    setCurrentBounds(bounds);
  }, []);

  const handleTriggerReconstruction = () => {
    setIsReconstructing(true);
    setTimeout(() => {
      const res = reconstructCadastralLayer({
        areaId: activeLocation?.id || 'controlled_test_area',
        setbackDistance,
        mergeSlivers: true
      });
      setEngineResult(res);
      setIsReconstructing(false);
      setShowAiCandidates(true);
      if (viewMode === 'official') setViewMode('comparison');
    }, 800);
  };

  // Zoom-Dependent Cadastral Visibility Rules (Part 2, 16)
  const isCadastralVisible = currentZoom >= CADASTRAL_CONFIG.CADASTRAL_MIN_ZOOM;
  const isInteractionEnabled = currentZoom >= CADASTRAL_CONFIG.PARCEL_INTERACTION_ZOOM;

  // Search selection handler
  const handleSelectSearchLocation = (item) => {
    setFlyToCoords(item.coords);
    setFlyToZoom(item.zoom || 17);

    setSearchPin({
      coords: item.coords,
      title: item.title,
      subtitle: item.subtitle,
      badge: item.badge
    });

    if (item.ulpin) {
      const match = parcelsData.find(p => p.ulpin === item.ulpin);
      if (match) onSelectParcel(match);
    }

    if (item.locationId && onLocationChange) {
      if (item.locationId === 'hmt_nagar') onLocationChange(LOCATIONS.HMT_NAGAR);
      else if (item.locationId === 'varaha_nagar') onLocationChange(LOCATIONS.VARAHA_NAGAR);
    }
  };

  // Measurement Handlers
  const handleAddMeasurePoint = (coord) => {
    setMeasurePoints(prev => {
      const newPoints = [...prev, coord];
      if (newPoints.length >= 2) {
        let total = 0;
        for (let i = 0; i < newPoints.length - 1; i++) {
          const lat1 = newPoints[i][0];
          const lon1 = newPoints[i][1];
          const lat2 = newPoints[i + 1][0];
          const lon2 = newPoints[i + 1][1];
          const R = 6371e3;
          const φ1 = lat1 * Math.PI / 180;
          const φ2 = lat2 * Math.PI / 180;
          const Δφ = (lat2 - lat1) * Math.PI / 180;
          const Δλ = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          total += R * c;
        }
        setMeasuredDistanceM(Math.round(total * 10) / 10);
      }
      return newPoints;
    });
  };

  const handleToggleMeasure = () => {
    if (isMeasuring) {
      setIsMeasuring(false);
      setMeasurePoints([]);
      setMeasuredDistanceM(0);
    } else {
      setIsMeasuring(true);
      setMeasurePoints([]);
      setMeasuredDistanceM(0);
    }
  };

  const handleCompassReset = () => {
    if (activeLocation) {
      setFlyToCoords([...activeLocation.center]);
      setFlyToZoom(activeLocation.zoom);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[620px] flex flex-col bg-slate-900 rounded-lg overflow-hidden border border-slate-300 shadow-md">
      {/* Top Floating Controls: Search & Presets */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2 max-w-2xl w-[calc(100%-1.5rem)] pointer-events-auto">
        <GooglePlacesSearch
          onSelectLocation={handleSelectSearchLocation}
          parcelsData={parcelsData}
          activeLocation={activeLocation}
        />

        {/* Toolbar: Location Presets & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 shadow-md text-xs">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => {
                if (onLocationChange) onLocationChange(LOCATIONS.HMT_NAGAR);
                setFlyToCoords(LOCATIONS.HMT_NAGAR.center);
                setFlyToZoom(17);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                activeLocation?.id === 'hmt_nagar' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-700 hover:text-blue-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Controlled Test Area (HMT Nagar)</span>
            </button>
            <button
              onClick={() => {
                if (onLocationChange) onLocationChange(LOCATIONS.VARAHA_NAGAR);
                setFlyToCoords(LOCATIONS.VARAHA_NAGAR.center);
                setFlyToZoom(16);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                activeLocation?.id === 'varaha_nagar' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-700 hover:text-blue-700'
              }`}
            >
              <span>Varaha Nagar (Rural)</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5 hidden sm:block" />

          {/* 3-Way Mode Switcher: AI Candidates vs Official vs Comparison */}
          <div className="flex items-center bg-violet-50/80 p-0.5 rounded-md border border-violet-200">
            <button
              onClick={() => {
                setViewMode('comparison');
                setShowAiCandidates(true);
                setShowCadastral(true);
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                viewMode === 'comparison'
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'text-violet-900 hover:text-violet-700'
              }`}
            >
              Overlay Comparison
            </button>
            <button
              onClick={() => {
                setViewMode('ai_candidates');
                setShowAiCandidates(true);
                setShowCadastral(false);
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'ai_candidates'
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'text-violet-900 hover:text-violet-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Candidate Plots ({engineResult.geojson.features.length})</span>
            </button>
            <button
              onClick={() => {
                setViewMode('official');
                setShowCadastral(true);
                setShowAiCandidates(false);
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                viewMode === 'official'
                  ? 'bg-violet-700 text-white shadow-sm'
                  : 'text-violet-900 hover:text-violet-700'
              }`}
            >
              Official Survey
            </button>
          </div>
        </div>
      </div>

      {/* Top Right Floating Controls: Reconstruct Button & Basemap Switcher */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Re-Run Reconstruction Button */}
          <button
            onClick={handleTriggerReconstruction}
            disabled={isReconstructing}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
            title="Re-run physical feature parcel reconstruction"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconstructing ? 'animate-spin' : ''}`} />
            <span>{isReconstructing ? 'Partitioning...' : 'Re-Run Parcel Reconstruction'}</span>
          </button>

          {/* Precision Tools Toolbar: Measurement & Compass Reset */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-md p-1 flex items-center gap-1 text-xs">
            <button
              onClick={handleToggleMeasure}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                isMeasuring 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title={isMeasuring ? "Measuring active. Click to stop." : "Measure Boundary Distance"}
            >
              <Ruler className="w-3.5 h-3.5" />
              {isMeasuring && (
                <span className="font-mono text-[10px]">{measuredDistanceM}m</span>
              )}
            </button>

            <button
              onClick={handleCompassReset}
              className="p-1.5 rounded text-slate-700 hover:bg-slate-100 border-l border-slate-200 transition-transform"
              title="Reset View Orientation to North"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Basemap Switcher */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-md p-2.5 text-xs w-56">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Map & Layers (Zoom {currentZoom})</span>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Basemap</span>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveBaseLayer('osm')}
                className={`py-1 text-[10px] font-semibold rounded border text-center transition-colors ${
                  activeBaseLayer === 'osm' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Standard (2D)
              </button>
              <button
                onClick={() => setActiveBaseLayer('satellite')}
                className={`py-1 text-[10px] font-semibold rounded border text-center transition-colors ${
                  activeBaseLayer === 'satellite' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setActiveBaseLayer('terrain')}
                className={`py-1 text-[10px] font-semibold rounded border text-center transition-colors ${
                  activeBaseLayer === 'terrain' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Terrain
              </button>
              <button
                onClick={() => setActiveBaseLayer('hybrid')}
                className={`py-1 text-[10px] font-semibold rounded border text-center transition-colors ${
                  activeBaseLayer === 'hybrid' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Hybrid
              </button>
            </div>
          </div>

          {/* Layer Visibility Toggles */}
          <div className="mt-3 pt-2 border-t border-slate-200 space-y-1.5">
            <label className="flex items-center justify-between cursor-pointer hover:text-violet-800 py-0.5">
              <span className="flex items-center gap-1.5 font-bold text-violet-900">
                <span className="w-2.5 h-2.5 border-2 border-violet-600 border-dashed inline-block"></span>
                <span>AI Candidate Parcels</span>
              </span>
              <input
                type="checkbox"
                checked={showAiCandidates}
                onChange={(e) => setShowAiCandidates(e.target.checked)}
                className="rounded text-violet-600 focus:ring-violet-500 w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-slate-800 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 bg-slate-400 border border-slate-600 inline-block"></span>
                <span>Road Corridors</span>
              </span>
              <input
                type="checkbox"
                checked={showRoadCorridors}
                onChange={(e) => setShowRoadCorridors(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-orange-800 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 bg-orange-400 border border-orange-600 inline-block"></span>
                <span>Building Footprints</span>
              </span>
              <input
                type="checkbox"
                checked={showBuildingFootprints}
                onChange={(e) => setShowBuildingFootprints(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-blue-800 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 bg-yellow-400 border border-yellow-600 inline-block"></span>
                <span>Registered Cadastre</span>
              </span>
              <input
                type="checkbox"
                checked={showCadastral}
                onChange={(e) => setShowCadastral(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Floating ParcelDataBox when a candidate parcel is selected */}
      {selectedCadastralParcel && (
        <div className="absolute top-16 right-4 z-[450] w-96 max-w-[calc(100%-2rem)]">
          <ParcelDataBox
            parcel={selectedCadastralParcel}
            onClose={() => setSelectedCadastralParcel(null)}
          />
        </div>
      )}

      {/* Zoom-Dependent HUD banner when zoomed out */}
      {!isCadastralVisible && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[420] bg-slate-900/90 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md flex items-center gap-3 text-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-400" />
            <div>
              <span className="font-semibold text-slate-200">Overview Viewport (Zoom {currentZoom})</span>
              <span className="text-slate-400 block text-[11px]">
                Cadastral parcels activate automatically at Zoom {CADASTRAL_CONFIG.CADASTRAL_MIN_ZOOM}+
              </span>
            </div>
          </div>
          <button
            onClick={() => setFlyToZoom(16)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow flex items-center gap-1.5 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom to Cadastre (16)</span>
          </button>
        </div>
      )}

      {/* Map Canvas */}
      <div className="w-full h-full flex-1">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="w-full h-full flex-1"
        >
          {flyToCoords && <MapRecenter center={flyToCoords} zoom={flyToZoom} />}
          <MapViewportWatcher onViewportChange={handleViewportChange} />
          <MapMeasurementListener isMeasuring={isMeasuring} onAddMeasurePoint={handleAddMeasurePoint} />

          {/* Dynamic Basemap TileLayers */}
          {activeBaseLayer === 'osm' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {activeBaseLayer === 'satellite' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          )}

          {activeBaseLayer === 'terrain' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Esri World Topographic Map'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          )}

          {activeBaseLayer === 'hybrid' && (
            <>
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                attribution='&copy; Esri Reference Boundaries & Places'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </>
          )}

          {/* LAYER 1: OFFICIAL REGISTERED SURVEY */}
          {showCadastral && (viewMode === 'official' || viewMode === 'comparison') && (
            <GeoJSON
              key={`cadastral-official-${selectedParcel?.ulpin || 'none'}-${viewMode}`}
              data={cadastralGeoJSON}
              style={(feature) => ({
                fillColor: viewMode === 'comparison' ? '#94a3b8' : '#fde047',
                fillOpacity: viewMode === 'comparison' ? 0.10 : 0.60,
                color: viewMode === 'comparison' ? '#475569' : '#ca8a04',
                weight: 1.5,
                dashArray: viewMode === 'comparison' ? '3, 3' : undefined
              })}
              onEachFeature={(feature, layer) => {
                const p = feature.properties;
                layer.on({
                  click: () => {
                    const match = parcelsData.find(x => x.ulpin === p.ulpin) || p;
                    onSelectParcel(match);
                  }
                });
                layer.bindTooltip(`<strong>${p.plot_no || p.survey_no}</strong><br/>${p.owner_name}`, { sticky: true });
              }}
            />
          )}

          {/* LAYER 2: DETECTED ROAD CORRIDORS (NEGATIVE SPACE) */}
          {showRoadCorridors && (viewMode === 'ai_candidates' || viewMode === 'comparison') && (
            <GeoJSON
              key={`roads-${activeLocation?.id}`}
              data={{
                type: 'FeatureCollection',
                features: engineResult.roads.map(r => ({
                  type: 'Feature',
                  properties: { name: r.name, width_m: r.width_m },
                  geometry: r.corridorPolygon.geometry
                }))
              }}
              style={{
                fillColor: '#64748b',
                fillOpacity: 0.45,
                color: '#1e293b',
                weight: 1.5,
                dashArray: '3, 3'
              }}
              onEachFeature={(feature, layer) => {
                layer.bindTooltip(`<strong>${feature.properties.name}</strong><br/>Road Corridor (${feature.properties.width_m}m)`, { sticky: true });
              }}
            />
          )}

          {/* LAYER 3: DETECTED BUILDING FOOTPRINTS */}
          {showBuildingFootprints && (
            <GeoJSON
              key={`bld-${activeLocation?.id}`}
              data={{
                type: 'FeatureCollection',
                features: engineResult.buildings.map(b => ({
                  type: 'Feature',
                  properties: { name: b.name, storeys: b.storeys, orientation: b.orientation },
                  geometry: b.polygon.geometry
                }))
              }}
              style={{
                fillColor: '#fed7aa',
                fillOpacity: 0.65,
                color: '#ea580c',
                weight: 1.5
              }}
              onEachFeature={(feature, layer) => {
                layer.bindTooltip(`<strong>${feature.properties.name}</strong><br/>Storeys: ${feature.properties.storeys} (${feature.properties.orientation}° Orientation)`, { sticky: true });
              }}
            />
          )}

          {/* LAYER 4: NATIVE CADASTRAL LAYER (AI CANDIDATE PARCELS) */}
          <CadastralLayer
            data={engineResult.geojson}
            selectedParcelId={selectedCadastralParcel?.parcel_id}
            onSelectParcel={(p) => setSelectedCadastralParcel(p)}
            visible={isCadastralVisible && showAiCandidates && (viewMode === 'ai_candidates' || viewMode === 'comparison')}
          />

          {/* Search Pin Marker */}
          {searchPin && (
            <Marker position={searchPin.coords} icon={searchMarkerIcon}>
              <Popup>
                <div className="text-xs font-sans p-1">
                  <strong className="text-blue-900 block font-bold">{searchPin.title}</strong>
                  <div className="text-slate-600 text-[11px] mt-0.5">{searchPin.subtitle}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Measurement Polyline */}
          {measurePoints.length > 1 && (
            <Polyline
              positions={measurePoints}
              pathOptions={{ color: '#059669', weight: 3, dashArray: '6, 6' }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
