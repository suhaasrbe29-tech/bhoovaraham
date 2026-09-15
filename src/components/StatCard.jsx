import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendType = 'neutral', badge }) {
  const trendColors = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    negative: 'text-rose-700 bg-rose-50 border-rose-200',
    warning: 'text-amber-700 bg-amber-50 border-amber-200',
    neutral: 'text-slate-600 bg-slate-50 border-slate-200'
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          {trend && (
            <span className={`px-1.5 py-0.5 rounded border font-medium ${trendColors[trendType]}`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {badge && <span className="ml-auto">{badge}</span>}
        </div>
      )}
    </div>
  );
}
