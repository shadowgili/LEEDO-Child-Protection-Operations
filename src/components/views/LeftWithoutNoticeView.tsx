import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Search,
  Calendar,
  Clock,
  Home,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';

export const LeftWithoutNoticeView: React.FC = () => {
  const { children, openChildProfileById, recoverChild, currentUser } = useLeedo();
  const [selectedChildForRecovery, setSelectedChildForRecovery] = useState<string | null>(null);
  const [recoveryDetails, setRecoveryDetails] = useState<string>('');

  const lwnChildren = children.filter(c => c.caseStatus === 'Left Without Notice');

  const handleConfirmRecovery = (childId: string) => {
    if (!recoveryDetails.trim()) return;
    const child = children.find(c => c.id === childId);
    recoverChild(childId, recoveryDetails, child?.currentShelter || 'Kamalapur Shelter');
    setSelectedChildForRecovery(null);
    setRecoveryDetails('');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-rose-900 tracking-tight">
              Left Without Notice / Critical Missing Child Register
            </h2>
            <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {lwnChildren.length} Active Incidents
            </span>
          </div>
          <p className="text-xs text-rose-700 mt-1 max-w-2xl">
            Protocol strictly preserves existing Child ID and complete case history. If the child is relocated, staff can immediately mark them recovered and resume shelter care without duplicate IDs.
          </p>
        </div>
      </div>

      {/* Grid of Incidents */}
      {lwnChildren.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-stone-200 shadow-xs text-stone-400 text-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-stone-700">No active "Left Without Notice" incidents.</p>
          <p className="mt-0.5">All protected children are accounted for in shelters or safely reintegrated.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lwnChildren.map(child => {
            const inc = child.leftWithoutNoticeRecord;
            return (
              <div
                key={child.id}
                className="bg-white p-5 rounded-xl border-2 border-rose-300 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                        alt={child.name}
                        className="w-12 h-12 rounded-full object-cover border border-rose-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4
                          onClick={() => openChildProfileById(child.id)}
                          className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors cursor-pointer"
                        >
                          {child.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-rose-600">{child.id}</div>
                        <div className="text-[11px] text-stone-500">
                          {child.gender}, ~{child.estimatedAge} yrs • Last at: {child.currentShelter}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                      Left Without Notice
                    </span>
                  </div>

                  {inc ? (
                    <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span><strong>Departure Date:</strong> {formatDate(inc.date)}</span>
                        <span><strong>Time:</strong> {inc.time}</span>
                      </div>

                      <div>
                        <strong>Circumstances:</strong>
                        <p className="text-stone-700 mt-0.5">{inc.circumstances}</p>
                      </div>

                      <div>
                        <strong>Immediate Search Actions Taken:</strong>
                        <p className="text-stone-700 mt-0.5">{inc.immediateActionsTaken}</p>
                      </div>

                      <div className="pt-1 border-t border-rose-200 flex items-center justify-between text-[11px]">
                        <span>
                          Police GD: <strong>{inc.gdNumber || 'Informally notified'}</strong> ({inc.policeStation || 'N/A'})
                        </span>
                        <span className="text-stone-500">Staff: {inc.recordedBy}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-stone-50 text-xs text-stone-500 rounded">
                      Status marked as Left Without Notice. Search in progress.
                    </div>
                  )}
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <button
                    onClick={() => openChildProfileById(child.id)}
                    className="text-xs font-semibold text-stone-700 hover:text-stone-900"
                  >
                    View Historical Dossier →
                  </button>

                  <button
                    onClick={() => setSelectedChildForRecovery(child.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Child Found / Recovered</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recovery Modal */}
      {selectedChildForRecovery && (
        <div className="fixed inset-0 z-60 bg-stone-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Restore Child to Active Protection</span>
            </h3>
            <p className="text-xs text-stone-600">
              Child ID: <strong>{selectedChildForRecovery}</strong>. Enter the recovery location, retrieval time, and physical condition. The system will retain all existing medical, counseling, and tracing history.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Recovery Details & Immediate Safety Actions *
              </label>
              <textarea
                rows={3}
                required
                value={recoveryDetails}
                onChange={e => setRecoveryDetails(e.target.value)}
                placeholder="e.g. Child located by outreach officer near Sadarghat terminal. Fed, health inspected, safely brought back to Kamalapur Shelter."
                className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedChildForRecovery(null)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmRecovery(selectedChildForRecovery)}
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
