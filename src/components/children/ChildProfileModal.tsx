import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  X,
  User,
  HeartPulse,
  Brain,
  Search,
  Users,
  Repeat,
  ExternalLink,
  CalendarCheck,
  AlertOctagon,
  FolderLock,
  ScrollText,
  Clock,
  PlusCircle,
  FileText,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  Phone,
  Home,
  Download,
  Upload,
  Trash2,
} from 'lucide-react';
import { getSixWeekStatus, formatDate, getDaysInShelter } from '../../utils/calculations';
import { Child, CaseStatus, HealthRecord, CounselingRecord, TracingAttempt, FollowUpRecord } from '../../types/leedo';

export const ChildProfileModal: React.FC = () => {
  const {
    selectedChild,
    setSelectedChild,
    setQuickActionState,
    currentUser,
    updateChild,
    recoverChild,
    deleteChildRecord,
    transferToPeaceHome,
  } = useLeedo();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showConfidentialCounseling, setShowConfidentialCounseling] = useState<boolean>(false);
  const [recoveryInput, setRecoveryInput] = useState<string>('');
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);

  if (!selectedChild) return null;

  const child = selectedChild;
  const daysInShelter = getDaysInShelter(child);
  const sixWeek = getSixWeekStatus(child);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal & ID', icon: FileText },
    { id: 'rescue', label: 'Rescue & GD', icon: ShieldCheck },
    { id: 'shelter', label: 'Shelter Stay', icon: Home, badge: daysInShelter > 0 ? `${daysInShelter}d` : undefined },
    { id: 'health', label: 'Health', icon: HeartPulse, count: child.healthRecords.length },
    { id: 'counseling', label: 'Counseling', icon: Brain, count: child.counselingRecords.length },
    { id: 'tracing', label: 'Family Tracing', icon: Search, count: child.tracingAttempts.length },
    { id: 'family_info', label: 'Family Info', icon: Users },
    { id: 'reintegration', label: 'Reintegration', icon: Repeat, active: !!child.reintegrationRecord },
    { id: 'referral', label: 'Gov Referral', icon: ExternalLink, active: !!child.referralRecord },
    { id: 'follow_up', label: 'Follow-up', icon: CalendarCheck, count: child.followUps.length },
    { id: 'documents', label: 'Documents & Photos', icon: FolderLock, count: child.documents.length },
    { id: 'timeline', label: 'Timeline & History', icon: Clock, count: child.timeline.length },
    { id: 'notes', label: 'Case Notes', icon: ScrollText, count: child.caseNotes.length },
  ];

  const handleRecoverChildSubmit = () => {
    if (!recoveryInput.trim()) return;
    recoverChild(child.id, recoveryInput, child.currentShelter || 'Kamalapur Shelter');
    setShowRecoveryModal(false);
    setRecoveryInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* PROFILE HEADER (Section 10 & 33) */}
        <div className="bg-stone-900 text-white p-4 sm:p-6 border-b border-stone-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Child Header Snapshot */}
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120'}
                alt={child.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-stone-700 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{child.name}</h1>
                  <span className="font-mono text-xs font-bold bg-red-600/90 text-white px-2 py-0.5 rounded-md">
                    {child.id}
                  </span>
                  {child.nickname && (
                    <span className="text-xs text-stone-400">({child.nickname})</span>
                  )}
                  <span className="text-xs bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700">
                    {child.gender}, ~{child.estimatedAge} years
                  </span>
                </div>

                {/* Sub-bar metrics */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-400 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Rescue: {formatDate(child.rescueDate)} ({child.rescueArea})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-blue-400" />
                    <span>Shelter: <strong>{child.currentShelter || 'None'}</strong></span>
                  </div>
                  {child.shelterAdmissionDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Stay: <strong>{daysInShelter} Days</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-300" />
                    <span>Worker: <strong>{child.assignedStaff}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      child.caseStatus === 'Reintegrated'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : child.caseStatus === 'Ready for Reintegration'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : child.caseStatus === 'Left Without Notice'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-stone-800 text-stone-200 border border-stone-700'
                    }`}
                  >
                    Status: {child.caseStatus}
                  </span>

                  {child.shelterAdmissionDate && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${sixWeek.badgeClass}`}>
                      {sixWeek.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Top Dropdown / Close */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setSelectedChild(null)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                title="Close Profile"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* QUICK ACTIONS ROW (Section 33) */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
              Quick Actions:
            </span>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'case_note', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Add Case Note</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'health', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>Health Check-up</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'counseling', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Counseling</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'tracing', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Family Tracing</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'family_info', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Family Info & Home Visit</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'reintegration', child })}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 rounded-md shrink-0 flex items-center gap-1"
            >
              <Repeat className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reintegration</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'referral', child })}
              className="px-2.5 py-1 text-xs font-medium bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 rounded-md shrink-0 flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>Gov Referral</span>
            </button>

            <button
              onClick={() => setQuickActionState({ open: true, type: 'upload_doc', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Doc/Photo</span>
            </button>

            {child.caseStatus === 'Left Without Notice' ? (
              <button
                onClick={() => setShowRecoveryModal(true)}
                className="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-md shrink-0 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Child Recovered</span>
              </button>
            ) : (
              <button
                onClick={() => setQuickActionState({ open: true, type: 'left_without_notice', child })}
                className="px-2.5 py-1 text-xs font-medium bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded-md shrink-0 flex items-center gap-1"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                <span>Left Without Notice</span>
              </button>
            )}

            {child.currentShelter !== 'Peace Home' && child.caseStatus !== 'Reintegrated' && (
              <button
                onClick={() => {
                  if (window.confirm(`Transfer ${child.name} to LEEDO Peace Home for long-term care (up to 17 years)?`)) {
                    transferToPeaceHome(child.id);
                  }
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 rounded-md shrink-0 flex items-center gap-1"
                title="Transfer child after 6 weeks transitional stay when family/DSS shelter is not possible"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transfer Peace Home (17y)</span>
              </button>
            )}

            <button
              onClick={() => setQuickActionState({ open: true, type: 'status_update', child })}
              className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md shrink-0 flex items-center gap-1"
            >
              <span>Update Status</span>
            </button>

            {(currentUser.canDeleteChildren || currentUser.id === '1002' || currentUser.id === '1057' || currentUser.role === 'super_admin') && (
              <button
                onClick={() => {
                  const reason = window.prompt(`ADMIN DUPLICATE REMOVAL: Enter reason to delete record of ${child.name} (${child.id}):`);
                  if (reason) {
                    deleteChildRecord(child.id, reason);
                  }
                }}
                className="px-2.5 py-1 text-xs font-bold bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-md shrink-0 flex items-center gap-1"
                title="Only Kanta (1002) and Faruque (1057) hold child deletion authority"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete / Duplicate</span>
              </button>
            )}
          </div>
        </div>

        {/* PROFILE NAVIGATION TABS */}
        <div className="bg-stone-100 px-4 border-b border-stone-200 flex items-center gap-1 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'border-red-600 text-red-700 font-bold bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full font-bold">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS CONTAINER */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-stone-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* 6-Week Stay Banner if applicable */}
              {sixWeek.status === 'exceeded' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-900">
                      Case Alert: Exceeded 6-Week Shelter Stay Threshold ({daysInShelter} Days)
                    </h4>
                    <p className="text-xs text-rose-700 mt-1">
                      Child has stayed over 42 days at {child.currentShelter}. Priority action required: finalize family tracing, schedule home visit assessment, or submit government rehabilitation referral.
                    </p>
                  </div>
                </div>
              )}

              {/* Status & Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="text-stone-400 text-xs font-medium">Days in Care</span>
                  <div className="text-xl font-black text-stone-900 mt-0.5">{daysInShelter} Days</div>
                  <span className="text-[10px] text-stone-500">Since {formatDate(child.shelterAdmissionDate)}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="text-stone-400 text-xs font-medium">Family Tracing</span>
                  <div className="text-base font-bold text-stone-900 mt-0.5">{child.familyTracingStatus}</div>
                  <span className="text-[10px] text-stone-500">{child.tracingAttempts.length} attempt(s) recorded</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="text-stone-400 text-xs font-medium">Medical Check-ups</span>
                  <div className="text-xl font-black text-stone-900 mt-0.5">
                    {child.healthRecords.length}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {child.healthRecords[0]?.nextCheckupDate
                      ? `Next: ${formatDate(child.healthRecords[0].nextCheckupDate)}`
                      : 'None scheduled'}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="text-stone-400 text-xs font-medium">Counseling Sessions</span>
                  <div className="text-xl font-black text-stone-900 mt-0.5">
                    {child.counselingRecords.length}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {child.counselingRecords[0]?.status || 'Regular sessions'}
                  </span>
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    Rescue Summary
                  </h3>
                  <div className="text-xs text-stone-700 space-y-1">
                    <div><strong>Date & Time:</strong> {formatDate(child.rescueDate)} at {child.rescueTime}</div>
                    <div><strong>Location:</strong> {child.rescueLocation} ({child.rescueArea})</div>
                    <div><strong>Rescue Team:</strong> {child.rescueTeam}</div>
                    <div><strong>Reason:</strong> {child.reasonForRescue}</div>
                    <div><strong>Police GD:</strong> {child.gdNumber || 'None'} ({child.policeStation || 'N/A'})</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    Family & Tracing Summary
                  </h3>
                  <div className="text-xs text-stone-700 space-y-1">
                    <div><strong>Status:</strong> {child.familyTracingStatus}</div>
                    <div><strong>Guardian:</strong> {child.familyInfo?.guardianName || 'Unknown / Tracing'}</div>
                    <div><strong>Origin:</strong> {child.familyInfo?.district ? `${child.familyInfo.upazila || ''}, ${child.familyInfo.district}` : (child.addressIfKnown || 'Unknown')}</div>
                    <div><strong>Contact:</strong> {child.familyInfo?.phone || 'No phone verified'}</div>
                    <div><strong>Recommendation:</strong> {child.familyInfo?.reintegrationRecommendation || 'Assessment pending'}</div>
                  </div>
                </div>
              </div>

              {/* Recent Timeline Snippet */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-500" />
                    Case Journey Highlights
                  </h3>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    View All {child.timeline.length} Events →
                  </button>
                </div>

                <div className="space-y-3">
                  {child.timeline.slice(0, 4).map(event => (
                    <div key={event.id} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{event.title}</span>
                          <span className="text-[10px] text-stone-400">{formatDate(event.date)}</span>
                        </div>
                        <p className="text-stone-600 mt-0.5">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFORMATION & IDENTIFICATION */}
          {activeTab === 'personal' && (
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-5">
              <h3 className="font-bold text-sm text-stone-900 border-b pb-2">
                Child Identification & Bio Data
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-medium">Child Full Name</span>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{child.name}</div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Nickname / Street Moniker</span>
                  <div className="font-semibold text-stone-800 text-sm mt-0.5">
                    {child.nickname || 'None reported'}
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Permanent Child ID</span>
                  <div className="font-mono font-bold text-red-600 text-sm mt-0.5">{child.id}</div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Gender</span>
                  <div className="font-semibold text-stone-800 mt-0.5">{child.gender}</div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Estimated Age</span>
                  <div className="font-semibold text-stone-800 mt-0.5">
                    {child.estimatedAge} years (DOB: {child.dob ? formatDate(child.dob) : 'Unknown'})
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Nationality</span>
                  <div className="font-semibold text-stone-800 mt-0.5">{child.nationality}</div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-stone-400 font-medium">Distinct Identification Marks</span>
                  <div className="font-semibold text-stone-800 mt-0.5">
                    {child.identificationMarks || 'No distinct marks recorded'}
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Disability or Special Needs</span>
                  <div className="font-semibold text-stone-800 mt-0.5">
                    {child.disabilityOrSpecialNeeds || 'None reported'}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-stone-400 font-medium">Reported Origin / Known Address</span>
                  <div className="font-semibold text-stone-800 mt-0.5">
                    {child.addressIfKnown || 'Unknown during street intake'}
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 font-medium">Education Background</span>
                  <div className="font-semibold text-stone-800 mt-0.5">
                    {child.educationInfo || 'Not enrolled'}
                  </div>
                </div>
              </div>

              {child.otherImportantInfo && (
                <div className="pt-3 border-t text-xs">
                  <span className="text-stone-400 font-medium">Other Important Observations</span>
                  <p className="text-stone-700 mt-1">{child.otherImportantInfo}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESCUE & INITIAL ASSESSMENT */}
          {activeTab === 'rescue' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-stone-900 border-b pb-2 flex items-center justify-between">
                  <span>Rescue Mission Details</span>
                  <span className="text-xs text-stone-500">
                    Rescued by {child.rescuedByStaff}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">Rescue Date & Time</span>
                    <div className="font-bold text-stone-900 mt-0.5">
                      {formatDate(child.rescueDate)} at {child.rescueTime}
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Rescue Location</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{child.rescueLocation}</div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Operational Area</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{child.rescueArea}</div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Rescue Team</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{child.rescueTeam}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-stone-400 font-medium">Condition at Rescue</span>
                    <div className="font-semibold text-stone-800 mt-0.5">{child.conditionAtRescue}</div>
                  </div>

                  <div className="sm:col-span-3">
                    <span className="text-stone-400 font-medium">Reason for Rescue & Protection Needs</span>
                    <p className="text-stone-700 mt-1">{child.reasonForRescue}</p>
                    <p className="text-stone-600 mt-1 italic">Needs: {child.immediateProtectionNeeds}</p>
                  </div>
                </div>
              </div>

              {/* Police Documentation / GD */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-stone-900 border-b pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Police Documentation & General Diary (GD)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">GD Number</span>
                    <div className="font-bold text-stone-900 font-mono mt-0.5">
                      {child.gdNumber || 'No GD registered'}
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">GD Registration Date</span>
                    <div className="font-semibold text-stone-800 mt-0.5">
                      {formatDate(child.gdDate)}
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Police Station (Thana)</span>
                    <div className="font-semibold text-stone-800 mt-0.5">
                      {child.policeStation || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Initial Assessment */}
              {child.initialAssessment && (
                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-stone-900 border-b pb-2">
                    Initial Vulnerability Assessment
                  </h3>

                  <div className="text-xs space-y-2">
                    <div>
                      <strong>Emergency Needs Provided:</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {child.initialAssessment.emergencyNeedsProvided?.map(need => (
                          <span
                            key={need}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium"
                          >
                            ✓ {need}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-stone-400 font-medium">Protection Concerns</span>
                        <p className="text-stone-800 mt-0.5">{child.initialAssessment.protectionConcerns || 'None noted'}</p>
                      </div>

                      <div>
                        <span className="text-stone-400 font-medium">Abuse / Exploitation Concerns</span>
                        <p className="text-stone-800 mt-0.5">{child.initialAssessment.abuseExploitationConcerns || 'None noted'}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <span className="text-stone-400 font-medium">Assessment Officer Notes</span>
                      <p className="text-stone-700 mt-1">{child.initialAssessment.assessmentNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHELTER STAY MANAGEMENT */}
          {activeTab === 'shelter' && (
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Shelter Intake & Residence</h3>
                  <p className="text-xs text-stone-500">
                    Continuous monitoring and 42-day (6-week) milestone counter.
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${sixWeek.badgeClass}`}>
                  {sixWeek.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 font-medium">Current Facility</span>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">
                    {child.currentShelter || 'Not Admitted'}
                  </div>
                  <span className="text-[10px] text-stone-500">Status: {child.shelterStatus}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 font-medium">Admission Date & Time</span>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">
                    {formatDate(child.shelterAdmissionDate)}
                  </div>
                  <span className="text-[10px] text-stone-500">Intake time: {child.shelterAdmissionTime || '10:00'}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 font-medium">Assigned Bed / Dorm</span>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">
                    {child.roomOrBed || 'General Dorm'}
                  </div>
                  <span className="text-[10px] text-stone-500">Supervisor: {child.assignedStaff}</span>
                </div>
              </div>

              {/* 6-Week Rule Explanation */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" />
                  LEEDO 6-Week Shelter Stay Protocol
                </h4>
                <p>
                  To prevent institutionalization of street-connected children, LEEDO mandates a 42-day milestone. Within this duration, case workers must attempt family tracing, assess reunification readiness, or initiate formal statutory referral to child care institutions.
                </p>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all ${
                      daysInShelter > 42
                        ? 'bg-rose-600'
                        : daysInShelter >= 35
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (daysInShelter / 42) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                  <span>Day 0 (Admission)</span>
                  <span>Day 35 (Alert Phase)</span>
                  <span>Day 42 (Max Standard Threshold)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HEALTH MANAGEMENT */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Medical History & Check-ups</h3>
                  <p className="text-xs text-stone-500">
                    Health status, medication administration, vaccinations, and pediatric evaluations.
                  </p>
                </div>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'health', child })}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Record Check-up</span>
                </button>
              </div>

              {child.healthRecords.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  No medical check-up records recorded yet. Click "Record Check-up" above to add doctor findings.
                </div>
              ) : (
                child.healthRecords.map(hr => (
                  <div key={hr.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">
                            {formatDate(hr.date)}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                              hr.healthCondition === 'Good'
                                ? 'bg-emerald-100 text-emerald-800'
                                : hr.healthCondition === 'Fair'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Condition: {hr.healthCondition}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Doctor: <strong>{hr.doctor}</strong> • Recorded by {hr.createdBy}
                        </div>
                      </div>

                      {hr.nextCheckupDate && (
                        <div className="text-right">
                          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                            Next Due: {formatDate(hr.nextCheckupDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-stone-400">Height / Weight:</span>
                        <div className="font-semibold text-stone-800">
                          {hr.heightCm ? `${hr.heightCm} cm` : 'N/A'} • {hr.weightKg ? `${hr.weightKg} kg` : 'N/A'}
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400">Diagnosis / Illness:</span>
                        <div className="font-semibold text-stone-800">{hr.illness || 'None'}</div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-stone-400">Medication / Treatment:</span>
                        <div className="font-semibold text-stone-800">{hr.treatment || hr.medication || 'Routine evaluation'}</div>
                      </div>
                    </div>

                    {hr.notes && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg">
                        <strong>Doctor Notes:</strong> {hr.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: COUNSELING MANAGEMENT (Section 13 & 30) */}
          {activeTab === 'counseling' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Psychological Care & Counseling</h3>
                  <p className="text-xs text-stone-500">
                    Trauma-informed sessions, emotional stabilization, and behavioral therapy.
                  </p>
                </div>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'counseling', child })}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log Counseling Session</span>
                </button>
              </div>

              {/* Confidentiality Privacy Notice */}
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>
                    Confidential counselor notes are protected under LEEDO Child Safeguarding protocols.
                  </span>
                </div>
                <button
                  onClick={() => setShowConfidentialCounseling(!showConfidentialCounseling)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
                >
                  {showConfidentialCounseling ? 'Hide Confidential Notes' : 'Authorize & Reveal'}
                </button>
              </div>

              {child.counselingRecords.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  No counseling records logged yet.
                </div>
              ) : (
                child.counselingRecords.map(cr => (
                  <div key={cr.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">
                            {formatDate(cr.date)} - {cr.counselingType}
                          </span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                            Status: {cr.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Counselor: <strong>{cr.counselor}</strong>
                        </div>
                      </div>

                      {cr.nextCounselingDate && (
                        <div className="text-right">
                          <span className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">
                            Next: {formatDate(cr.nextCounselingDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs space-y-1.5 pt-2 border-t border-stone-100">
                      <div>
                        <strong className="text-stone-700">Main Emotional / Trauma Concern:</strong>
                        <p className="text-stone-800 mt-0.5">{cr.mainConcern}</p>
                      </div>

                      <div>
                        <strong className="text-stone-700">Intervention Applied:</strong>
                        <p className="text-stone-800 mt-0.5">{cr.intervention}</p>
                      </div>

                      <div>
                        <strong className="text-stone-700">Child's Response:</strong>
                        <p className="text-stone-800 mt-0.5">{cr.childResponse}</p>
                      </div>

                      <div>
                        <strong className="text-stone-700">Counselor Recommendation:</strong>
                        <p className="text-stone-800 mt-0.5">{cr.recommendation}</p>
                      </div>
                    </div>

                    {cr.isConfidential && cr.confidentialNotes && (
                      <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
                          <Lock className="w-3.5 h-3.5 text-purple-600" />
                          <span>Confidential Psychological Observation:</span>
                        </div>
                        {showConfidentialCounseling ? (
                          <p className="text-purple-900">{cr.confidentialNotes}</p>
                        ) : (
                          <p className="text-stone-400 italic">
                            [Content hidden for privacy. Click "Authorize & Reveal" above to view with audit log tracking.]
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: FAMILY TRACING ATTEMPTS (Section 14) */}
          {activeTab === 'tracing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Family Tracing Journal</h3>
                  <p className="text-xs text-stone-500">
                    Detailed record of phone investigations, police inquiries, community visits, and local government coordination.
                  </p>
                </div>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'tracing', child })}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log Tracing Attempt</span>
                </button>
              </div>

              {child.tracingAttempts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  No tracing attempts logged yet. Click "Log Tracing Attempt" to start family search.
                </div>
              ) : (
                child.tracingAttempts.map((attempt, index) => (
                  <div key={attempt.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          #{child.tracingAttempts.length - index}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          {formatDate(attempt.date)} - {attempt.contactMethod}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          attempt.result === 'Successful'
                            ? 'bg-emerald-100 text-emerald-800'
                            : attempt.result === 'Lead Verified'
                            ? 'bg-blue-100 text-blue-800'
                            : attempt.result === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        Result: {attempt.result}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <strong>Contact Person:</strong> {attempt.contactPerson}
                      </div>
                      <div>
                        <strong>Location / Area:</strong> {attempt.location}
                      </div>
                    </div>

                    <div className="text-xs text-stone-700 pt-1">
                      <strong>Detailed Notes:</strong>
                      <p className="mt-0.5">{attempt.notes}</p>
                    </div>

                    <div className="text-xs text-stone-700 bg-stone-50 p-2 rounded-md">
                      <strong>Next Action Required:</strong> {attempt.nextAction}
                    </div>

                    <div className="text-[10px] text-stone-400 text-right">
                      Responsible Staff: {attempt.staffResponsible}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 8: FAMILY INFORMATION & HOME ASSESSMENT (Section 15) */}
          {activeTab === 'family_info' && (
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-sm text-stone-900">
                  Verified Family & Household Assessment
                </h3>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'family_info', child })}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Edit / Update Family Dossier →
                </button>
              </div>

              {child.familyInfo ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-stone-400 font-medium">Guardian Name</span>
                      <div className="font-bold text-stone-900 text-sm mt-0.5">
                        {child.familyInfo.guardianName || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 font-medium">Father / Mother</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.familyInfo.fatherName || 'Unknown'} / {child.familyInfo.motherName || 'Unknown'}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 font-medium">Relationship with Child</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.familyInfo.relationshipWithChild || 'Biological Parent'}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 font-medium">Phone Contact</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.familyInfo.phone || 'No direct phone'}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 font-medium">Occupation & Monthly Income</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.familyInfo.occupation || 'Day Labor'} • {child.familyInfo.incomeMonthly || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 font-medium">Family Size</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.familyInfo.familySize ? `${child.familyInfo.familySize} Members` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Address Hierarchy */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 font-medium block mb-1">Rural / Urban Address Details:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium text-stone-800">
                      <div>Village: {child.familyInfo.village || 'N/A'}</div>
                      <div>Union: {child.familyInfo.union || 'N/A'}</div>
                      <div>Upazila: {child.familyInfo.upazila || 'N/A'}</div>
                      <div>District: {child.familyInfo.district || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Home Assessment & Safety */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                      <span className="text-stone-500 font-bold block">Safety Assessment</span>
                      <p className="text-stone-700">{child.familyInfo.safetyAssessment || 'Assessment pending.'}</p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                      <span className="text-stone-500 font-bold block">Reintegration Clearance Recommendation</span>
                      <div className="font-bold text-sm text-emerald-700">
                        {child.familyInfo.reintegrationRecommendation || 'Pending Home Visit'}
                      </div>
                      {child.familyInfo.homeVisitDate && (
                        <span className="text-[10px] text-stone-400 block">
                          Visited on: {formatDate(child.familyInfo.homeVisitDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-stone-400 text-xs">
                  Family information not yet recorded for this child. Tracing is currently in progress.
                </div>
              )}
            </div>
          )}

          {/* TAB 9: REINTEGRATION (Section 16) */}
          {activeTab === 'reintegration' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Family Reintegration Protocol</h3>
                  <p className="text-xs text-stone-500">
                    Official child handover, legal custody return, and guardian agreements.
                  </p>
                </div>
                {!child.reintegrationRecord && (
                  <button
                    onClick={() => setQuickActionState({ open: true, type: 'reintegration', child })}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Execute Reintegration Handover</span>
                  </button>
                )}
              </div>

              {child.reintegrationRecord ? (
                <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Reintegration Status: Successfully Executed
                      </span>
                      <div className="text-base font-black text-stone-900 mt-0.5">
                        Handover Date: {formatDate(child.reintegrationRecord.reintegrationDate)}
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                      Reintegrated with Family
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400">Guardian / Handover Recipient:</span>
                      <div className="font-bold text-stone-900 text-sm mt-0.5">
                        {child.reintegrationRecord.guardianName} ({child.reintegrationRecord.relationshipWithChild})
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400">Handover Location:</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.reintegrationRecord.handoverLocation}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400">Responsible Officer:</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.reintegrationRecord.responsibleOfficer}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400">Witness / Local Authorities:</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.reintegrationRecord.witnessInfo || 'Ward Counselor Representative'}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl text-xs space-y-2">
                    <div>
                      <strong>Family Assessment Summary:</strong>
                      <p className="text-stone-700 mt-0.5">{child.reintegrationRecord.familyAssessmentSummary}</p>
                    </div>
                    <div>
                      <strong>Long-term Reintegration & Schooling Plan:</strong>
                      <p className="text-stone-700 mt-0.5">{child.reintegrationRecord.reintegrationPlan}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-emerald-800 pt-2 border-t">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Guardian Legal Signature Confirmed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Case Officer Signature Confirmed</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  This child has not been reintegrated yet. When the home visit and safety checks are clear, click "Execute Reintegration Handover".
                </div>
              )}
            </div>
          )}

          {/* TAB 10: GOVERNMENT REFERRAL (Section 18 & 19) */}
          {activeTab === 'referral' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Government Shelter & Service Referral</h3>
                  <p className="text-xs text-stone-500">
                    Statutory custody transfer to Department of Social Services (DSS) or specialized child welfare centers.
                  </p>
                </div>
                {!child.referralRecord && (
                  <button
                    onClick={() => setQuickActionState({ open: true, type: 'referral', child })}
                    className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Create Government Referral</span>
                  </button>
                )}
              </div>

              {child.referralRecord ? (
                <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Referral Organization
                      </span>
                      <div className="text-base font-black text-stone-900 mt-0.5">
                        {child.referralRecord.referralOrganization}
                      </div>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
                      {child.referralRecord.referralStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400">Target Facility / Center:</span>
                      <div className="font-bold text-stone-900 mt-0.5">
                        {child.referralRecord.shelterOrServiceName}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400">Referral Date:</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {formatDate(child.referralRecord.referralDate)}
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400">Center Contact:</span>
                      <div className="font-semibold text-stone-800 mt-0.5">
                        {child.referralRecord.contactPerson} ({child.referralRecord.contactNumber})
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-stone-400">Reason for Referral:</span>
                      <p className="text-stone-800 mt-0.5">{child.referralRecord.reasonForReferral}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  No government referral has been initiated. If the family is untraceable or institutional transfer is legally required, initiate a referral above.
                </div>
              )}
            </div>
          )}

          {/* TAB 11: POST-REINTEGRATION & REFERRAL FOLLOW-UPS (Section 17 & 19) */}
          {activeTab === 'follow_up' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Mandatory Follow-up Schedule</h3>
                  <p className="text-xs text-stone-500">
                    Standard schedule: 7 days, 30 days, 3 months, 6 months, 12 months for reintegrated children, or weekly for referrals.
                  </p>
                </div>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'followup', child })}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Custom Follow-up</span>
                </button>
              </div>

              {child.followUps.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  No follow-up milestones scheduled. Reintegrating or referring the child will automatically populate the schedule.
                </div>
              ) : (
                <div className="space-y-3">
                  {child.followUps.map(fu => (
                    <div
                      key={fu.id}
                      className={`p-4 rounded-xl border shadow-2xs transition-all ${
                        fu.status === 'Completed'
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : fu.status === 'Overdue'
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">
                              {fu.milestone} Milestone ({fu.type})
                            </span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                                fu.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : fu.status === 'Overdue'
                                  ? 'bg-rose-100 text-rose-800 animate-pulse'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {fu.status}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            Scheduled: <strong>{formatDate(fu.scheduledDate)}</strong>
                            {fu.completedDate && ` • Completed: ${formatDate(fu.completedDate)}`}
                            {fu.contactMethod && ` • Method: ${fu.contactMethod}`}
                          </div>
                        </div>

                        {fu.status !== 'Completed' && (
                          <button
                            onClick={() => setQuickActionState({ open: true, type: 'followup', child })}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>

                      {fu.officerObservation && (
                        <p className="text-xs text-stone-700 mt-2 bg-stone-50 p-2 rounded-lg">
                          <strong>Officer Notes:</strong> {fu.officerObservation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 12: DOCUMENTS & PHOTOS (Section 29) */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Attached Documents & Photos</h3>
                  <p className="text-xs text-stone-500">
                    Encrypted child photos, police GD scans, court orders, medical reports, and signed handover deeds.
                  </p>
                </div>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'upload_doc', child })}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Photo Gallery preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {child.photoUrl && (
                  <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                    <img
                      src={child.photoUrl}
                      alt="Current Portrait"
                      className="w-full h-36 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-2 text-xs font-semibold text-stone-800">Child Identification Photo</div>
                    <div className="text-[10px] text-stone-400">Captured at intake</div>
                  </div>
                )}
                {child.rescuePhotoUrl && (
                  <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                    <img
                      src={child.rescuePhotoUrl}
                      alt="Rescue Photo"
                      className="w-full h-36 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-2 text-xs font-semibold text-stone-800">Field Rescue Photo</div>
                    <div className="text-[10px] text-stone-400">Location: {child.rescueLocation}</div>
                  </div>
                )}
              </div>

              {/* Document List */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="p-3 bg-stone-50 border-b text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Secure Document Vault ({child.documents.length})
                </div>
                <div className="divide-y divide-stone-100">
                  {child.documents.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-400">
                      No external document attachments uploaded yet.
                    </div>
                  ) : (
                    child.documents.map(doc => (
                      <div key={doc.id} className="p-3 flex items-center justify-between text-xs hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-red-600 shrink-0" />
                          <div>
                            <div className="font-bold text-stone-900">{doc.title}</div>
                            <div className="text-[10px] text-stone-400">
                              Category: {doc.category} • Uploaded {formatDate(doc.uploadedAt)} by {doc.uploadedBy}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded">
                          {doc.fileType} • {doc.fileSize || 'Attached'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: TIMELINE & CHRONOLOGY (Section 11) */}
          {activeTab === 'timeline' && (
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 border-b pb-2">
                Chronological Child Protection Life History
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {child.timeline.map((event, i) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-red-600 ring-4 ring-white" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{event.title}</span>
                        <span className="text-[11px] text-stone-400">{formatDate(event.date)}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 rounded">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">{event.description}</p>
                      {event.author && (
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          Logged by: {event.author}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 14: CASE NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Case Worker Daily Notes</h3>
                  <p className="text-xs text-stone-500">
                    Observations, routine logs, peer interactions, and conference remarks.
                  </p>
                </div>
                <button
                  onClick={() => setQuickActionState({ open: true, type: 'case_note', child })}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </div>

              {child.caseNotes.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
                  No case notes added yet.
                </div>
              ) : (
                child.caseNotes.map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{note.title}</span>
                        <span className="text-[10px] text-stone-400">{formatDate(note.date)}</span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {note.author} ({note.authorRole.replace('_', ' ')})
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 whitespace-pre-line">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* PROFILE MODAL FOOTER */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            Case opened on <strong>{formatDate(child.rescueDate)}</strong> • Last updated:{' '}
            <strong>{formatDate(child.updatedAt)}</strong>
          </div>
          <button
            onClick={() => setSelectedChild(null)}
            className="px-4 py-2 font-medium bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>

      {/* MODAL: MARK CHILD RECOVERED */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Mark Child Recovered / Found</span>
            </h3>
            <p className="text-xs text-stone-600">
              Record retrieval circumstances for <strong>{child.name}</strong> and re-activate shelter stay.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Recovery Details & Location Found *
              </label>
              <textarea
                rows={3}
                required
                value={recoveryInput}
                onChange={e => setRecoveryInput(e.target.value)}
                placeholder="e.g. Found safely near Babu Bazar ghat by LEEDO outreach team. Health checked and returning to shelter."
                className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecoverChildSubmit}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Confirm Safe Recovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
