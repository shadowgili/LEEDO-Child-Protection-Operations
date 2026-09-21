import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  LayoutGrid,
  List,
  MoreVertical,
  Calendar,
  ClockAlert,
  ArrowRight,
  ShieldAlert,
  Home,
  CheckCircle2,
  Repeat,
  ExternalLink,
  AlertOctagon,
} from 'lucide-react';
import { getSixWeekStatus, formatDate, exportToCSV, getDaysInShelter } from '../../utils/calculations';
import { CaseStatus } from '../../types/leedo';

export const ChildList: React.FC = () => {
  const {
    visibleChildren,
    openChildProfileById,
    setIsRegistrationModalOpen,
    setQuickActionState,
    shelters,
  } = useLeedo();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shelterFilter, setShelterFilter] = useState<string>('all');
  const [sixWeekFilter, setSixWeekFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  // Filter logic
  const filteredChildren = visibleChildren.filter(c => {
    // Search
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      (c.nickname && c.nickname.toLowerCase().includes(q)) ||
      (c.gdNumber && c.gdNumber.toLowerCase().includes(q)) ||
      (c.assignedStaff && c.assignedStaff.toLowerCase().includes(q)) ||
      (c.rescueLocation && c.rescueLocation.toLowerCase().includes(q)) ||
      (c.familyInfo?.phone && c.familyInfo.phone.includes(q));

    // Status filter
    const matchesStatus = statusFilter === 'all' || c.caseStatus === statusFilter;

    // Shelter filter
    const matchesShelter = shelterFilter === 'all' || c.currentShelter === shelterFilter;

    // Gender filter
    const matchesGender = genderFilter === 'all' || c.gender === genderFilter;

    // 6-week filter
    const sixWeekStatus = getSixWeekStatus(c).status;
    let matchesSixWeek = true;
    if (sixWeekFilter === 'exceeded') {
      matchesSixWeek = sixWeekStatus === 'exceeded' || sixWeekStatus === 'completed';
    } else if (sixWeekFilter === 'approaching') {
      matchesSixWeek = sixWeekStatus === 'approaching';
    }

    return matchesSearch && matchesStatus && matchesShelter && matchesGender && matchesSixWeek;
  });

  const handleExportCSV = () => {
    const exportData = filteredChildren.map(c => ({
      'Child ID': c.id,
      'Full Name': c.name,
      'Nickname': c.nickname || '',
      'Gender': c.gender,
      'Estimated Age': c.estimatedAge,
      'Current Shelter': c.currentShelter || '',
      'Days in Shelter': getDaysInShelter(c),
      'Case Status': c.caseStatus,
      'Family Tracing Status': c.familyTracingStatus,
      'Rescue Date': c.rescueDate,
      'Rescue Location': c.rescueLocation,
      'Assigned Staff': c.assignedStaff,
      'GD Number': c.gdNumber || '',
      'Police Station': c.policeStation || '',
      'Guardian Name': c.familyInfo?.guardianName || '',
      'Guardian Contact': c.familyInfo?.phone || '',
    }));
    exportToCSV(exportData, `LEEDO_Child_Cases_${new Date().toISOString().slice(0, 10)}`);
  };

  const statusOptions: CaseStatus[] = [
    'New Rescue',
    'Initial Assessment',
    'Shelter Stay',
    'Family Tracing',
    'Family Located',
    'Family Assessment',
    'Ready for Reintegration',
    'Reintegrated',
    'Government Shelter Referral',
    'Referral Follow-up',
    'Left Without Notice',
    'Case Closed',
    'Transferred',
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Child Protection & Case Management Registry
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Displaying {filteredChildren.length} of {visibleChildren.length} protected children records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Rescue</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Child ID, Name, GD, Area, Case Worker..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 self-end md:self-auto bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-100 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">Case Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Case Statuses</option>
              {statusOptions.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">Shelter Facility</label>
            <select
              value={shelterFilter}
              onChange={e => setShelterFilter(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Shelters</option>
              {shelters.map(sh => (
                <option key={sh} value={sh}>
                  {sh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">6-Week Shelter Stay</label>
            <select
              value={sixWeekFilter}
              onChange={e => setSixWeekFilter(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Shelter Durations</option>
              <option value="exceeded">&gt; 6 Weeks Stay (&gt;42 Days)</option>
              <option value="approaching">Approaching 6 Weeks (35-41 Days)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">Gender</label>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Children Results */}
      {filteredChildren.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-stone-200 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800 text-base">No Child Cases Match Your Filters</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try resetting search keywords or adjust the status and shelter filter dropdowns.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setShelterFilter('all');
              setSixWeekFilter('all');
              setGenderFilter('all');
            }}
            className="mt-4 px-4 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Child ID & Name</th>
                  <th className="py-3 px-3">Age / Gender</th>
                  <th className="py-3 px-3">Shelter & Duration</th>
                  <th className="py-3 px-3">Case Status</th>
                  <th className="py-3 px-3">Family Tracing</th>
                  <th className="py-3 px-3">Case Worker</th>
                  <th className="py-3 px-3">Police GD</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredChildren.map(child => {
                  const sixWeek = getSixWeekStatus(child);
                  const daysInShelter = getDaysInShelter(child);

                  return (
                    <tr
                      key={child.id}
                      onClick={() => openChildProfileById(child.id)}
                      className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                            alt={child.name}
                            className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors">
                              {child.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                              <span className="font-bold text-red-600 bg-red-50 px-1 rounded">
                                {child.id}
                              </span>
                              {child.nickname && <span>({child.nickname})</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-stone-800">{child.gender}</span>
                        <div className="text-[11px] text-stone-500">~{child.estimatedAge} years</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-900">
                          {child.currentShelter || 'No Shelter'}
                        </div>
                        {child.shelterAdmissionDate ? (
                          <div className="mt-0.5">
                            <span className={sixWeek.badgeClass}>
                              {daysInShelter} days
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-stone-400">
                            Rescued: {formatDate(child.rescueDate)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            child.caseStatus === 'Reintegrated'
                              ? 'bg-emerald-100 text-emerald-800'
                              : child.caseStatus === 'Ready for Reintegration'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : child.caseStatus === 'Left Without Notice'
                              ? 'bg-red-100 text-red-800 font-bold'
                              : child.caseStatus === 'Government Shelter Referral'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {child.caseStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-800">{child.familyTracingStatus}</div>
                        <div className="text-[10px] text-stone-400">
                          {child.tracingAttempts.length} attempt(s)
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-800">{child.assignedStaff}</div>
                        <div className="text-[10px] text-stone-500">{child.rescueArea || 'Dhaka'}</div>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-stone-600">
                        {child.gdNumber ? (
                          <div>
                            <span className="font-semibold text-stone-800">{child.gdNumber}</span>
                            <div className="text-[10px] text-stone-400">{child.policeStation}</div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openChildProfileById(child.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                          >
                            Profile
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
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChildren.map(child => {
            const sixWeek = getSixWeekStatus(child);
            const daysInShelter = getDaysInShelter(child);

            return (
              <div
                key={child.id}
                onClick={() => openChildProfileById(child.id)}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:border-red-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={child.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                        alt={child.name}
                        className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors">
                          {child.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-red-600">{child.id}</div>
                        <div className="text-[11px] text-stone-500">
                          {child.gender}, ~{child.estimatedAge} yrs
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        child.caseStatus === 'Reintegrated'
                          ? 'bg-emerald-100 text-emerald-800'
                          : child.caseStatus === 'Ready for Reintegration'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : child.caseStatus === 'Left Without Notice'
                          ? 'bg-red-100 text-red-800 font-bold'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {child.caseStatus}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Shelter:</span>
                      <span className="font-medium text-stone-800">{child.currentShelter || 'None'}</span>
                    </div>

                    {child.shelterAdmissionDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Shelter Stay:</span>
                        <span className={sixWeek.badgeClass}>{daysInShelter} days</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Family Tracing:</span>
                      <span className="font-semibold text-stone-700">{child.familyTracingStatus}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Case Worker:</span>
                      <span className="text-stone-800">{child.assignedStaff}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {child.gdNumber ? `GD: ${child.gdNumber}` : 'No GD'}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openChildProfileById(child.id);
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>Full Case Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
