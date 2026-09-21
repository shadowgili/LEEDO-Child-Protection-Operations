import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Search,
  Users,
  MapPin,
  Phone,
  PlusCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';
import { FamilyTracingStatus } from '../../types/leedo';

export const FamilyTracingView: React.FC = () => {
  const { visibleChildren, openChildProfileById, setQuickActionState } = useLeedo();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const tracingStatuses: FamilyTracingStatus[] = [
    'Not Started',
    'In Progress',
    'Family Located',
    'Family Unreachable',
    'Closed',
  ];

  const filtered = visibleChildren.filter(c => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      (c.addressIfKnown && c.addressIfKnown.toLowerCase().includes(q)) ||
      (c.familyInfo?.guardianName && c.familyInfo.guardianName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || c.familyTracingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stage pipeline counts
  const countByStatus = (status: FamilyTracingStatus) =>
    visibleChildren.filter(c => c.familyTracingStatus === status).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Family Tracing & Guardianship Search
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Systematic tracing of biological relatives, village origin checks, police inquiry cross-checks, and home safety assessments.
          </p>
        </div>
      </div>

      {/* Stage Pipeline Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {tracingStatuses.map(status => {
          const count = countByStatus(status);
          const isSelected = statusFilter === status;
          return (
            <div
              key={status}
              onClick={() => setStatusFilter(isSelected ? 'all' : status)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-red-600 bg-red-50/40 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="text-[11px] font-semibold text-stone-500 truncate">{status}</div>
              <div className="text-xl font-black text-stone-900 mt-0.5">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by child, origin location, guardian name..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs font-semibold text-red-600 hover:underline shrink-0"
          >
            Show All Statuses
          </button>
        )}
      </div>

      {/* Tracing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(child => {
          const latestAttempt = child.tracingAttempts[0];
          return (
            <div
              key={child.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                      alt={child.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4
                        onClick={() => openChildProfileById(child.id)}
                        className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {child.name}
                      </h4>
                      <div className="text-[11px] font-mono text-red-600 font-bold">{child.id}</div>
                      <div className="text-[11px] text-stone-500">
                        {child.gender}, ~{child.estimatedAge} yrs • Shelter: {child.currentShelter || 'None'}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      child.familyTracingStatus === 'Family Located'
                        ? 'bg-emerald-100 text-emerald-800'
                        : child.familyTracingStatus === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {child.familyTracingStatus}
                  </span>
                </div>

                <div className="mt-3 text-xs space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <div>
                    <span className="text-stone-400 font-medium">Reported Origin:</span>{' '}
                    <span className="font-semibold text-stone-800">{child.addressIfKnown || 'Unknown'}</span>
                  </div>

                  {child.familyInfo?.guardianName && (
                    <div>
                      <span className="text-stone-400 font-medium">Guardian:</span>{' '}
                      <span className="font-semibold text-stone-800">
                        {child.familyInfo.guardianName} ({child.familyInfo.relationshipWithChild || 'Guardian'})
                      </span>
                      {child.familyInfo.phone && <span> • 📞 {child.familyInfo.phone}</span>}
                    </div>
                  )}

                  {latestAttempt ? (
                    <div className="pt-1 text-[11px] text-stone-600 border-t border-stone-200/60">
                      <strong>Latest Attempt ({formatDate(latestAttempt.date)}):</strong>{' '}
                      {latestAttempt.notes} (Result: <em>{latestAttempt.result}</em>)
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-400 italic">No formal tracing attempts logged yet.</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-[11px] text-stone-400">
                  {child.tracingAttempts.length} attempt(s) recorded
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuickActionState({ open: true, type: 'tracing', child })}
                    className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors"
                  >
                    + Log Attempt
                  </button>

                  <button
                    onClick={() => openChildProfileById(child.id)}
                    className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
