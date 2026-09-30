import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Shield, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  FileCheck2,
  PhoneCall,
  Key
} from 'lucide-react';

export default function LoginGateway() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/5 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Strip */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>NATIONAL LAND GOVERNANCE INFRASTRUCTURE</span>
            <span className="text-slate-500">•</span>
            <span className="text-white">BHU-AADHAAR DPI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            BHOOVARAHAM IDENTITY GATEWAY
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select your operational role below to proceed through the statutory authentication gateway.
            Each interface requires verified identity credentials and multi-factor authorization.
          </p>
        </div>

        {/* 3 Distinct Role Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Citizen / User */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ring-1 ring-blue-500/10 hover:border-blue-500">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200 shadow-sm">
                  <User className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                  OTP-Based Public Gate
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  1. Citizen / User Login
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  For landowners, applicants, buyers, and public citizens. Access personal applications, view permitted parcels, and track mutation requests.
                </p>
              </div>

              {/* Requirements & Features List */}
              <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span>Passwordless Mobile / Email OTP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Permitted Land Records & RoR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>My Applications Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-Time Milestone Tracking</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/user/login"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                <span>CITIZEN LOGIN VIA OTP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Editor / Authorized Officer */}
          <div className="bg-white rounded-2xl border-2 border-indigo-200 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ring-1 ring-indigo-500/10 hover:border-indigo-500">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-sm">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-200 uppercase tracking-wider">
                  Password + OTP MFA
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  2. Authorized Officer / Editor
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  For Sub-Registrars, Tehsildars, Revenue Officers, and Surveyors. Scoped exclusively to assigned jurisdiction and offices.
                </p>
              </div>

              {/* Requirements & Features List */}
              <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Official ID + Password + Officer OTP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jurisdiction-Scoped Case Queues</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Deed Verification & Clarifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Statutory RoR Mutation Engine</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/editor/login"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                <span>OFFICER LOGIN (2FA)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Administrator / Monitoring */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ring-1 ring-purple-500/10 hover:border-purple-500">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-sm">
                  <Shield className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full border border-purple-200 uppercase tracking-wider">
                  Statewide Super Admin
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  3. Administrator / Monitoring
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  For State Land Commissioners and System Administrators. Comprehensive system-wide overview, officer provisioning, and audit logs.
                </p>
              </div>

              {/* Requirements & Features List */}
              <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Credentials + High-Security MFA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Statewide Analytics & GIS Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Officer Account Commissioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Immutable System Audit Logs</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/admin/login"
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                <span>ADMINISTRATOR LOGIN (MFA)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              All authentication attempts are cryptographically verified and recorded in the statutory audit log. 
              Role-based access control (RBAC) is enforced at the database level.
            </span>
          </div>
          <Link to="/" className="text-amber-400 hover:underline flex-shrink-0 font-medium">
            ← Back to Public Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
