import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  UserCog,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  PlusCircle,
  MapPin,
  Home,
  Check,
  AlertTriangle,
  UserX,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { UserRole } from '../../types/leedo';

export const UsersView: React.FC = () => {
  const { allUsers, currentUser, setCurrentUser, toggleUserActiveStatus } = useLeedo();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const rolesMeta = [
    {
      role: 'super_admin' as UserRole,
      title: 'Super Admin',
      description: 'Master access to all shelters, delete duplicate child records, organization records & role settings.',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      role: 'hr_admin' as UserRole,
      title: 'HR & Admin Manager',
      description: 'Authority to activate/deactivate staff, revoke resigned employees, clean duplicate files, and issue master codes.',
      badge: 'bg-red-100 text-red-800 border-red-200',
    },
    {
      role: 'head_office' as UserRole,
      title: 'Head Office Staff',
      description: 'Organization-wide visibility into all children, both shelters, analytics dashboards, and donor reports.',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      role: 'peace_home_manager' as UserRole,
      title: 'Peace Home Manager',
      description: 'Manages long-term child residency (up to 17 yrs) referred from transitional shelters after 6 weeks.',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  // Filtering
  const filteredUsers = allUsers.filter(u => {
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesLocation = selectedLocationFilter === 'all' || u.location === selectedLocationFilter;
    const matchesSearch =
      !searchTerm ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.employeeId && u.employeeId.includes(searchTerm)) ||
      (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesLocation && matchesSearch;
  });

  const isHROrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'hr_admin' ||
    currentUser.id === '1002' ||
    currentUser.id === '1057';

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              LEEDO Staff Roster & Access Control (50+ Staff)
            </h2>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
              HR Module
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Strict area-based data isolation for Kamalapur, Kadamtali, Peace Home, and rescue field units. Managed by HR (Omar Faruque #1057 & Kanta #1002).
          </p>
        </div>

        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs flex items-center gap-2 shrink-0">
          <span className="text-stone-500 font-medium">Logged in as:</span>
          <span className="font-bold text-stone-900">{currentUser.name}</span>
          <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded capitalize">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* HR Control Notice */}
      <div className="bg-stone-900 text-white p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm text-white">HR Staff Access Protocol</span>
            <p className="text-stone-300 mt-0.5">
              Resigned employees can be deactivated with one click below, immediately blocking system login. Field workers cannot delete cases — only authorized admins (Kanta & Faruque) hold duplicate file removal authority.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-stone-400 shrink-0">
          Total Staff: <strong className="text-white">{allUsers.length}</strong> | Active: <strong className="text-emerald-400">{allUsers.filter(u => u.isActive).length}</strong>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-700">Filter Role:</span>
          {['all', 'super_admin', 'head_office', 'shelter_staff', 'field_officer', 'peace_home_manager'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedRoleFilter === r
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search staff by ID, name, area..."
            className="w-full text-xs pl-9 pr-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Staff Accounts List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              LEEDO Staff Accounts & Access Boundaries ({filteredUsers.length})
            </h3>
            <p className="text-xs text-stone-500">
              Field staff have restricted area visibility. Peace Home staff only see Peace Home children.
            </p>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredUsers.map(user => {
            const isCurrent = currentUser.id === user.id || currentUser.employeeId === user.id;
            return (
              <div
                key={user.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  !user.isActive
                    ? 'bg-rose-50/50 opacity-70'
                    : isCurrent
                    ? 'bg-red-50/40'
                    : 'hover:bg-stone-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {user.employeeId || user.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{user.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">ID: {user.employeeId || user.id}</span>
                      {!user.isActive && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Resigned / Inactive
                        </span>
                      )}
                      {user.canDeleteChildren && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Master Delete Right
                        </span>
                      )}
                      {isCurrent && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active Session</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span className="font-medium text-stone-700 capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className="text-red-700 font-semibold flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {user.location}
                      </span>
                      {user.assignedShelter && (
                        <>
                          <span>•</span>
                          <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                            <Home className="w-3 h-3" /> {user.assignedShelter}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* HR Revoke / Reactivate Button */}
                  {isHROrAdmin && (
                    <button
                      onClick={() => toggleUserActiveStatus(user.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 ${
                        user.isActive
                          ? 'text-rose-700 hover:bg-rose-50 border-rose-200'
                          : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                      }`}
                      title={user.isActive ? 'Mark employee as resigned' : 'Reactivate employee account'}
                    >
                      {user.isActive ? (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Reactivate</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Switch Account */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="px-3 py-1.5 text-xs font-semibold text-stone-400 bg-stone-100 rounded-lg cursor-not-allowed"
                    >
                      Active Session
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentUser(user)}
                      disabled={!user.isActive}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all shadow-2xs ${
                        user.isActive
                          ? 'text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border-red-200 hover:border-transparent'
                          : 'text-stone-400 bg-stone-100 border-stone-200 cursor-not-allowed'
                      }`}
                    >
                      {user.isActive ? 'Switch to This Staff →' : 'Account Blocked'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
