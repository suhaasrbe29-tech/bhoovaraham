import React, { useState } from 'react';
import { Search, Filter, Clock, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Badge from './Badge';

export default function AuditLogTable({ logs = [], title = "Immutable Statutory Audit Trail", subtitle = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      (log.logId && log.logId.toLowerCase().includes(term)) ||
      (log.applicationId && log.applicationId.toLowerCase().includes(term)) ||
      (log.ulpin && log.ulpin.toLowerCase().includes(term)) ||
      (log.actorName && log.actorName.toLowerCase().includes(term)) ||
      (log.actorId && log.actorId.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term))
    );
  });

  const uniqueActions = Array.from(new Set(logs.map(l => l.action).filter(Boolean)));

  const getActionBadgeVariant = (action) => {
    if (action.includes('APPROVED') || action.includes('ACTIVATED')) return 'success';
    if (action.includes('REJECTED') || action.includes('DEACTIVATED')) return 'danger';
    if (action.includes('CLARIFICATION') || action.includes('FLAG')) return 'warning';
    if (action.includes('SUBMITTED') || action.includes('VERIFIED')) return 'primary';
    return 'neutral';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">{title}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              CRYPTOGRAPHICALLY SEALED
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, Actor, Action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Statutory Actions ({logs.length})</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-3 px-4">Log ID & Timestamp</th>
              <th className="py-3 px-4">Reference / Parcel</th>
              <th className="py-3 px-4">Statutory Action</th>
              <th className="py-3 px-4">Officer / Actor</th>
              <th className="py-3 px-4">Details & Remarks</th>
              <th className="py-3 px-4 text-right">Synthetic Signature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                  No statutory audit records match the selected filter.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 block">{log.logId}</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {log.applicationId && log.applicationId !== 'N/A' ? (
                      <div>
                        <span className="font-mono font-semibold text-blue-700">{log.applicationId}</span>
                        {log.surveyNumber && (
                          <span className="text-[11px] text-slate-500 block">Survey {log.surveyNumber}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">System Scope</span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{log.actorName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {log.actorId} • {log.actorRole}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs sm:max-w-md">
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {log.details}
                    </p>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {log.digitalSignatureHash ? `${log.digitalSignatureHash.slice(0, 10)}...` : '0xSigned'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
