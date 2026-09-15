import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import anomaliesData from '../data/anomalies.json';
import AlertBanner from '../components/AlertBanner';
import Badge from '../components/Badge';
import { 
  Activity, 
  Layers, 
  SplitSquareVertical, 
  Eye, 
  ShieldAlert, 
  FileCheck2, 
  Calendar, 
  MapPin, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';

export default function ChangeDetection() {
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomaliesData[0]);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'side-by-side' | 'difference'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI SATELLITE CHANGE DETECTION MONITOR
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded border border-blue-200">
              MULTI-TEMPORAL SURVEILLANCE
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Automated Land & Buffer Variance Scanner
          </h1>
        </div>

        {/* Anomaly selector */}
        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-500 font-medium">Select Anomaly Alert:</label>
          <select
            value={selectedAnomaly.id}
            onChange={(e) => {
              const found = anomaliesData.find(a => a.id === e.target.value);
              if (found) setSelectedAnomaly(found);
            }}
            className="bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 shadow-sm"
          >
            {anomaliesData.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id}: {a.survey_number} ({a.change_type.slice(0, 35)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Governance Principle Callout */}
      <AlertBanner />

      {/* Status Card for Selected Anomaly */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="alert">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{selectedAnomaly.wording}</span>
              </Badge>
              <Badge variant="navy">Alert ID: {selectedAnomaly.id}</Badge>
              <Badge variant="primary">ULPIN: {selectedAnomaly.ulpin}</Badge>
              <Badge variant="warning">{selectedAnomaly.environmental_tag}</Badge>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {selectedAnomaly.change_type}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-3">
              <span>📍 Survey No. <strong>{selectedAnomaly.survey_number}</strong> ({selectedAnomaly.village}, {selectedAnomaly.mandal})</span>
              <span>•</span>
              <span>Detected: {new Date(selectedAnomaly.detected_at).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-6">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Optical Confidence</span>
              <span className="text-2xl font-black text-rose-600 font-mono">
                {selectedAnomaly.confidence_score}%
              </span>
            </div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Affected Area</span>
              <span className="text-xl font-bold text-slate-900 font-mono">
                {selectedAnomaly.affected_area_sq_m} m²
              </span>
              <span className="text-[10px] text-slate-500 block">({selectedAnomaly.affected_area_acres} acres)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Satellite Imagery Comparison Studio */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4 text-white">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-wide">Multi-Temporal Satellite Differencing Studio</span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Interactive Swipe Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'side-by-side' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('difference')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'difference' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              AI Difference Heatmap
            </button>
          </div>
        </div>

        {/* Visualizer Canvas Area */}
        {viewMode === 'split' && (
          <div className="space-y-3">
            <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 rounded-lg overflow-hidden select-none border border-slate-800">
              {/* Baseline Image T0 (Left Background) */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `radial-gradient(circle at 40% 50%, #064e3b 15%, #022c22 45%, #0f172a 90%)`
                }}
              >
                {/* Synthetic Baseline Terrain Graphics */}
                <svg className="w-full h-full opacity-60" viewBox="0 0 800 480">
                  <path d="M 0,260 Q 200,240 400,270 T 800,250 L 800,480 L 0,480 Z" fill="#0369a1" opacity="0.7" />
                  <text x="50" y="380" fill="#bae6fd" fontSize="16" fontWeight="bold" fontFamily="monospace">
                    VARAHA LAKE RESERVOIR (HFL: 440m)
                  </text>
                  <circle cx="450" cy="220" r="140" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6,6" />
                  <text x="360" y="100" fill="#86efac" fontSize="13" fontFamily="monospace">
                    30m MANDATORY LAKE BUFFER ZONE (2024: VACANT)
                  </text>
                </svg>

                <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono">
                  <span className="text-emerald-400 font-bold block">T0 BASELINE: Jan 2024</span>
                  <span className="text-slate-400 text-[11px]">Sentinel-2 MSI (10m Res)</span>
                </div>
              </div>

              {/* Current Image T1 (Right Foreground with Clip Path controlled by slider) */}
              <div
                className="absolute inset-0 bg-cover bg-center overflow-hidden"
                style={{
                  clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                  backgroundImage: `radial-gradient(circle at 40% 50%, #064e3b 15%, #022c22 45%, #0f172a 90%)`
                }}
              >
                {/* Synthetic Current Terrain Graphics with New Structure */}
                <svg className="w-full h-full" viewBox="0 0 800 480">
                  <path d="M 0,260 Q 200,240 400,270 T 800,250 L 800,480 L 0,480 Z" fill="#0369a1" opacity="0.7" />
                  <circle cx="450" cy="220" r="140" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,6" />

                  {/* Detected New Structure Polygon */}
                  <g className="animate-pulse-subtle">
                    <rect x="420" y="190" width="90" height="60" fill="#ef4444" opacity="0.6" stroke="#ffffff" strokeWidth="2" />
                    <text x="380" y="175" fill="#fca5a5" fontSize="12" fontWeight="bold" fontFamily="monospace">
                      ⚠️ POSSIBLE CHANGE DETECTED (420 m²)
                    </text>
                  </g>
                </svg>

                <div className="absolute top-4 right-4 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-right">
                  <span className="text-rose-400 font-bold block">T1 CURRENT: Jan 2026</span>
                  <span className="text-slate-400 text-[11px]">High-Res Optical Snapshot</span>
                </div>
              </div>

              {/* Swipe Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg text-xs font-bold pointer-events-none">
                  ↔
                </div>
              </div>
            </div>

            {/* Slider Range Control */}
            <div className="flex items-center gap-3 px-2">
              <span className="text-xs text-slate-400 font-mono">T0 (Baseline)</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="flex-1 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-mono">T1 (Current)</span>
            </div>
          </div>
        )}

        {/* Side-by-Side Mode */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline Tile */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">T0: {selectedAnomaly.baseline_period}</span>
                <span className="text-slate-400">Baseline Satellite Tile</span>
              </div>
              <div className="h-64 rounded bg-emerald-950/40 border border-emerald-900/50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 mb-2">
                  ✓
                </div>
                <span className="text-xs font-semibold text-emerald-300">Vacant Protected Lake Buffer</span>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {selectedAnomaly.baseline_description}
                </p>
              </div>
            </div>

            {/* Current Tile */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold">T1: {selectedAnomaly.current_period}</span>
                <span className="text-slate-400">Current Satellite Tile</span>
              </div>
              <div className="h-64 rounded bg-rose-950/40 border border-rose-900/50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-900/60 flex items-center justify-center text-rose-400 mb-2">
                  ⚠️
                </div>
                <span className="text-xs font-semibold text-rose-300">Possible Change Flagged</span>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {selectedAnomaly.current_description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Difference Heatmap Mode */}
        {viewMode === 'difference' && (
          <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 space-y-4 text-center">
            <div className="max-w-md mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-full bg-rose-900/40 text-rose-400 border border-rose-800">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Spectral Residual Differencing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Differencing function: <code className="text-rose-300 font-mono">|T1_NDVI - T0_NDVI| &gt; Threshold(0.42)</code>
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 max-w-lg mx-auto space-y-2 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Anomaly Polygon Bounding Box:</span>
                <span className="text-white font-bold">76.9280° E, 15.1395° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Structural Reflection Index:</span>
                <span className="text-rose-400 font-bold">+0.68 (High Contrast)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Buffer Rule Collision:</span>
                <span className="text-amber-400 font-bold">Violates 30m Water Setback</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Governance Actions Bar */}
      <div className="bg-slate-50 rounded-lg border border-slate-300 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Next Governance Step
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Dispatch Revenue Inspector for Ground Ground-Truthing
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Under the BHOOVARAHAM protocol, automated alerts must be verified on the ground before any notice is served.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/field-verification"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Open Field Verification Portal</span>
          </Link>
          <Link
            to={`/parcel/${selectedAnomaly.ulpin}`}
            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors"
          >
            View Parcel 360°
          </Link>
        </div>
      </div>
    </div>
  );
}
