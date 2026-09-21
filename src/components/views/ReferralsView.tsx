import React from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';

export const ReferralsView: React.FC = () => {
  const { children, openChildProfileById, setQuickActionState } = useLeedo();

  const referredChildren = children.filter(
    c => c.caseStatus === 'Government Shelter Referral' || c.caseStatus === 'Referral Follow-up' || c.referralRecord
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Government Shelter & DSS Service Referrals
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Statutory transfers to Department of Social Services (DSS), Sheikh Russell Centers, and specialized child care institutions.
          </p>
        </div>
      </div>

      {/* Referrals List */}
      {referredChildren.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-stone-200 shadow-xs text-stone-400 text-xs">
          No children currently under government shelter referrals.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {referredChildren.map(child => {
            const ref = child.referralRecord;
            return (
              <div
                key={child.id}
                className="bg-white p-5 rounded-xl border border-purple-200 shadow-xs space-y-4 flex flex-col justify-between"
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
                          className="font-bold text-stone-900 text-sm hover:text-purple-700 transition-colors cursor-pointer"
                        >
                          {child.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-purple-700">{child.id}</div>
                        <div className="text-[11px] text-stone-500">
                          {child.gender}, ~{child.estimatedAge} yrs
                        </div>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-purple-100 text-purple-800 border border-purple-300">
                      {child.caseStatus}
                    </span>
                  </div>

                  {ref && (
                    <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-200/80 text-xs space-y-1.5">
                      <div>
                        <span className="text-stone-400 font-medium">Referred Agency:</span>{' '}
                        <strong className="text-stone-900">{ref.referralOrganization}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Facility / Center:</span>{' '}
                        <strong className="text-stone-900">{ref.shelterOrServiceName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Referral Date:</span>{' '}
                        <span>{formatDate(ref.referralDate)}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Contact Person:</span>{' '}
                        <span>{ref.contactPerson} ({ref.contactNumber})</span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-medium">Statutory Reason:</span>{' '}
                        <p className="text-stone-700 mt-0.5">{ref.reasonForReferral}</p>
                      </div>

                      <div className="pt-1 text-[11px] text-purple-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Documents handed over: Social Inquiry Report, Police GD, Medical cert</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="text-[11px] text-stone-400">
                    Staff: {child.assignedStaff}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuickActionState({ open: true, type: 'followup', child })}
                      className="px-2.5 py-1 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-md transition-colors"
                    >
                      + Referral Check-in
                    </button>
                    <button
                      onClick={() => openChildProfileById(child.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-md transition-colors"
                    >
                      Full Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
