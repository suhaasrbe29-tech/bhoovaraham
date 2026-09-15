import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import statsData from '../data/stats.json';
import anomaliesData from '../data/anomalies.json';
import parcelsData from '../data/parcels.json';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import AlertBanner from '../components/AlertBanner';
import { 
  Building2, 
  Map, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertTriangle, 
  FileCheck2, 
  UserCheck, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export default function GovernmentDashboard() {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterVillage, setFilterVillage] = useState('ALL');

  const filteredAnomalies = anomaliesData.filter((a) => {
    if (filterPriority !== 'ALL' && a.priority !== filterPriority) return false;
    if (filterVillage !== 'ALL' && a.village !== filterVillage) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              REVENUE & TOWN PLANNING COMMAND CONSOLE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-white rounded">
              OFFICIAL JURISDICTION
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Rampur Taluk Land Governance Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            District: Ballari, Karnataka • Supervisory Authority: Tehsildar & Sub-Divisional Magistrate
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/explorer"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </Link>
          <Link
            to="/field-verification"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow flex items-center gap-1.5 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Field Verification</span>
          </Link>
        </div>
      </div>

      {/* Mandatory Governance Banner */}
      <AlertBanner compact={true} />

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Parcels"
          value={statsData.summary.total_parcels}
          subtitle="Digitized in Taluk"
          icon={Map}
        />
        <StatCard
          title="Verified Parcels"
          value={statsData.summary.verified_parcels}
          subtitle="RoR & Maps Synced"
          trend="94.9% Clean"
          trendType="positive"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Verification"
          value={statsData.summary.pending_verification}
          subtitle="Field Surveys Queued"
          trend="Action Required"
          trendType="warning"
          icon={Clock}
        />
        <StatCard
          title="AI Change Alerts"
          value={statsData.summary.ai_alerts_active}
          subtitle="Possible Changes Flagged"
          trend="Active Scanner"
          trendType="neutral"
          icon={Activity}
        />
        <StatCard
          title="High-Priority Alerts"
          value={statsData.summary.high_priority_alerts}
          subtitle="Water & Buffer Invasions"
          trend="Immediate Review"
          trendType="negative"
          icon={AlertTriangle}
        />
      </div>

      {/* Two Column Layout: Actionable Alerts & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Actionable AI Alerts Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>AI Land Change Queue (Human-in-the-Loop Triage)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review automated optical variances before issuing statutory notices
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* List of Alerts */}
          <div className="space-y-3">
            {filteredAnomalies.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        alert.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {alert.priority} Priority
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        {alert.id}
                      </span>
                      <span className="text-xs text-slate-500">• Survey No. {alert.survey_number}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {alert.wording}: {alert.change_type}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">AI Confidence</span>
                    <span className="text-base font-black text-rose-600 font-mono">
                      {alert.confidence_score}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span>ULPIN: <strong className="font-mono text-slate-800">{alert.ulpin}</strong></span>
                  <span>Affected Extent: <strong className="font-mono text-slate-800">{alert.affected_area_sq_m} sq.m</strong></span>
                  <Badge variant="warning">{alert.status}</Badge>
                </div>

                {/* Authority Action Buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-[11px] text-slate-500 italic">
                    Protocol: "AI Detects → Human Verifies → Authority Acts"
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/change-detection"
                      className="px-2.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                    >
                      Compare Satellite
                    </Link>
                    <Link
                      to="/field-verification"
                      className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-1"
                    >
                      <span>Dispatch Surveyor</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Land Use Distribution & Recent Activity Feed */}
        <div className="space-y-6">
          {/* Land Use Classification Summary */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Taluk Land-Use Inventory
            </h3>
            <div className="space-y-2.5">
              {statsData.land_use_distribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{item.type}</span>
                    <span className="font-mono text-slate-900">{item.count} Parcels ({item.area_acres} Ac)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.count / statsData.summary.total_parcels) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Governance Activity Log */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Administrative Activity
            </h3>
            <div className="space-y-3">
              {statsData.recent_activities.map((act) => (
                <div key={act.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-none space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-800">{act.officer}</span>
                    <span>{act.timestamp}</span>
                  </div>
                  <div className="font-medium text-blue-700">{act.action}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{act.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
