import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import AuditLogTable from '../../components/AuditLogTable';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GovAudit() {
  const { auditLogs } = useData();
  const { currentUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/gov/dashboard"
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                GOVERNMENT REGULATORY LOGS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-900 rounded">
                STATUTORY RECORD OF ACTIONS
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Officer Statutory Audit Trail
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Immutable register of document verifications, status updates, mutation orders, and officer remarks.
            </p>
          </div>
        </div>
      </div>

      <AuditLogTable
        logs={auditLogs}
        title="Official Land Administration Audit Log"
        subtitle="Cryptographically sealed timestamps and officer identities under Digital Public Infrastructure specifications."
      />
    </div>
  );
}
