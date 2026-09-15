import React, { useState } from 'react';
import verificationTasksData from '../data/verificationTasks.json';
import AlertBanner from '../components/AlertBanner';
import Badge from '../components/Badge';
import { 
  FileCheck2, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Smartphone,
  Navigation,
  Image as ImageIcon
} from 'lucide-react';

export default function FieldVerification() {
  const [tasks, setTasks] = useState(verificationTasksData);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].task_id);
  const [fieldNotes, setFieldNotes] = useState(
    "Inspected northern boundary along lake high flood level. Observed unapproved concrete plinth and tin roofing erected without Gram Panchayat sanction. Measurements: 21m x 20m."
  );
  const [selectedVerdict, setSelectedVerdict] = useState('VIOLATION_CONFIRMED');
  const [mockPhotoUploaded, setMockPhotoUploaded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentTask = tasks.find(t => t.task_id === selectedTaskId) || tasks[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // update task state locally
      setTasks(prev => prev.map(t => t.task_id === currentTask.task_id ? { ...t, status: 'Inspection Completed (Ground Evidence Submitted)' } : t));
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Mobile PWA Style Context Header */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold">Field Surveyor Mobile Workstation</h1>
              <span className="px-2 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded uppercase">
                GPS ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Officer: {currentTask.assigned_to}
            </p>
          </div>
        </div>

        {/* Task Switcher */}
        <select
          value={selectedTaskId}
          onChange={(e) => {
            setSelectedTaskId(e.target.value);
            setIsSubmitted(false);
          }}
          className="bg-slate-800 text-white text-xs border border-slate-700 rounded px-2.5 py-1.5 font-mono"
        >
          {tasks.map(t => (
            <option key={t.task_id} value={t.task_id}>
              {t.task_id} - Survey {t.survey_number}
            </option>
          ))}
        </select>
      </div>

      {/* Mandatory Governance Principle */}
      <AlertBanner compact={true} />

      {/* Verification Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Task Overview Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Priority: {currentTask.urgency}
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">{currentTask.task_id}</span>
              <Badge variant="navy">ULPIN: {currentTask.ulpin}</Badge>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Field Ground-Truthing: Survey No. {currentTask.survey_number} ({currentTask.village})
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono font-medium">{currentTask.coordinates}</span>
              <span>•</span>
              <span>Due: {currentTask.due_date}</span>
            </div>
          </div>

          <Badge variant={currentTask.status.includes('Completed') ? 'success' : 'warning'}>
            {currentTask.status}
          </Badge>
        </div>

        {/* AI Finding Context Box */}
        <div className="p-5 border-b border-slate-200 bg-rose-50/40 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-950 uppercase tracking-wide">
              Automated AI Trigger: Possible Change Detected
            </span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed bg-white p-3 rounded border border-rose-200 font-medium">
            "{currentTask.ai_finding}" (Confidence Score: {currentTask.confidence_score}%)
          </p>
          <p className="text-[11px] text-slate-500 italic">
            Note: This AI detection is an optical flag. Your on-ground physical inspection will determine the formal evidence submitted to the Tehsildar.
          </p>
        </div>

        {/* Inspection Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6 text-xs">
          {/* Surveyor Verification Checklist Guidelines */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              Standard Operating Procedure (SOP) Checklist
            </h3>
            <ul className="space-y-1.5 pl-2">
              {currentTask.guidelines?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo Evidence Upload UI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Geo-Tagged Ground Evidence Photos</span>
              </label>
              <span className="text-[10px] text-slate-500">EXIF GPS Tagging Mandatory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Photo 1: Simulated Uploaded Field Photo */}
              <div className="p-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center relative overflow-hidden h-36">
                {mockPhotoUploaded ? (
                  <div className="w-full h-full flex flex-col justify-between bg-slate-900 text-white p-2 rounded">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-emerald-600 px-1.5 py-0.2 rounded font-mono font-bold">GEO-TAGGED</span>
                      <span className="text-slate-400 font-mono">15.1395°N, 76.9280°E</span>
                    </div>
                    <div className="text-center my-auto">
                      <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-slate-200 font-semibold text-xs block">IMG_GROUND_NORTH_HFL.JPG</span>
                      <span className="text-[10px] text-slate-400">Tin shed structure within 18m of lake HFL</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">Timestamp: 2026-02-09 10:42:18 IST</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-slate-600 font-medium block">Click to Capture Ground Photo</span>
                    <span className="text-[10px] text-slate-400">Camera / Mobile File</span>
                  </div>
                )}
              </div>

              {/* Photo 2: Secondary Angle Upload */}
              <div className="p-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer flex flex-col items-center justify-center text-center h-36 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-slate-700 font-medium">Upload Secondary Boundary Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG / PNG up to 10MB</span>
              </div>
            </div>
          </div>

          {/* Surveyor Ground Verdict Radio Options */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wide text-[11px] block">
              Surveyor Physical Finding (Ground Verdict)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-colors ${
                selectedVerdict === 'VIOLATION_CONFIRMED' ? 'bg-rose-50 border-rose-400 text-rose-950' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="verdict"
                  value="VIOLATION_CONFIRMED"
                  checked={selectedVerdict === 'VIOLATION_CONFIRMED'}
                  onChange={(e) => setSelectedVerdict(e.target.value)}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="font-bold block">1. Confirmed Unauthorized Structure</span>
                  <span className="text-[11px] text-slate-600">Physical construction erected without statutory permissions.</span>
                </div>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-colors ${
                selectedVerdict === 'PERMITTED_ACTIVITY' ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="verdict"
                  value="PERMITTED_ACTIVITY"
                  checked={selectedVerdict === 'PERMITTED_ACTIVITY'}
                  onChange={(e) => setSelectedVerdict(e.target.value)}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold block">2. Permitted / Sanctioned Work</span>
                  <span className="text-[11px] text-slate-600">Occupant presented valid building permit or NOC.</span>
                </div>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-colors ${
                selectedVerdict === 'FALSE_POSITIVE' ? 'bg-blue-50 border-blue-400 text-blue-950' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="verdict"
                  value="FALSE_POSITIVE"
                  checked={selectedVerdict === 'FALSE_POSITIVE'}
                  onChange={(e) => setSelectedVerdict(e.target.value)}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold block">3. False Positive / Natural Variation</span>
                  <span className="text-[11px] text-slate-600">Optical reflection due to water hyacinth, silt, or shadow.</span>
                </div>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-colors ${
                selectedVerdict === 'BOUNDARY_RESURVEY_NEEDED' ? 'bg-amber-50 border-amber-400 text-amber-950' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="verdict"
                  value="BOUNDARY_RESURVEY_NEEDED"
                  checked={selectedVerdict === 'BOUNDARY_RESURVEY_NEEDED'}
                  onChange={(e) => setSelectedVerdict(e.target.value)}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold block">4. Boundary Disputed / DGPS Needed</span>
                  <span className="text-[11px] text-slate-600">Demarcation stone missing; requires ETS re-survey.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Field Notes Textarea */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 uppercase tracking-wide text-[11px] block">
              Surveyor Physical Inspection Remarks
            </label>
            <textarea
              rows={4}
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              className="w-full p-3 rounded border border-slate-300 focus:ring-2 focus:ring-blue-600 text-xs text-slate-800 font-sans"
              placeholder="Enter comprehensive ground observations, physical dimensions, occupant statement..."
            />
          </div>

          {/* Success Feedback Banner */}
          {isSubmitted && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Verification Report Submitted to Tehsildar Console!</h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  The evidence package has been cryptographically attached to ULPIN <strong>{currentTask.ulpin}</strong>. 
                  The Revenue Authority will now review the human report to decide statutory action.
                </p>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <span className="text-[11px] text-slate-500">
              Stage 2 of 3: Human Verification
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Submit Ground Verification Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
