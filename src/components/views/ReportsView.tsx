import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
  Home,
  Repeat,
  ExternalLink,
  ClockAlert,
  AlertOctagon,
  TrendingUp,
} from 'lucide-react';
import { exportToCSV, formatDate, getSixWeekStatus, getDaysInShelter } from '../../utils/calculations';

export const ReportsView: React.FC = () => {
  const { children, shelters, openChildProfileById } = useLeedo();

  const [reportType, setReportType] = useState<string>('six_weeks');
  const [shelterFilter, setShelterFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  // Filters
  const filteredChildren = children.filter(c => {
    const matchesShelter = shelterFilter === 'all' || c.currentShelter === shelterFilter;
    const matchesGender = genderFilter === 'all' || c.gender === genderFilter;
    return matchesShelter && matchesGender;
  });

  // Calculate stats for reports
  const totalRescued = filteredChildren.length;
  const inShelter = filteredChildren.filter(c => c.shelterStatus === 'Admitted').length;
  const over6Weeks = filteredChildren.filter(c => {
    const s = getSixWeekStatus(c);
    return s.status === 'exceeded' || s.status === 'completed';
  }).length;
  const familyLocated = filteredChildren.filter(c => c.familyTracingStatus === 'Family Located').length;
  const reintegrated = filteredChildren.filter(c => c.caseStatus === 'Reintegrated').length;
  const referred = filteredChildren.filter(c => c.caseStatus === 'Government Shelter Referral' || c.caseStatus === 'Referral Follow-up').length;
  const lwn = filteredChildren.filter(c => c.caseStatus === 'Left Without Notice').length;

  const handleExport = () => {
    let rows: any[] = [];
    let filename = `LEEDO_${reportType}_Report`;

    if (reportType === 'six_weeks') {
      rows = filteredChildren
        .filter(c => {
          const s = getSixWeekStatus(c);
          return s.status === 'exceeded' || s.status === 'completed' || s.status === 'approaching';
        })
        .map(c => ({
          'Child ID': c.id,
          'Child Name': c.name,
          'Gender': c.gender,
          'Estimated Age': c.estimatedAge,
          'Shelter': c.currentShelter || 'None',
          'Admission Date': c.shelterAdmissionDate || '',
          'Days in Shelter': getDaysInShelter(c),
          '6-Week Status': getSixWeekStatus(c).label,
          'Case Worker': c.assignedStaff,
          'Family Tracing': c.familyTracingStatus,
        }));
    } else if (reportType === 'reintegration') {
      rows = filteredChildren
        .filter(c => c.caseStatus === 'Reintegrated' || c.caseStatus === 'Ready for Reintegration')
        .map(c => ({
          'Child ID': c.id,
          'Child Name': c.name,
          'Status': c.caseStatus,
          'Handover Date': c.reintegrationRecord?.reintegrationDate || 'Pending',
          'Guardian': c.reintegrationRecord?.guardianName || c.familyInfo?.guardianName || 'Parent',
          'Relationship': c.reintegrationRecord?.relationshipWithChild || c.familyInfo?.relationshipWithChild || '',
          'District': c.familyInfo?.district || 'Dhaka',
          'Case Worker': c.assignedStaff,
        }));
    } else {
      // Standard full export
      rows = filteredChildren.map(c => ({
        'Child ID': c.id,
        'Name': c.name,
        'Gender': c.gender,
        'Age': c.estimatedAge,
        'Shelter': c.currentShelter || '',
        'Case Status': c.caseStatus,
        'Rescue Date': c.rescueDate,
        'Rescue Location': c.rescueLocation,
        'GD Number': c.gdNumber || '',
        'Tracing Status': c.familyTracingStatus,
        'Case Worker': c.assignedStaff,
      }));
    }

    exportToCSV(rows, filename);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Child Safeguarding Reporting & Donor Analytics
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time compliance reports for Head Office, Ministry of Social Welfare (DSS), and international donor partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selection & Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Select Report Template</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-2 bg-white font-semibold"
            >
              <option value="six_weeks">6-Week Shelter Stay Protocol Compliance Report</option>
              <option value="monthly_rescue">Monthly Child Rescue & Intake Summary</option>
              <option value="shelter_occupancy">Shelter Facility Occupancy & Bed Distribution</option>
              <option value="tracing">Family Tracing Progress & Origin Mapping</option>
              <option value="reintegration">Family Reintegration & Handover Report</option>
              <option value="referral">Government DSS Referral & Institutional Care Report</option>
              <option value="lwn">Critical Incidents / Left Without Notice Report</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Shelter Facility</label>
            <select
              value={shelterFilter}
              onChange={e => setShelterFilter(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-2 bg-white"
            >
              <option value="all">All Shelters (Combined)</option>
              {shelters.map(sh => (
                <option key={sh} value={sh}>
                  {sh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Gender Breakdown</label>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-2 bg-white"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards for Report */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
        <div className="bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Rescues</span>
          <div className="text-xl font-black text-stone-900 mt-1">{totalRescued}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">In Shelter</span>
          <div className="text-xl font-black text-stone-900 mt-1">{inShelter}</div>
        </div>
        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
          <span className="text-[11px] text-rose-800 uppercase font-bold">&gt; 6 Weeks</span>
          <div className="text-xl font-black text-rose-600 mt-1">{over6Weeks}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Tracing Found</span>
          <div className="text-xl font-black text-stone-900 mt-1">{familyLocated}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Reintegrated</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{reintegrated}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Gov Referrals</span>
          <div className="text-xl font-black text-purple-600 mt-1">{referred}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Left W/O</span>
          <div className="text-xl font-black text-rose-700 mt-1">{lwn}</div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden print:border-none">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-base">
            Generated Output: {reportType.replace('_', ' ').toUpperCase()} ({filteredChildren.length} records)
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Date Generated: {new Date().toLocaleDateString('en-GB')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-4">Child ID</th>
                <th className="py-2.5 px-3">Child Name</th>
                <th className="py-2.5 px-3">Age / Gender</th>
                <th className="py-2.5 px-3">Shelter</th>
                <th className="py-2.5 px-3">Stay Days</th>
                <th className="py-2.5 px-3">Case Status</th>
                <th className="py-2.5 px-3">Tracing Status</th>
                <th className="py-2.5 px-3">Assigned Staff</th>
                <th className="py-2.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredChildren.map(child => {
                const days = getDaysInShelter(child);
                const sixWeek = getSixWeekStatus(child);
                return (
                  <tr key={child.id} className="hover:bg-stone-50/70">
                    <td className="py-2.5 px-4 font-mono font-bold text-stone-900">{child.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{child.name}</td>
                    <td className="py-2.5 px-3">{child.gender}, ~{child.estimatedAge}y</td>
                    <td className="py-2.5 px-3 font-medium text-stone-800">{child.currentShelter || 'None'}</td>
                    <td className="py-2.5 px-3">
                      {child.shelterAdmissionDate ? (
                        <span className={sixWeek.badgeClass}>{days}d</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-stone-100 font-medium">
                        {child.caseStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{child.familyTracingStatus}</td>
                    <td className="py-2.5 px-3 font-medium text-stone-700">{child.assignedStaff}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => openChildProfileById(child.id)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Inspect
                      </button>
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
