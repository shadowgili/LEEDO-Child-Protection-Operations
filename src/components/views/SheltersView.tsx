import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Home,
  Users,
  ClockAlert,
  Bed,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { getSixWeekStatus, formatDate, getDaysInShelter } from '../../utils/calculations';

export const SheltersView: React.FC = () => {
  const { children, openChildProfileById, currentUser } = useLeedo();
  const [selectedShelter, setSelectedShelter] = useState<string>('Kamalapur Shelter');

  const shelterData = [
    {
      name: 'Kamalapur Shelter',
      code: 'KS',
      location: 'Kamalapur Railway Station Area, Dhaka',
      capacity: 30,
      supervisor: 'Salma Begum',
      contact: '+880 1711-223344',
      description: 'Primary emergency intake and transitional shelter facility serving street children rescued from railway terminals and central commercial areas.',
    },
    {
      name: 'Kadamtali Shelter',
      code: 'KD',
      location: 'Kadamtali, Sadarghat River Terminal Road, Dhaka',
      capacity: 25,
      supervisor: 'Monirul Haque',
      contact: '+880 1819-556677',
      description: 'Longer-term transitional shelter facility with structured psychosocial support, life skills, and family tracing center.',
    },
    {
      name: 'Peace Home',
      code: 'PH',
      location: 'LEEDO Peace Home Campus, Dhaka Suburb',
      capacity: 50,
      supervisor: 'Peace Home In-Charge',
      contact: '+880 1819-291567',
      description: 'Permanent & comprehensive long-term care shelter for street children without family or DSS referral possibilities, providing shelter, schooling, and life security up to age 17.',
    },
  ];

  const currentShelterMeta = shelterData.find(s => s.name === selectedShelter) || shelterData[0];

  // Children currently admitted in selected shelter
  const activeChildren = children.filter(
    c => c.currentShelter === selectedShelter && c.shelterStatus === 'Admitted'
  );

  const over6WeeksCount = activeChildren.filter(c => {
    const s = getSixWeekStatus(c);
    return s.status === 'exceeded' || s.status === 'completed';
  }).length;

  const approaching6WeeksCount = activeChildren.filter(c => {
    return getSixWeekStatus(c).status === 'approaching';
  }).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Facility Selector */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            LEEDO Shelter Facilities & Bed Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor residential intake, dormitory allocations, and length of stay across shelters.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg border border-stone-200">
          {shelterData.map(shelter => (
            <button
              key={shelter.name}
              onClick={() => setSelectedShelter(shelter.name)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedShelter === shelter.name
                  ? 'bg-white text-red-700 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {shelter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Details Card */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 font-black text-lg flex items-center justify-center shrink-0">
              {currentShelterMeta.code}
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900">{currentShelterMeta.name}</h3>
              <p className="text-xs text-stone-500">{currentShelterMeta.location}</p>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl">{currentShelterMeta.description}</p>
            </div>
          </div>

          <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-200 shrink-0">
            <div>Supervisor: <strong>{currentShelterMeta.supervisor}</strong></div>
            <div>Direct Line: <strong>{currentShelterMeta.contact}</strong></div>
            <div>Status: <span className="text-emerald-700 font-bold">24/7 Active Ingress</span></div>
          </div>
        </div>

        {/* Occupancy Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-center">
          <div className="bg-stone-50 p-3 rounded-lg">
            <span className="text-xs text-stone-500">Current Occupancy</span>
            <div className="text-2xl font-black text-stone-900">{activeChildren.length}</div>
            <span className="text-[10px] text-stone-400">Children housed</span>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <span className="text-xs text-stone-500">Total Capacity</span>
            <div className="text-2xl font-black text-stone-700">{currentShelterMeta.capacity}</div>
            <span className="text-[10px] text-stone-400">
              {currentShelterMeta.capacity - activeChildren.length} available beds
            </span>
          </div>

          <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-200">
            <span className="text-xs text-rose-800 font-semibold">&gt; 6 Weeks Stay</span>
            <div className="text-2xl font-black text-rose-600">{over6WeeksCount}</div>
            <span className="text-[10px] text-rose-700">Immediate case action</span>
          </div>

          <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200">
            <span className="text-xs text-amber-800 font-semibold">Approaching 6 Weeks</span>
            <div className="text-2xl font-black text-amber-600">{approaching6WeeksCount}</div>
            <span className="text-[10px] text-amber-700">35 - 41 days stay</span>
          </div>
        </div>
      </div>

      {/* Children List in Shelter */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-base">
            Active Children in {selectedShelter} ({activeChildren.length})
          </h3>
          <span className="text-xs text-stone-500">
            Ordered by length of stay
          </span>
        </div>

        {activeChildren.length === 0 ? (
          <div className="p-10 text-center text-xs text-stone-400">
            No children currently registered in this shelter facility.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Child ID & Name</th>
                  <th className="py-3 px-3">Room / Bed</th>
                  <th className="py-3 px-3">Admission Date</th>
                  <th className="py-3 px-3">Days in Shelter</th>
                  <th className="py-3 px-3">Assigned Case Worker</th>
                  <th className="py-3 px-3">Tracing Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeChildren.map(child => {
                  const days = getDaysInShelter(child);
                  const sixWeek = getSixWeekStatus(child);
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
                            className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-stone-900 text-sm hover:text-red-600 transition-colors">
                              {child.name}
                            </div>
                            <div className="font-mono text-[11px] text-stone-500">{child.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-medium text-stone-800">
                        {child.roomOrBed || 'Dorm Bed'}
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-stone-800 font-medium">
                          {formatDate(child.shelterAdmissionDate)}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {child.shelterAdmissionTime || '10:00'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={sixWeek.badgeClass}>
                          {days} Days ({sixWeek.label})
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-stone-800">
                        {child.assignedStaff}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-stone-800">{child.familyTracingStatus}</span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openChildProfileById(child.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
