import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  ClockAlert,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Home,
  User,
  Search,
} from 'lucide-react';
import { getSixWeekStatus, formatDate, getDaysInShelter } from '../../utils/calculations';

export const SixWeekAlertsView: React.FC = () => {
  const { children, openChildProfileById, setQuickActionState, shelters } = useLeedo();
  const [filterType, setFilterType] = useState<'all' | 'exceeded' | 'approaching'>('all');
  const [shelterFilter, setShelterFilter] = useState<string>('all');

  const admittedChildren = children.filter(c => c.shelterStatus === 'Admitted' && c.shelterAdmissionDate);

  const enrichedList = admittedChildren.map(c => {
    const days = getDaysInShelter(c);
    const status = getSixWeekStatus(c);
    return {
      child: c,
      days,
      status,
    };
  });

  const exceededList = enrichedList.filter(item => item.status.status === 'exceeded' || item.status.status === 'completed');
  const approachingList = enrichedList.filter(item => item.status.status === 'approaching');

  const filtered = enrichedList.filter(item => {
    const matchesType =
      filterType === 'all'
        ? item.status.status === 'exceeded' || item.status.status === 'completed' || item.status.status === 'approaching'
        : filterType === 'exceeded'
        ? item.status.status === 'exceeded' || item.status.status === 'completed'
        : item.status.status === 'approaching';

    const matchesShelter = shelterFilter === 'all' || item.child.currentShelter === shelterFilter;
    return matchesType && matchesShelter;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              6-Week Shelter Stay Protocol Monitor
            </h2>
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
              LEEDO Child Safeguarding Rule #6W
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            To guard against prolonged institutionalization, cases approaching or exceeding 42 days (6 weeks) trigger mandatory multi-disciplinary review for family tracing, home visit assessment, or statutory referral.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filterType === 'all' ? 'bg-white text-rose-700 shadow-2xs' : 'text-stone-600'
              }`}
            >
              All Alerts ({exceededList.length + approachingList.length})
            </button>
            <button
              onClick={() => setFilterType('exceeded')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filterType === 'exceeded' ? 'bg-rose-600 text-white shadow-2xs' : 'text-stone-600'
              }`}
            >
              &gt; 42 Days ({exceededList.length})
            </button>
            <button
              onClick={() => setFilterType('approaching')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filterType === 'approaching' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600'
              }`}
            >
              35-41 Days ({approachingList.length})
            </button>
          </div>

          <select
            value={shelterFilter}
            onChange={e => setShelterFilter(e.target.value)}
            className="text-xs border border-stone-300 rounded-lg p-2 bg-white focus:outline-none"
          >
            <option value="all">All Shelters</option>
            {shelters.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Flagged Children */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Child ID & Name</th>
                <th className="py-3 px-3">Shelter</th>
                <th className="py-3 px-3">Rescue Date</th>
                <th className="py-3 px-3">Admission Date</th>
                <th className="py-3 px-3">Days in Shelter</th>
                <th className="py-3 px-3">Case Worker</th>
                <th className="py-3 px-3">Current Case Status</th>
                <th className="py-3 px-3">Family Tracing</th>
                <th className="py-3 px-4 text-right">Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(({ child, days, status }) => {
                const isExceeded = status.status === 'exceeded';
                return (
                  <tr
                    key={child.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      isExceeded ? 'bg-rose-50/25' : 'bg-amber-50/20'
                    }`}
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
                          <button
                            onClick={() => openChildProfileById(child.id)}
                            className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors text-left"
                          >
                            {child.name}
                          </button>
                          <div className="text-[11px] text-stone-500 font-mono">
                            <span className="text-red-600 font-bold">{child.id}</span> • {child.gender}, ~{child.estimatedAge}y
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-stone-800">
                      {child.currentShelter}
                    </td>

                    <td className="py-3 px-3 text-stone-600">
                      {formatDate(child.rescueDate)}
                    </td>

                    <td className="py-3 px-3 font-medium text-stone-800">
                      {formatDate(child.shelterAdmissionDate)}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs ${
                          isExceeded
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {days} Days ({days > 42 ? `+${days - 42}d overdue` : `${42 - days}d remaining`})
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-stone-800">
                      {child.assignedStaff}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700">
                        {child.caseStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-800">{child.familyTracingStatus}</div>
                      <div className="text-[10px] text-stone-400">
                        {child.tracingAttempts.length} logged
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setQuickActionState({
                              open: true,
                              type: child.familyTracingStatus === 'Family Located' ? 'reintegration' : 'tracing',
                              child,
                            });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                        >
                          {child.familyTracingStatus === 'Family Located' ? 'Reintegrate' : 'Trace Family'}
                        </button>
                        <button
                          onClick={() => openChildProfileById(child.id)}
                          className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                          Case 360°
                        </button>
                      </div>
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
