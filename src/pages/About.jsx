import React from 'react';
import { Link } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner';
import Badge from '../components/Badge';
import { 
  ShieldCheck, 
  Map, 
  Layers, 
  Activity, 
  Building2, 
  FileCheck2, 
  Database, 
  Compass, 
  Scale,
  Sparkles,
  GitBranch,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const pillars = [
    { title: "Cadastral Parcel Maps", desc: "Digital vector polygon boundaries calibrated to WGS84 coordinates." },
    { title: "ULPIN (Bhu-Aadhaar)", desc: "14-digit alphanumeric geocoded identifier as the foundational key." },
    { title: "Record of Rights (RoR)", desc: "Integrated tenancy, ownership shares, and certified mutation history." },
    { title: "Deed Registration", desc: "Sub-Registrar Office deeds, registered values, and stamp duty receipts." },
    { title: "Land Use Classification", desc: "Agricultural, residential, commercial, industrial, and civic parcels." },
    { title: "Zoning & Master Plans", desc: "FSI ceilings, setback limits, and conversion regulations." },
    { title: "Building Permissions", desc: "Municipal and Gram Panchayat sanctioned plans and validity periods." },
    { title: "Encumbrances & Mortgages", desc: "Active bank liens, CERSAI registered mortgages, and clean title NECs." },
    { title: "Property Tax Records", desc: "Urban local body / Panchayat tax assessment demands and clearance." },
    { title: "Utility Infrastructure", desc: "Electricity consumer IDs, piped water connections, and sewage lines." },
    { title: "Environmental Buffers", desc: "30m lake buffers, river setbacks, and reserve forest fringe zoning." },
    { title: "Satellite Imagery Basemap", desc: "Multi-temporal Sentinel-2 and high-resolution optical imagery." },
    { title: "AI Land Change Detection", desc: "Automated optical variance flagging without making legal conclusions." },
    { title: "Field Verification Workflows", desc: "Mobile-responsive ground-truthing interface with geo-tagged photos." },
    { title: "Government Adjudication", desc: "Tehsildar and Town Planning official consoles with statutory powers." },
    { title: "Citizen Services", desc: "Transparent public parcel lookups and mutation status tracking." },
    { title: "Role-Based Access Control", desc: "Segregated permissions protecting privacy and official duties." },
    { title: "Immutable Audit Trails", desc: "Tamper-evident logs of every statutory action and permit issuance." }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="navy">DIGITAL PUBLIC INFRASTRUCTURE</Badge>
          <Badge variant="warning">CONCEPT & ARCHITECTURE</Badge>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          About BHOOVARAHAM (भूवराहम्)
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          An Integrated GIS-based Digital Public Infrastructure (DPI) for Modern Land Governance. 
          Transforming land records from fragmented text deeds into a unified, parcel-centric spatial truth.
        </p>
      </div>

      {/* Mandatory Governance Principle Banner */}
      <AlertBanner />

      {/* The Core Problem in Land Administration */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <span>The Challenge: Siloed Land Administration</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          In most Indian states, land information is distributed across independent government departments that do not talk to each other:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">1. Revenue Department</strong>
            <span className="text-slate-600">Maintains textual Record of Rights (Jamabandi/RoR) and ownership mutations.</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">2. Survey & Settlement Department</strong>
            <span className="text-slate-600">Maintains physical cadastral maps and village maps, often out of sync with text titles.</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">3. Registration Department (SRO)</strong>
            <span className="text-slate-600">Registers sale deeds without automatic spatial boundary validation.</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">4. Urban Local Bodies & Town Planning</strong>
            <span className="text-slate-600">Sanction building permits and assess property tax on separate municipal keys.</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-950 font-medium">
          <strong>The Consequence:</strong> Title ambiguity, double registrations, encroached lake beds and water catchment zones, delayed court litigations, and lack of real-time early warning systems.
        </div>
      </section>

      {/* The Paradigm Shift: Parcel-Centric DPI */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>The BHOOVARAHAM Solution: The Parcel as the Anchor</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Inspired by the success of India Stack (Aadhaar, UPI, DigiLocker, PM GatiShakti), 
          BHOOVARAHAM establishes the <strong>14-digit ULPIN (Unique Land Parcel Identification Number)</strong> as the universal spatial key.
        </p>

        <div className="p-4 bg-slate-900 text-white rounded-lg border border-slate-800 text-xs font-mono space-y-2">
          <div className="text-amber-400 font-bold">ULPIN FORMAT (Bhu-Aadhaar):</div>
          <div>IN [State 2-char] - [District 4-char] - [Survey 4-char] - [Geocoded Checksum 4-char]</div>
          <div className="text-slate-400 text-[11px] pt-1">
            Example: <strong className="text-white">IN29-0412-0018-7711</strong> maps to exact geographic coordinates (15.1395° N, 76.9280° E).
          </div>
        </div>
      </section>

      {/* Deep Dive into Responsible AI Principle */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>Responsible AI Principle: "AI Detects → Human Verifies → Authority Acts"</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Under constitutional administrative law, no algorithm or automated system can declare a citizen an "encroacher" 
          or alter property rights. BHOOVARAHAM embeds this ethical guardrail directly into system design:
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <span className="w-6 h-6 rounded bg-amber-100 text-amber-800 font-bold flex items-center justify-center flex-shrink-0">1</span>
            <div>
              <strong className="text-slate-900 font-bold block text-sm">Step 1: AI Detects (Optical / Spectral Variance)</strong>
              <span className="text-slate-600 leading-relaxed block mt-0.5">
                Computer vision models compare satellite imagery across time ($T_0$ vs $T_1$). If structural or vegetation change intersects with a buffer zone or unpermitted parcel, it emits a non-judicial notice: <strong>"Possible change detected"</strong> with a confidence score.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0">2</span>
            <div>
              <strong className="text-slate-900 font-bold text-sm">Step 2: Human Verifies (Field Revenue Surveyor)</strong>
              <span className="text-slate-600 leading-relaxed block mt-0.5">
                A human officer (Revenue Inspector or Patwari) is automatically tasked to visit the coordinates with a mobile device, check permits, take geo-tagged photographs, and record a physical ground verdict.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <span className="w-6 h-6 rounded bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0">3</span>
            <div>
              <strong className="text-slate-900 font-bold text-sm">Step 3: Authority Acts (Statutory Revenue Official)</strong>
              <span className="text-slate-600 leading-relaxed block mt-0.5">
                Only the designated legal authority (Tehsildar, Municipal Commissioner, or Sub-Divisional Magistrate) can issue a Show Cause Notice, order a hearing, or dismiss the alert based on the surveyor's human evidence.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The 18 Integrated DPI Points */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>The 18 Unified DPI Parameters</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700">
          The BHOOVARAHAM Parcel 360° dossier unifies eighteen departmental datasets into a single source of truth:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
          {pillars.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{idx + 1}. {item.title}</span>
              <span className="text-slate-600 text-[11px] block">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Incremental Platform Roadmap */}
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <span>Incremental Engineering Roadmap</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">Phase 1: Unified Spatial Frontend Platform (Active)</strong>
              <Badge variant="success">Operational</Badge>
            </div>
            <p className="text-slate-600">
              React + Vite + Leaflet + Tailwind CSS interactive GIS workstation, Parcel 360° dossier, satellite comparison studio, and surveyor interface with calibrated reference data.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">Phase 2: FastAPI Backend & GIS Service Engine</strong>
              <Badge variant="neutral">Upcoming</Badge>
            </div>
            <p className="text-slate-600">
              RESTful APIs with Swagger documentation, Shapely spatial point-in-polygon queries, buffer collision calculations, and JWT-based Role-Based Access Control.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">Phase 3: Automated Computer Vision Satellite Pipeline</strong>
              <Badge variant="neutral">Future</Badge>
            </div>
            <p className="text-slate-600">
              OpenCV / PyTorch multi-spectral Sentinel-2 differencing pipeline connecting to live satellite feeds for continuous buffer zone monitoring.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <Link
            to="/explorer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Launch Land Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
