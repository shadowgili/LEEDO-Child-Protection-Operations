import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  HeartPulse,
  Brain,
  Search,
  PlusCircle,
  Calendar,
  Lock,
  User,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';
import { Child } from '../../types/leedo';

interface ClinicalViewProps {
  mode: 'health' | 'counseling';
}

export const ClinicalView: React.FC<ClinicalViewProps> = ({ mode }) => {
  const { children, openChildProfileById, setQuickActionState } = useLeedo();
  const [searchTerm, setSearchTerm] = useState('');

  const isHealth = mode === 'health';

  const relevantChildren = children.filter(child => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q || child.name.toLowerCase().includes(q) || child.id.toLowerCase().includes(q);

    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            {isHealth
              ? 'Medical Intake, Health Screenings & Clinical Logs'
              : 'Psychosocial Support, Trauma Counseling & Mental Health'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHealth
              ? 'Panel doctor examinations, growth milestones, vaccinations, and chronic medical monitoring.'
              : 'Confidential psychiatric evaluations, art therapy logs, and trauma recovery sessions.'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by child name or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relevantChildren.map(child => {
          const records = isHealth ? child.healthRecords : child.counselingRecords;
          const latestRecord: any = records && records[0];

          return (
            <div
              key={child.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                      alt={child.name}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4
                        onClick={() => openChildProfileById(child.id)}
                        className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {child.name}
                      </h4>
                      <div className="font-mono text-xs font-bold text-red-600">{child.id}</div>
                      <div className="text-[11px] text-stone-500">
                        {child.gender}, ~{child.estimatedAge} yrs • Shelter: {child.currentShelter || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-700">
                    {records ? records.length : 0} {isHealth ? 'Checkups' : 'Sessions'}
                  </span>
                </div>

                {/* Latest Clinical Note Preview */}
                <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs space-y-1">
                  {latestRecord ? (
                    <>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-stone-700">
                        <span>{formatDate(latestRecord.date)}</span>
                        {isHealth ? (
                          <span className="text-emerald-700">Condition: {latestRecord.healthCondition}</span>
                        ) : (
                          <span className="text-purple-700">{latestRecord.counselingType}</span>
                        )}
                      </div>

                      {isHealth ? (
                        <>
                          {latestRecord.illness && (
                            <div>
                              <span className="text-stone-400">Diagnosis:</span>{' '}
                              <strong>{latestRecord.illness}</strong>
                            </div>
                          )}
                          {latestRecord.treatment && (
                            <div>
                              <span className="text-stone-400">Treatment:</span>{' '}
                              <span>{latestRecord.treatment}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-stone-400">Focus:</span>{' '}
                            <strong>{latestRecord.mainConcern || 'General adjustment counseling'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400">Response:</span>{' '}
                            <span>{latestRecord.childResponse}</span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-stone-400 italic text-[11px]">
                      No clinical entries recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  onClick={() =>
                    setQuickActionState({
                      open: true,
                      type: isHealth ? 'health' : 'counseling',
                      child,
                    })
                  }
                  className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors"
                >
                  + Add {isHealth ? 'Health Check' : 'Session'}
                </button>

                <button
                  onClick={() => openChildProfileById(child.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Full Dossier →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
