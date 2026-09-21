import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Repeat,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';

export const ReintegrationView: React.FC = () => {
  const { children, openChildProfileById, setQuickActionState } = useLeedo();
  const [filterType, setFilterType] = useState<'all' | 'reintegrated' | 'ready'>('all');

  const relevantChildren = children.filter(
    c => c.caseStatus === 'Reintegrated' || c.caseStatus === 'Ready for Reintegration'
  );

  const displayedChildren = relevantChildren.filter(c => {
    if (filterType === 'reintegrated') return c.caseStatus === 'Reintegrated';
    if (filterType === 'ready') return c.caseStatus === 'Ready for Reintegration';
    return true;
  });

  const reintegratedCount = children.filter(c => c.caseStatus === 'Reintegrated').length;
  const readyCount = children.filter(c => c.caseStatus === 'Ready for Reintegration').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Family Reintegration & Custody Restoration
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Safely returning street-rescued children to verified biological families with documented handover deeds and structured follow-up monitoring.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterType === 'all' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600'
            }`}
          >
            All ({relevantChildren.length})
          </button>
          <button
            onClick={() => setFilterType('reintegrated')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterType === 'reintegrated' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-stone-600'
            }`}
          >
            Reintegrated ({reintegratedCount})
          </button>
          <button
            onClick={() => setFilterType('ready')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterType === 'ready' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600'
            }`}
          >
            Ready for Handover ({readyCount})
          </button>
        </div>
      </div>

      {/* Grid of Reintegration Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedChildren.map(child => {
          const isReintegrated = child.caseStatus === 'Reintegrated';
          const rec = child.reintegrationRecord;

          return (
            <div
              key={child.id}
              className={`p-5 rounded-xl border shadow-xs transition-all space-y-4 flex flex-col justify-between ${
                isReintegrated
                  ? 'bg-emerald-50/20 border-emerald-200'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                      alt={child.name}
                      className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4
                        onClick={() => openChildProfileById(child.id)}
                        className="font-bold text-stone-900 text-sm hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {child.name}
                      </h4>
                      <div className="font-mono text-xs font-bold text-emerald-700">{child.id}</div>
                      <div className="text-[11px] text-stone-500">
                        {child.gender}, ~{child.estimatedAge} yrs
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      isReintegrated
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {child.caseStatus}
                  </span>
                </div>

                {/* Handover or Family Details */}
                <div className="p-3 bg-white rounded-lg border border-stone-200/80 text-xs space-y-1.5">
                  {rec ? (
                    <>
                      <div>
                        <span className="text-stone-400 font-medium">Handover Date:</span>{' '}
                        <strong className="text-stone-900">{formatDate(rec.reintegrationDate)}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Custody Given To:</span>{' '}
                        <strong className="text-stone-900">{rec.guardianName}</strong> ({rec.relationshipWithChild})
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Handover Location:</span>{' '}
                        <span className="text-stone-700">{rec.handoverLocation}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Reintegration Plan:</span>{' '}
                        <span className="text-stone-700">{rec.reintegrationPlan}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-amber-800 font-semibold">
                        Family Located & Home Assessment Completed
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Guardian:</span>{' '}
                        <strong>{child.familyInfo?.guardianName || 'Parent Verified'}</strong> (
                        {child.familyInfo?.relationshipWithChild || 'Guardian'})
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Contact:</span>{' '}
                        <span>{child.familyInfo?.phone || 'Verified on file'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">District:</span>{' '}
                        <span>{child.familyInfo?.district || child.addressIfKnown || 'Dhaka'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Follow-up indicators for reintegrated */}
                {isReintegrated && (
                  <div className="text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Follow-up Milestones:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {child.followUps.map(fu => (
                        <span
                          key={fu.id}
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            fu.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : fu.status === 'Overdue'
                              ? 'bg-rose-100 text-rose-800 font-bold'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {fu.milestone}: {fu.status}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <span className="text-[11px] text-stone-400">
                  Worker: {child.assignedStaff}
                </span>

                <div className="flex items-center gap-2">
                  {!isReintegrated ? (
                    <button
                      onClick={() => setQuickActionState({ open: true, type: 'reintegration', child })}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Execute Handover</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setQuickActionState({ open: true, type: 'followup', child })}
                      className="px-2.5 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors flex items-center gap-1"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Log Follow-up</span>
                    </button>
                  )}

                  <button
                    onClick={() => openChildProfileById(child.id)}
                    className="px-2.5 py-1 text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-md transition-colors"
                  >
                    View File
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
