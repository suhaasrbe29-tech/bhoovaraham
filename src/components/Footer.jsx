import React from 'react';
import { Shield, ExternalLink, Code2, Globe2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded bg-amber-600 flex items-center justify-center text-white text-xs">
                BV
              </span>
              <span>BHOOVARAHAM (भूवराहम्)</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              An Integrated GIS-based Digital Public Infrastructure for Land Governance.
              Unifying cadastral mapping, ULPIN (Bhu-Aadhaar), Record of Rights, registration, encumbrances, and human-in-the-loop AI monitoring.
            </p>
            <div className="pt-2 flex items-center gap-2 text-amber-400 font-medium">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>AI Detects → Human Verifies → Authority Acts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide">Platform Pages</h4>
            <ul className="space-y-2">
              <li><Link to="/explorer" className="hover:text-white transition-colors">Land Explorer (GIS Map)</Link></li>
              <li><Link to="/parcel/IN29-0412-0018-7711" className="hover:text-white transition-colors">Parcel 360° Dossier</Link></li>
              <li><Link to="/change-detection" className="hover:text-white transition-colors">AI Change Detection</Link></li>
              <li><Link to="/government-dashboard" className="hover:text-white transition-colors">Government Dashboard</Link></li>
              <li><Link to="/field-verification" className="hover:text-white transition-colors">Field Verification</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Concept & Architecture</Link></li>
            </ul>
          </div>

          {/* Compliance & Disclaimers */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide">Platform Notice & Standards</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              BHOOVARAHAM is a modern Digital Public Infrastructure platform for land governance.
              Implements national ULPIN standards, spatial cadastral alignment, and multi-departmental administrative convergence.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
              Environment: DPI-REFERENCE-DEPLOYMENT-v1.0
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 BHOOVARAHAM Initiative. Digital Public Infrastructure for Land Governance.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with React + Vite + Tailwind + Leaflet</span>
            <span>•</span>
            <Link to="/about" className="text-amber-400 hover:underline">Read Architecture Blueprint</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
