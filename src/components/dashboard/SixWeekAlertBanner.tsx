import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
  ShieldCheck,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { getSixWeekStatus, formatDate, getDaysInShelter } from '../../utils/calculations';

export const SixWeekAlertBanner: React.FC = () => {
  const { children, openChildProfileById, setQuickActionState } = useLeedo();
  const [filterType, setFilterType] = useState<'all' | 'exceeded' | 'approaching'>('all');

  // Filter children who are currently in a shelter
  const shelterChildren = children.filter(c => {
    return (
      (c.shelterStatus === 'Admitted' ||
        c.caseStatus === 'Shelter Stay' ||
        c.caseStatus === 'Family Tracing' ||
        c.caseStatus === 'Family Located' ||
        c.caseStatus === 'Ready for Reintegration') &&
      c.shelterAdmissionDate
    );
  });

  const categorizedChildren = shelterChildren.map(c => {
    const days = getDaysInShelter(c);
    const status = getSixWeekStatus(c);
    return {
      child: c,
      days,
      status,
    };
  });

  const exceeded = categorizedChildren.filter(item => item.status.status === 'exceeded');
  const completed = categorizedChildren.filter(item => item.status.status === 'completed');
  const approaching = categorizedChildren.filter(item => item.status.status === 'approaching');

  const displayedList = categorizedChildren.filter(item => {
    if (filterType === 'exceeded') return item.status.status === 'exceeded' || item.status.status === 'completed';
    if (filterType === 'approaching') return item.status.status === 'approaching';
    return item.status.status === 'exceeded' || item.status.status === 'completed' || item.status.status === 'approaching';
  });

  if (exceeded.length === 0 && approaching.length === 0 && completed.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden mb-6">
      {/* Alert Header */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 sm:p-5 border-b border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-base">
                Shelter Stay 6-Week Protocol Alert
              </h3>
              <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
                {exceeded.length + completed.length} Critical / {approaching.length} Approaching
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              LEEDO Child Protection standard requires case disposition or reintegration transition within 42 days (6 weeks) of shelter intake.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-lg border border-rose-200 shadow-2xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Alerts ({exceeded.length + completed.length + approaching.length})
          </button>
          <button
            onClick={() => setFilterType('exceeded')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === 'exceeded'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            &gt; 6 Weeks ({exceeded.length + completed.length})
          </button>
          <button
            onClick={() => setFilterType('approaching')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === 'approaching'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Approaching ({approaching.length})
          </button>
        </div>
      </div>

      {/* Table of Alert Children */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-4">Child ID & Name</th>
              <th className="py-2.5 px-3">Shelter</th>
              <th className="py-2.5 px-3">Admission Date</th>
              <th className="py-2.5 px-3">Days in Shelter</th>
              <th className="py-2.5 px-3">Case Worker</th>
              <th className="py-2.5 px-3">Case / Tracing Status</th>
              <th className="py-2.5 px-3 text-right">Required Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {displayedList.map(({ child, days, status }) => {
              const isExceeded = status.status === 'exceeded';
              const isCompleted = status.status === 'completed';

              return (
                <tr
                  key={child.id}
                  className={`hover:bg-stone-50/80 transition-colors ${
                    isExceeded ? 'bg-rose-50/20' : isCompleted ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                        alt={child.name}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <button
                          onClick={() => openChildProfileById(child.id)}
                          className="font-bold text-stone-900 hover:text-red-600 text-left transition-colors"
                        >
                          {child.name}
                        </button>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                          <span>{child.id}</span>
                          <span>•</span>
                          <span>{child.gender}, ~{child.estimatedAge}y</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-medium text-stone-800">{child.currentShelter}</span>
                    {child.roomOrBed && (
                      <div className="text-[10px] text-stone-500">{child.roomOrBed}</div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-stone-700">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{formatDate(child.shelterAdmissionDate)}</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Rescued: {formatDate(child.rescueDate)}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border">
                      <span
                        className={
                          isExceeded
                            ? 'text-rose-700 font-extrabold'
                            : isCompleted
                            ? 'text-amber-700 font-extrabold'
                            : 'text-amber-600'
                        }
                      >
                        {days} Days
                      </span>
                      <span className="text-[10px] text-stone-500">
                        ({days > 42 ? `+${days - 42}d overdue` : `${42 - days}d left`})
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-stone-800 font-medium">{child.assignedStaff}</div>
                    <div className="text-[10px] text-stone-500">{child.assignedArea || 'Dhaka'}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-700 border border-stone-200">
                        {child.caseStatus}
                      </span>
                      <div className="text-[10px] text-stone-500">
                        Tracing: <strong className="text-stone-700">{child.familyTracingStatus}</strong>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setQuickActionState({
                            open: true,
                            type: child.familyTracingStatus === 'Family Located' ? 'reintegration' : 'tracing',
                            child,
                          });
                        }}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                      >
                        {child.familyTracingStatus === 'Family Located'
                          ? 'Plan Reintegration'
                          : 'Update Tracing'}
                      </button>
                      <button
                        onClick={() => openChildProfileById(child.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <span>Case Review</span>
                        <ArrowRight className="w-3 h-3" />
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
  );
};
