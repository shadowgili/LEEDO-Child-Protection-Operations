import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Settings,
  Database,
  RefreshCw,
  ShieldCheck,
  Building,
  Wifi,
  HardDrive,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { children, auditLogs, resetToSampleData } = useLeedo();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all demo children, case files, and audit logs back to initial LEEDO seed dataset?')) {
      resetToSampleData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            System Configuration & Data Storage
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational parameters, offline field cache settings, and database management for LEEDO Child Protection System.
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Database successfully re-seeded to factory LEEDO initial dataset.</span>
        </div>
      )}

      {/* Organization Information */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Building className="w-4 h-4 text-red-600" />
          <span>Organization Profile & Mandate</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-stone-400 font-semibold mb-1">Organization Name</label>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 font-bold text-stone-900">
              LEEDO (Local Education and Economic Development Organization)
            </div>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1">Head Office Location</label>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800">
              Dhaka, Bangladesh
            </div>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1">Child ID Generation Scheme</label>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 font-mono text-stone-800">
              LEEDO-[YEAR]-[SEQUENCE] (e.g. LEEDO-2026-0001)
            </div>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1">6-Week Threshold Alert Rule</label>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800">
              42 Days (Approaching warning at 35 Days)
            </div>
          </div>
        </div>
      </div>

      {/* Storage & Re-seed Section */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-stone-700" />
          <span>Local Storage Persistence & Maintenance</span>
        </h3>

        <p className="text-xs text-stone-600">
          Current state holds <strong>{children.length}</strong> children records and{' '}
          <strong>{auditLogs.length}</strong> security audit transactions persisted in local browser storage.
        </p>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="font-bold text-stone-900 text-xs">Reset to Original Seed Data</div>
            <div className="text-[11px] text-stone-400">
              Restores standard sample cases across both shelters, various 6-week durations, and follow-ups.
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
