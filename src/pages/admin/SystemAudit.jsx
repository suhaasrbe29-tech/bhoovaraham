import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import AuditLogTable from '../../components/AuditLogTable';
import { Shield, ArrowLeft, Clock, Key, ShieldCheck, Download } from 'lucide-react';

export default function SystemAudit() {
  const { auditLogs, officials } = useData();
  const { currentUser } = useAuth();

  // Combine login history from all officials
  const allLoginHistory = officials.flatMap(off => 
    (off.loginHistory || []).map(log => ({
      ...log,
      officialId: off.officialId,
      name: off.name,
      role: off.role,
      department: off.department
    }))
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                SYSTEM AUDIT CONSOLE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-white rounded">
                ROOT VIGILANCE
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              System-Wide Statutory Audit & Security Logs
            </h1>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Dossier</span>
        </button>
      </div>

      {/* Main Audit Log Table */}
      <AuditLogTable
        logs={auditLogs}
        title="Enterprise Land Governance Statutory Audit Trail"
        subtitle="Cryptographically sealed chronological log of mutations, deed verifications, user provisioning, and statutory decrees."
      />

      {/* Official Security & Login History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">
              Government Official Authentication & Login History
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            NIC VPN & Gateway Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Official Account</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">IP Address / Gateway</th>
                <th className="py-3 px-4">Device / Client Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allLoginHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700">
                    {new Date(item.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <strong className="text-slate-900 block">{item.name}</strong>
                    <span className="font-mono text-[10px] text-slate-500">{item.officialId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-medium block">{item.role}</span>
                    <span className="text-[10px] text-slate-500">{item.department}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-blue-700">
                    {item.ip}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.device}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
