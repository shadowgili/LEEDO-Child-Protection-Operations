import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  ScrollText,
  ShieldCheck,
  Search,
  Filter,
  User,
  Clock,
  Download,
  Lock,
} from 'lucide-react';
import { formatDate, exportToCSV } from '../../utils/calculations';

export const AuditView: React.FC = () => {
  const { auditLogs, openChildProfileById } = useLeedo();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      (log.childId && log.childId.toLowerCase().includes(q)) ||
      log.details.toLowerCase().includes(q);

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExportAudit = () => {
    exportToCSV(
      filteredLogs.map(l => ({
        ID: l.id,
        Timestamp: l.timestamp,
        User: l.userName,
        Role: l.userRole,
        Action: l.action,
        'Child ID': l.childId || 'N/A',
        Details: l.details,
        'IP Address': l.ipAddress || 'Internal',
      })),
      'LEEDO_Security_Audit_Trail'
    );
  };

  const actionTypes = Array.from(new Set(auditLogs.map(l => l.action)));

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Security Audit Trail & Safeguarding Logs
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Immutable Ledger</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Every creation, status update, case note, medical record, and handover is permanently recorded with user identity, timestamp, and audit details.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-stone-500" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by user, action, child ID, or detail..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="text-xs border border-stone-300 rounded-lg p-2 bg-white focus:outline-none sm:w-48"
        >
          <option value="all">All Action Types</option>
          {actionTypes.map(act => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Actor / User</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Target Child</th>
                <th className="py-3 px-4">Details & Payload Description</th>
                <th className="py-3 px-3">Network IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50/70 font-sans">
                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap text-[11px]">
                    {formatDate(log.timestamp)} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{log.userName}</div>
                    <div className="text-[10px] text-stone-400 capitalize">
                      {log.userRole.replace('_', ' ')}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('REINTEGRATION')
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action.includes('LEFT_WITHOUT_NOTICE')
                          ? 'bg-rose-100 text-rose-800'
                          : log.action.includes('CREATE')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    {log.childId ? (
                      <button
                        onClick={() => openChildProfileById(log.childId!)}
                        className="font-mono font-bold text-red-600 hover:underline"
                      >
                        {log.childId}
                      </button>
                    ) : (
                      <span className="text-stone-400">System</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-stone-700 max-w-md">
                    {log.details}
                  </td>

                  <td className="py-3 px-3 font-mono text-[10px] text-stone-400">
                    {log.ipAddress || '192.168.1.10'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
