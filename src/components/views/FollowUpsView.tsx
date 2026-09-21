import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  CalendarCheck,
  CheckCircle2,
  ClockAlert,
  AlertTriangle,
  Calendar,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';
import { FollowUpRecord, Child } from '../../types/leedo';

export const FollowUpsView: React.FC = () => {
  const { children, openChildProfileById, setQuickActionState } = useLeedo();
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Completed' | 'Overdue'>('all');

  // Collect all follow-ups paired with child
  const allFollowUps: Array<{ child: Child; followUp: FollowUpRecord }> = [];
  children.forEach(child => {
    (child.followUps || []).forEach(fu => {
      allFollowUps.push({ child, followUp: fu });
    });
  });

  const filtered = allFollowUps.filter(item => {
    if (filterStatus === 'all') return true;
    return item.followUp.status === filterStatus;
  });

  const pendingCount = allFollowUps.filter(i => i.followUp.status === 'Pending').length;
  const overdueCount = allFollowUps.filter(i => i.followUp.status === 'Overdue').length;
  const completedCount = allFollowUps.filter(i => i.followUp.status === 'Completed').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Child Welfare Follow-Up Monitoring Schedule
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Systematic schedule tracking (7 days, 30 days, 3 months, 6 months, 12 months) ensuring ongoing safety and school integration.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterStatus === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            All ({allFollowUps.length})
          </button>
          <button
            onClick={() => setFilterStatus('Pending')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterStatus === 'Pending' ? 'bg-amber-500 text-white shadow-2xs' : 'text-stone-600'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('Overdue')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterStatus === 'Overdue' ? 'bg-rose-600 text-white shadow-2xs' : 'text-stone-600'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilterStatus('Completed')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterStatus === 'Completed' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-stone-600'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Follow-up Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-stone-400">
            No follow-ups found for the selected status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Child ID & Name</th>
                  <th className="py-3 px-3">Milestone & Type</th>
                  <th className="py-3 px-3">Scheduled Date</th>
                  <th className="py-3 px-3">Contact Method</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Observations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(({ child, followUp }) => (
                  <tr key={followUp.id} className="hover:bg-stone-50/70 transition-colors">
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
                            className="font-bold text-stone-900 hover:text-red-600 transition-colors text-left"
                          >
                            {child.name}
                          </button>
                          <div className="text-[11px] font-mono text-stone-400">{child.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{followUp.milestone}</div>
                      <div className="text-[10px] text-stone-500">{followUp.type}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-800">
                        {formatDate(followUp.scheduledDate)}
                      </div>
                      {followUp.completedDate && (
                        <div className="text-[10px] text-emerald-600">
                          Done: {formatDate(followUp.completedDate)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 font-medium text-stone-700">
                      {followUp.contactMethod || 'Home Visit'}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          followUp.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : followUp.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {followUp.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-xs truncate text-stone-600">
                      {followUp.officerObservation || 'Pending visit notes'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {followUp.status !== 'Completed' && (
                          <button
                            onClick={() => setQuickActionState({ open: true, type: 'followup', child })}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => openChildProfileById(child.id)}
                          className="px-2.5 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors"
                        >
                          Case
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
