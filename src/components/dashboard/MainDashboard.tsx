import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Users,
  AlertTriangle,
  Home,
  Search,
  CheckCircle2,
  Repeat,
  ExternalLink,
  CalendarCheck,
  AlertOctagon,
  ClockAlert,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  HeartPulse,
  Brain,
  Filter,
} from 'lucide-react';
import { SixWeekAlertBanner } from './SixWeekAlertBanner';
import { getSixWeekStatus, formatDate, getDaysInShelter } from '../../utils/calculations';

export const MainDashboard: React.FC = () => {
  const {
    currentUser,
    children,
    visibleChildren,
    openChildProfileById,
    setIsRegistrationModalOpen,
    setActiveTab,
    setQuickActionState,
  } = useLeedo();

  const [shelterFilter, setShelterFilter] = useState<'all' | 'Kamalapur Shelter' | 'Kadamtali Shelter'>('all');

  // Key metric computations
  const totalActive = children.filter(c => c.caseStatus !== 'Case Closed').length;
  const newRescues = children.filter(c => c.caseStatus === 'New Rescue' || c.caseStatus === 'Initial Assessment').length;
  
  const inShelters = children.filter(c => c.shelterStatus === 'Admitted');
  const inKamalapur = children.filter(c => c.shelterStatus === 'Admitted' && c.currentShelter === 'Kamalapur Shelter').length;
  const inKadamtali = children.filter(c => c.shelterStatus === 'Admitted' && c.currentShelter === 'Kadamtali Shelter').length;
  const inPeaceHome = children.filter(c => c.shelterStatus === 'Admitted' && c.currentShelter === 'Peace Home').length;
  
  const underTracing = children.filter(c => c.familyTracingStatus === 'In Progress').length;
  const familiesFound = children.filter(c => c.familyTracingStatus === 'Family Located').length;
  const readyReintegration = children.filter(c => c.caseStatus === 'Ready for Reintegration').length;
  const reintegrated = children.filter(c => c.caseStatus === 'Reintegrated').length;
  const govReferrals = children.filter(c => c.caseStatus === 'Government Shelter Referral' || c.caseStatus === 'Referral Follow-up').length;
  
  // Follow-ups
  const allFollowUps = children.flatMap(c => c.followUps || []);
  const pendingFollowUps = allFollowUps.filter(f => f.status === 'Pending').length;
  const overdueFollowUps = allFollowUps.filter(f => f.status === 'Overdue').length;
  
  const leftWithoutNotice = children.filter(c => c.caseStatus === 'Left Without Notice').length;
  const stayingOver6Weeks = children.filter(c => {
    const s = getSixWeekStatus(c);
    return s.status === 'exceeded' || s.status === 'completed';
  }).length;

  // Field Officer specific counts
  const myChildren = visibleChildren;
  const myTracing = myChildren.filter(c => c.familyTracingStatus === 'In Progress' || c.familyTracingStatus === 'Not Started');
  const myOverdueTasks = myChildren.flatMap(c => c.followUps || []).filter(f => f.status === 'Overdue');
  const myApproaching6Weeks = myChildren.filter(c => {
    const s = getSixWeekStatus(c);
    return s.status === 'approaching' || s.status === 'exceeded';
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {currentUser.role === 'field_officer'
                ? `Field Officer Console: ${currentUser.name}`
                : currentUser.role === 'shelter_staff'
                ? `Shelter Console: ${currentUser.assignedShelter || 'LEEDO Shelter'}`
                : 'LEEDO Child Protection Operations Dashboard'}
            </h1>
            <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
              Live State
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            {currentUser.role === 'field_officer'
              ? `Displaying caseload for assigned area: ${currentUser.assignedArea || 'Dhaka Metropolitan'}. Immediate case response & field tracking.`
              : currentUser.role === 'shelter_staff'
              ? `Active intake, room assignments, health check-ups, and counseling for ${currentUser.assignedShelter}.`
              : 'Holistic organization-wide child rescue, shelter monitoring, family tracing, reintegration, and follow-up analytics.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Child / Rescue</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-lg transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-stone-600" />
            <span>Reports & Exports</span>
          </button>
        </div>
      </div>

      {/* 6-WEEK ALERT BANNER (High Priority Requirement) */}
      <SixWeekAlertBanner />

      {/* KPI METRIC CARDS GRID (Role Adaptive) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Card 1: Total Active */}
        <div
          onClick={() => setActiveTab('children')}
          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-red-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Children</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalActive}</div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{newRescues} new rescues</span>
          </div>
        </div>

        {/* Card 2: In Shelters */}
        <div
          onClick={() => setActiveTab('shelters')}
          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-red-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">In Shelters</span>
            <Home className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">{inShelters.length}</div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span className="text-blue-700 font-medium">{inKamalapur} Kam.</span>
            <span>•</span>
            <span className="text-indigo-700 font-medium">{inKadamtali} Kad.</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">{inPeaceHome} Peace</span>
          </div>
        </div>

        {/* Card 3: > 6 Weeks Alert */}
        <div
          onClick={() => setActiveTab('six_weeks')}
          className={`p-3.5 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            stayingOver6Weeks > 0
              ? 'bg-rose-50/50 border-rose-300 hover:border-rose-400'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              &gt; 6 Weeks Stay
            </span>
            <ClockAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{stayingOver6Weeks}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Immediate review needed
          </div>
        </div>

        {/* Card 4: Family Tracing */}
        <div
          onClick={() => setActiveTab('tracing')}
          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Family Tracing</span>
            <Search className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">{underTracing}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            <span className="text-emerald-700 font-bold">{familiesFound}</span> families located
          </div>
        </div>

        {/* Card 5: Reintegration */}
        <div
          onClick={() => setActiveTab('reintegration')}
          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Reintegrated</span>
            <Repeat className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{reintegrated}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            <span className="text-amber-700 font-semibold">{readyReintegration}</span> ready for handover
          </div>
        </div>

        {/* Card 6: Referrals */}
        <div
          onClick={() => setActiveTab('referrals')}
          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-purple-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Gov Referrals</span>
            <ExternalLink className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{govReferrals}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            Sheikh Russell & DSS
          </div>
        </div>

        {/* Card 7: Follow-ups & Left Notice */}
        <div
          onClick={() => setActiveTab('follow_ups')}
          className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-red-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Follow-ups</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{pendingFollowUps}</div>
          <div className="text-[11px] mt-1 flex items-center justify-between">
            <span className={overdueFollowUps > 0 ? 'text-rose-600 font-bold' : 'text-stone-500'}>
              {overdueFollowUps} overdue
            </span>
            {leftWithoutNotice > 0 && (
              <span className="text-red-700 font-bold bg-red-50 px-1 rounded">
                {leftWithoutNotice} LWN
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECOND SECTION: TWO SHELTERS COMPARISON & OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Kamalapur Shelter Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                KS
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Kamalapur Shelter</h3>
                <p className="text-xs text-stone-500">Dhaka Central • Railway Station Area</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
              Operational
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">In Shelter</div>
              <div className="text-lg font-black text-stone-900">{inKamalapur}</div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">Capacity</div>
              <div className="text-lg font-black text-stone-700">30 beds</div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">&gt; 6 Weeks</div>
              <div className="text-lg font-black text-rose-600">
                {children.filter(c => c.currentShelter === 'Kamalapur Shelter' && getSixWeekStatus(c).status === 'exceeded').length}
              </div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">Left W/O</div>
              <div className="text-lg font-black text-amber-700">
                {children.filter(c => c.currentShelter === 'Kamalapur Shelter' && c.caseStatus === 'Left Without Notice').length}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-stone-600 pt-3 border-t border-stone-100">
            <span>Supervisor: <strong>Salma Begum</strong></span>
            <button
              onClick={() => setActiveTab('shelters')}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <span>Manage Shelter</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kadamtali Shelter Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                KD
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Kadamtali Shelter</h3>
                <p className="text-xs text-stone-500">Dhaka South • Buriganga & Sadarghat Area</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
              Operational
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">In Shelter</div>
              <div className="text-lg font-black text-stone-900">{inKadamtali}</div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">Capacity</div>
              <div className="text-lg font-black text-stone-700">25 beds</div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">&gt; 6 Weeks</div>
              <div className="text-lg font-black text-rose-600">
                {children.filter(c => c.currentShelter === 'Kadamtali Shelter' && getSixWeekStatus(c).status === 'exceeded').length}
              </div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-lg">
              <div className="text-xs text-stone-500">Ready Reint.</div>
              <div className="text-lg font-black text-emerald-600">
                {children.filter(c => c.currentShelter === 'Kadamtali Shelter' && c.caseStatus === 'Ready for Reintegration').length}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-stone-600 pt-3 border-t border-stone-100">
            <span>Supervisor: <strong>Monirul Haque</strong></span>
            <button
              onClick={() => setActiveTab('shelters')}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <span>Manage Shelter</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* THIRD SECTION: ACTIVE CASES TABLE & CASE WORKER ASSIGNMENT */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              Active Child Case Trajectories ({visibleChildren.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any child row to access their full 360° profile, medical history, counseling records, and family tracing logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('children')}
              className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              View All Children & Cases →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Child ID & Name</th>
                <th className="py-3 px-3">Gender / Age</th>
                <th className="py-3 px-3">Current Location / Shelter</th>
                <th className="py-3 px-3">Case Status</th>
                <th className="py-3 px-3">Family Tracing</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {visibleChildren.slice(0, 6).map(child => {
                const sixWeek = getSixWeekStatus(child);
                return (
                  <tr
                    key={child.id}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                    onClick={() => openChildProfileById(child.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                          alt={child.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors">
                            {child.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                            <span className="font-bold text-red-700">{child.id}</span>
                            {child.nickname && <span>({child.nickname})</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-stone-800">{child.gender}</span>, ~{child.estimatedAge} yrs
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-900">
                        {child.currentShelter || 'No Shelter'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {child.shelterAdmissionDate ? (
                          <span className={sixWeek.badgeClass}>
                            {sixWeek.label}
                          </span>
                        ) : (
                          `Rescue: ${formatDate(child.rescueDate)}`
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          child.caseStatus === 'Reintegrated'
                            ? 'bg-emerald-100 text-emerald-800'
                            : child.caseStatus === 'Ready for Reintegration'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : child.caseStatus === 'Left Without Notice'
                            ? 'bg-red-100 text-red-800 font-bold'
                            : child.caseStatus === 'Government Shelter Referral'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {child.caseStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-800">{child.familyTracingStatus}</div>
                      <div className="text-[10px] text-stone-400">
                        {child.tracingAttempts.length} attempt(s) logged
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-stone-800 font-medium">{child.assignedStaff}</div>
                      <div className="text-[10px] text-stone-500">{child.rescueArea || 'Dhaka'}</div>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openChildProfileById(child.id)}
                        className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                      >
                        Profile & Journey
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
