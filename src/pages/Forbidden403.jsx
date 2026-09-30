import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, ArrowLeft, ArrowRight, UserCheck, Home } from 'lucide-react';

export default function Forbidden403({ requiredRole = '', message = '' }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  const activeRoleName = currentUser?.role ? currentUser.role.replace('_', ' ') : 'UNAUTHENTICATED GUEST';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900/5 selection:bg-rose-100">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-rose-200 text-center space-y-6">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-300 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black tracking-widest uppercase rounded-full">
            403 FORBIDDEN • ACCESS DENIED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            Statutory Clearance Required
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            {message || 'You do not have the required statutory clearance level to access this government interface.'}
          </p>
        </div>

        {/* Audit Context Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-200">
            <span>Security Classification:</span>
            <span className="font-mono font-bold text-slate-700">RESTRICTED GOVERNMENT DPI</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Attempted Route:</span>
            <span className="font-mono text-rose-700 font-semibold">{location.pathname}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Your Current Active Role:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">
              {activeRoleName}
            </span>
          </div>
          {requiredRole && (
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Required Clearance:</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {requiredRole.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Action Routes */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch Role / Re-Authenticate</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Public Home</span>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400">
          Unauthorized attempts to breach administrative or official consoles are monitored and logged to the digital audit repository.
        </p>
      </div>
    </div>
  );
}
