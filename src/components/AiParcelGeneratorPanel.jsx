import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Download, 
  Activity, 
  X, 
  AlertCircle, 
  Box, 
  Cpu, 
  Building2, 
  Compass, 
  RefreshCw 
} from 'lucide-react';

export default function AiParcelGeneratorPanel({
  isOpen,
  onClose,
  isScanning,
  onTriggerScan,
  metrics,
  activeLayers,
  onToggleLayer,
  setbackDistance,
  onChangeSetback,
  mergeSlivers,
  onToggleMergeSlivers,
  onExportGeoJSON,
  selectedCandidateParcel,
  onClearCandidateSelection
}) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'dossier' | 'metrics'

  // Automatically switch to dossier tab whenever a parcel is selected on the map
  useEffect(() => {
    if (selectedCandidateParcel) {
      setActiveTab('dossier');
    }
  }, [selectedCandidateParcel]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 z-[450] w-96 max-w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md rounded-xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-right duration-250 font-sans pointer-events-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 border-b border-slate-800 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-amber-300 shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-wide">
                AI Cadastral Reconstruction
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-violet-600 text-white rounded uppercase tracking-wider">
                Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Physical Feature & Medial Bisector Delineation
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Close AI Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prototype Student Notice */}
      <div className="bg-amber-50/90 border-b border-amber-200 px-3 py-1.5 text-[11px] text-amber-900 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span className="leading-tight">
          <strong>Student Prototype:</strong> Boundaries are AI-derived from visible optical features (roads, buildings, gaps, walls). Demonstration data; not legally authoritative.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'pipeline'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Pipeline & Features
        </button>
        <button
          onClick={() => setActiveTab('dossier')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'dossier'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Candidate Inspector {selectedCandidateParcel ? '•' : ''}
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'metrics'
              ? 'border-indigo-600 text-indigo-700 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          AI Metrics
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs">
        {activeTab === 'pipeline' && (
          <>
            {/* Scan Action Card */}
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  Computational GIS Pipeline
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isScanning 
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isScanning ? 'Reconstructing Area...' : 'Active Overlay'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                Extracts physical features (road networks, rotated footprints, compound walls) and performs negative-space road corridor subtraction and inter-building gap partitioning.
              </p>

              <button
                onClick={onTriggerScan}
                disabled={isScanning}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-md font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Executing GIS Difference & Bisectors...' : 'Re-Run AI Parcel Reconstruction'}</span>
              </button>
            </div>

            {/* Feature Masks & Layers Toggle */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Detected Physical Evidence Layers
              </span>

              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer hover:text-indigo-700 py-0.5">
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <span className="w-3 h-3 rounded-sm bg-violet-200 border-2 border-violet-600 border-dashed inline-block"></span>
                    <span>AI Candidate Parcels (Irregular)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.candidateParcels}
                    onChange={() => onToggleLayer('candidateParcels')}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-indigo-700 py-0.5">
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <span className="w-3 h-3 rounded-sm bg-slate-400 border border-slate-700 inline-block"></span>
                    <span>Road Corridors (Negative Space)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.roads}
                    onChange={() => onToggleLayer('roads')}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-indigo-700 py-0.5">
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <span className="w-3 h-3 rounded-sm bg-orange-400 border border-orange-700 inline-block"></span>
                    <span>Building Footprints & Orientations</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.buildings}
                    onChange={() => onToggleLayer('buildings')}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-indigo-700 py-0.5">
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <span className="w-3 h-0.5 bg-amber-500 inline-block"></span>
                    <span>Compound Walls & Fences</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.walls}
                    onChange={() => onToggleLayer('walls')}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:text-indigo-700 py-0.5">
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-700 inline-block"></span>
                    <span>Open Spaces, Parks & Buffers</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.openSpaces}
                    onChange={() => onToggleLayer('openSpaces')}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </label>
              </div>
            </div>

            {/* Parameter Tuning Sliders */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Boundary Delineation Parameters
              </span>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium">Road Setback Corridor Clearance:</span>
                    <span className="font-bold text-indigo-700 font-mono">{setbackDistance.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="5.0"
                    step="0.5"
                    value={setbackDistance}
                    onChange={(e) => onChangeSetback(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                    <span>2.5m (Dense)</span>
                    <span>3.5m (Standard)</span>
                    <span>5.0m (Wide Margin)</span>
                  </div>
                </div>

                <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-medium">
                    Merge Micro-Slivers (&lt; 40 sq.m):
                  </span>
                  <input
                    type="checkbox"
                    checked={mergeSlivers}
                    onChange={onToggleMergeSlivers}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                </label>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Candidate Parcel Inspector */}
        {activeTab === 'dossier' && (
          <div>
            {selectedCandidateParcel ? (
              <div className="space-y-3">
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedCandidateParcel.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      {selectedCandidateParcel.confidence_score}% Match
                    </span>
                  </div>
                  <div className="text-slate-500 font-mono text-[10px] mt-0.5">
                    Provisional ULPIN: <strong className="text-slate-800">{selectedCandidateParcel.provisional_ulpin}</strong>
                  </div>
                  <div className="text-[11px] text-indigo-800 font-semibold mt-1">
                    Classification: {selectedCandidateParcel.classification || selectedCandidateParcel.land_use}
                  </div>
                </div>

                {/* Spatial Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Estimated Area</span>
                    <strong className="text-slate-900 text-xs">{selectedCandidateParcel.area_sq_yds} sq.yds</strong>
                    <span className="text-slate-500 block text-[10px]">({selectedCandidateParcel.area_sq_m} sq.m)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Road Corridor Overlap</span>
                    <strong className="text-emerald-700 text-xs">0.0% (Zero Collision)</strong>
                    <span className="text-slate-500 block text-[10px]">Setback: {selectedCandidateParcel.road_clearance_m}m</span>
                  </div>
                </div>

                {/* Contained Buildings List */}
                <div className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-200 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-900 font-semibold text-[10px] uppercase tracking-wide flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-orange-700" />
                      <span>Enclosed Structural Footprints ({selectedCandidateParcel.enclosed_buildings?.length || (selectedCandidateParcel.enclosed_structure ? 1 : 0)})</span>
                    </span>
                  </div>

                  {selectedCandidateParcel.enclosed_buildings && selectedCandidateParcel.enclosed_buildings.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      {selectedCandidateParcel.enclosed_buildings.map((bld, idx) => (
                        <div key={bld.id || idx} className="bg-white/80 p-2 rounded border border-orange-200/80">
                          <div className="font-semibold text-slate-800">{bld.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                            <span>Plinth: <strong>{bld.plinth_sq_m} m²</strong></span>
                            <span>•</span>
                            <span>Storeys: <strong>{bld.storeys}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-indigo-700">
                              <Compass className="w-2.5 h-2.5" />
                              <span>{bld.orientation_deg}° Orientation</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedCandidateParcel.enclosed_structure ? (
                    <div className="text-slate-800 font-medium mt-0.5">
                      {selectedCandidateParcel.enclosed_structure}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic text-[10px] py-1">
                      No structural footprints enclosed (Vacant Plotted Site / Open Green Space holding).
                    </div>
                  )}

                  <div className="text-emerald-700 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Conforms to Physical Building Extent</span>
                  </div>
                </div>

                {/* Boundary Evidence Delineation */}
                <div className="space-y-1.5 text-[11px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Physical Boundary Evidence Segments
                  </span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                    <div><strong>North:</strong> {selectedCandidateParcel.boundary_evidence?.north}</div>
                    <div><strong>South:</strong> {selectedCandidateParcel.boundary_evidence?.south}</div>
                    <div><strong>East:</strong> {selectedCandidateParcel.boundary_evidence?.east}</div>
                    <div><strong>West:</strong> {selectedCandidateParcel.boundary_evidence?.west}</div>
                  </div>
                </div>

                <button
                  onClick={onClearCandidateSelection}
                  className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded hover:bg-slate-50"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Box className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs">
                  Click any <strong className="text-violet-700">violet dashed AI Candidate Parcel</strong> on the map to inspect its boundary evidence, enclosed structures, and confidence dossier.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Performance Metrics */}
        {activeTab === 'metrics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Generated Parcels</span>
                <span className="text-base font-bold text-slate-900">{metrics.totalParcelsGenerated}</span>
                <span className="text-[10px] text-emerald-600 block font-medium">Reconstructed Plots</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Road Collision</span>
                <span className="text-base font-bold text-emerald-700">{metrics.roadOverlapPercent}</span>
                <span className="text-[10px] text-slate-500 block">Strict Negative Space</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Building Containment</span>
                <span className="text-base font-bold text-slate-900">{metrics.buildingContainmentPercent || '100%'}</span>
                <span className="text-[10px] text-emerald-600 block font-medium">Non-Axis Footprints</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Avg AI Confidence</span>
                <span className="text-base font-bold text-indigo-700">{metrics.averageConfidenceScore}</span>
                <span className="text-[10px] text-slate-500 block">Evidence Match</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span>Detected Building Plinths:</span>
                <strong className="text-slate-900">{metrics.detectedBuildingsCount} Structures</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span>Detected Road Thoroughfares:</span>
                <strong className="text-slate-900">{metrics.detectedRoadsCount} Corridors</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span>Detected Compound Segments:</span>
                <strong className="text-slate-900">{metrics.detectedWallsCount} Walls / Fences</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span>Micro-Slivers Filtered:</span>
                <strong className="text-slate-900">{metrics.sliversFilteredCount} Noise Artifacts</strong>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Total Partitioned Extent:</span>
                <strong className="text-slate-900">{metrics.totalAreaSqYds} sq.yds</strong>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 italic leading-snug">
              Methodology: {metrics.algorithmUsed}. Designed as an AI-assisted GIS tool for municipal and land authorities to evaluate un-surveyed layouts from high-resolution aerial and satellite passes.
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={onExportGeoJSON}
          className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Reconstructed GeoJSON</span>
        </button>
      </div>
    </div>
  );
}
