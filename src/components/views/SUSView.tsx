import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  GraduationCap,
  Users,
  Calendar,
  PlusCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  BookOpen,
  Apple,
  Receipt,
  Download,
} from 'lucide-react';
import { SUSAttendanceRecord, LeedoLocation } from '../../types/leedo';

export const SUSView: React.FC = () => {
  const { susRecords, addSUSRecord, currentUser } = useLeedo();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const susLocations: LeedoLocation[] = [
    'Airport',
    'Mirpur',
    'Tejgoan',
    'RayerBazar',
    'Kamalapur',
    'Sadarghat',
    'Shambazar',
  ];

  // Filter records
  const filteredRecords = susRecords.filter(r => {
    if (selectedLocation === 'All') return true;
    return r.location === selectedLocation;
  });

  const totalChildrenServed = susRecords.reduce((sum, r) => sum + r.totalStudentsAttended, 0);
  const totalBoys = susRecords.reduce((sum, r) => sum + r.boysCount, 0);
  const totalGirls = susRecords.reduce((sum, r) => sum + r.girlsCount, 0);

  // Form state
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [newLocation, setNewLocation] = useState<LeedoLocation>(
    (susLocations.includes(currentUser.location as any) ? currentUser.location : 'Kamalapur') as LeedoLocation
  );
  const [totalStudents, setTotalStudents] = useState<number>(30);
  const [boysCount, setBoysCount] = useState<number>(18);
  const [girlsCount, setGirlsCount] = useState<number>(12);
  const [learningTopic, setLearningTopic] = useState<string>('Basic Bengali alphabets, hygiene handwash drill & rhymes');
  const [foodNotes, setFoodNotes] = useState<string>('Nutritious lunch meal: boiled egg, khichuri, fresh banana');
  const [voucherName, setVoucherName] = useState<string>('canteen_meal_receipt_sept21.pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: Omit<SUSAttendanceRecord, 'id' | 'createdAt'> = {
      date: newDate,
      location: newLocation,
      totalStudentsAttended: Number(totalStudents),
      boysCount: Number(boysCount),
      girlsCount: Number(girlsCount),
      conductedBy: currentUser.name,
      conductedByUserId: currentUser.id,
      learningTopic,
      foodDistributionNotes: foodNotes,
      foodVoucherFileName: voucherName,
    };
    addSUSRecord(record);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-stone-900 tracking-tight">
              School Under the Sky (SUS) Module
            </h1>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
              7 Locations
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Non-formal open-air education, daily nutritional meal distribution, and verified bill & voucher tracking for street-connected children across Dhaka.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Today's SUS Class & Meal</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-semibold uppercase">Total Sessions Recorded</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{susRecords.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Across 7 street points</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-semibold uppercase">Total Street Kids Served</div>
          <div className="text-2xl font-black text-red-700 mt-1">{totalChildrenServed}</div>
          <div className="text-[11px] text-stone-500 mt-1">
            {totalBoys} Boys • {totalGirls} Girls
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-semibold uppercase">Daily Nutritional Meals</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{totalChildrenServed} Packets</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">100% Meal coverage</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-semibold uppercase">Active Outpost Points</div>
          <div className="text-2xl font-black text-stone-900 mt-1">7 Points</div>
          <div className="text-[11px] text-stone-500 mt-1">Kamalapur, Airport, Mirpur...</div>
        </div>
      </div>

      {/* Location Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setSelectedLocation('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            selectedLocation === 'All'
              ? 'bg-red-600 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          All Locations ({susRecords.length})
        </button>
        {susLocations.map(loc => {
          const count = susRecords.filter(r => r.location === loc).length;
          return (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedLocation === loc
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{loc}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedLocation === loc ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm">
            SUS Daily Sessions & Meal Distribution Logs ({filteredRecords.length})
          </h3>
          <span className="text-xs text-stone-400">Showing verified field educator logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Date & ID</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Learning Curriculum</th>
                <th className="py-3 px-3">Food / Meals Distributed</th>
                <th className="py-3 px-3">Bill / Voucher</th>
                <th className="py-3 px-4">Conducted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{record.date}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{record.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
                      {record.location}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900 text-sm">
                      {record.totalStudentsAttended} kids
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {record.boysCount} boys, {record.girlsCount} girls
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-medium text-stone-800 line-clamp-2">
                      {record.learningTopic}
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="text-stone-700 flex items-start gap-1">
                      <Apple className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{record.foodDistributionNotes}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {record.foodVoucherFileName ? (
                      <div className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                        <Receipt className="w-3 h-3 text-blue-500" />
                        <span className="truncate max-w-[120px]">{record.foodVoucherFileName}</span>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic text-[11px]">Pending upload</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900">{record.conductedBy}</div>
                    <div className="text-[10px] text-stone-400">ID: {record.conductedByUserId}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SUS Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base text-white">Record Daily SUS Class & Food Distribution</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">SUS Location *</label>
                  <select
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value as LeedoLocation)}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm bg-white"
                  >
                    {susLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Total Attended *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={totalStudents}
                    onChange={e => {
                      const total = Number(e.target.value);
                      setTotalStudents(total);
                      setBoysCount(Math.ceil(total / 2));
                      setGirlsCount(Math.floor(total / 2));
                    }}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Boys Count</label>
                  <input
                    type="number"
                    min={0}
                    value={boysCount}
                    onChange={e => setBoysCount(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Girls Count</label>
                  <input
                    type="number"
                    min={0}
                    value={girlsCount}
                    onChange={e => setGirlsCount(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Learning Curriculum / Activities Taught *</label>
                <textarea
                  rows={2}
                  required
                  value={learningTopic}
                  onChange={e => setLearningTopic(e.target.value)}
                  placeholder="e.g. Basic Bengali letters, counting, personal hygiene drill"
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Food Distribution Notes & Menu *</label>
                <input
                  type="text"
                  required
                  value={foodNotes}
                  onChange={e => setFoodNotes(e.target.value)}
                  placeholder="e.g. Khichuri with egg and banana packet"
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Food Bill / Canteen Voucher File</label>
                <input
                  type="text"
                  value={voucherName}
                  onChange={e => setVoucherName(e.target.value)}
                  placeholder="e.g. receipt_voucher_2026.pdf"
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs font-mono"
                />
                <span className="text-[10px] text-stone-400">Attached bill from authorized food vendor</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Daily SUS Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
