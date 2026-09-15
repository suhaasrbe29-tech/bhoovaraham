import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AlertBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-xs text-amber-900 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="font-medium">Governance Principle:</span>
        <span className="font-semibold text-amber-950">AI Detects → Human Verifies → Authority Acts.</span>
        <span className="text-amber-800">AI flags possible changes, not legal encroachments.</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              Foundational Governance Principle
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-amber-500 text-slate-950 rounded uppercase">
                DPI Standard
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated computer vision flags <strong className="text-amber-300 font-medium">"Possible change detected"</strong>. AI does NOT make legal determinations of encroachment or ownership.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-slate-200 whitespace-nowrap">
          <span className="text-amber-400 font-semibold">1. AI Detects</span>
          <span className="text-slate-500">→</span>
          <span className="text-emerald-400 font-semibold">2. Human Verifies</span>
          <span className="text-slate-500">→</span>
          <span className="text-blue-400 font-semibold">3. Authority Acts</span>
        </div>
      </div>
    </div>
  );
}
