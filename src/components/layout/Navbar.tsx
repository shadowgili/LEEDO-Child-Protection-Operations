import React, { useState } from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  UserCheck,
  ChevronDown,
  LogOut,
  AlertTriangle,
  Clock,
  Menu,
} from 'lucide-react';
import { UserRole } from '../../types/leedo';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    searchQuery,
    setSearchQuery,
    children,
    openChildProfileById,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsRegistrationModalOpen,
    isOfflineMode,
    toggleOfflineMode,
    pendingSyncCount,
    syncOfflineData,
    setActiveTab,
  } = useLeedo();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Search results preview
  const searchResults = searchQuery.trim()
    ? children.filter(c => {
        const q = searchQuery.toLowerCase().trim();
        return (
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.nickname && c.nickname.toLowerCase().includes(q)) ||
          (c.gdNumber && c.gdNumber.toLowerCase().includes(q)) ||
          (c.currentShelter && c.currentShelter.toLowerCase().includes(q)) ||
          (c.rescueArea && c.rescueArea.toLowerCase().includes(q)) ||
          (c.familyInfo?.phone && c.familyInfo.phone.includes(q))
        );
      }).slice(0, 5)
    : [];

  const handleSelectSearchResult = (childId: string) => {
    openChildProfileById(childId);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Super Admin</span>;
      case 'head_office':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Head Office</span>;
      case 'field_officer':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">Field Officer</span>;
      case 'shelter_staff':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">Shelter Staff</span>;
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 tracking-tight text-lg leading-tight">LEEDO</span>
                <span className="text-xs bg-red-50 text-red-700 font-semibold px-1.5 py-0.2 rounded border border-red-200">
                  CPIS
                </span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium leading-none">
                Child Protection & Case Management
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="relative flex-1 max-w-lg hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search Child ID (e.g. LEEDO-2026-0001), name, GD, phone..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-4 py-1.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-stone-200 overflow-hidden z-50">
              <div className="p-2 bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 flex justify-between items-center">
                <span>Search Results ({searchResults.length})</span>
                <span className="text-[11px] text-stone-400">Click to open profile</span>
              </div>
              <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                {searchResults.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectSearchResult(c.id)}
                    className="p-3 hover:bg-red-50/50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.photoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=100'}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 text-sm">{c.name}</span>
                          <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {c.id}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>{c.gender}, ~{c.estimatedAge} yrs</span>
                          <span>•</span>
                          <span>{c.currentShelter || 'No Shelter'}</span>
                          {c.gdNumber && (
                            <>
                              <span>•</span>
                              <span className="text-stone-600">GD: {c.gdNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-700">
                      {c.caseStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: Register Button, Offline Toggle, Notifications, Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Prominent Register New Child Button */}
          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Register Child / Rescue</span>
            <span className="xs:hidden">New Rescue</span>
          </button>

          {/* Offline Sync Mode Toggle */}
          <button
            onClick={toggleOfflineMode}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
              isOfflineMode
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title={isOfflineMode ? 'Working in Offline Field Mode' : 'Online connected'}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-medium">Offline Mode</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] px-1 rounded-full font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Online</span>
              </>
            )}
          </button>

          {/* Sync Button if pending */}
          {pendingSyncCount > 0 && (
            <button
              onClick={syncOfflineData}
              className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-emerald-700 animate-pulse font-medium shadow-xs"
              title="Sync cached offline records"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync ({pendingSyncCount})</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">Alerts & Reminders</span>
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-stone-400">
                      No notifications or reminders
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.childId) {
                            openChildProfileById(n.childId);
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                          n.read ? 'bg-white hover:bg-stone-50' : 'bg-red-50/40 hover:bg-red-50/70'
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.priority === 'urgent' ? (
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-stone-900 truncate">{n.title}</h4>
                            <span className="text-[10px] text-stone-400 shrink-0">{n.date}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">{n.message}</p>
                          {n.childId && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                                {n.childId}
                              </span>
                              {n.childName && (
                                <span className="text-[11px] text-stone-500">{n.childName}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-stone-200"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-stone-900 leading-tight flex items-center gap-1">
                  {currentUser.name}
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </div>
                <div className="text-[11px] text-stone-500 leading-none mt-0.5">
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 p-2">
                <div className="p-2.5 bg-stone-50 rounded-lg mb-2">
                  <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                  <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    {getRoleBadge(currentUser.role)}
                    {currentUser.assignedShelter && (
                      <span className="text-[11px] text-amber-700 font-medium">
                        {currentUser.assignedShelter}
                      </span>
                    )}
                    {currentUser.assignedArea && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {currentUser.assignedArea}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Role (Demo)
                </div>

                <div className="space-y-1">
                  {allUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                        currentUser.id === u.id ? 'bg-red-50 text-red-800 font-semibold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className={`w-3.5 h-3.5 ${currentUser.id === u.id ? 'text-red-600' : 'text-stone-400'}`} />
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-[10px] text-stone-400 capitalize">
                            {u.role.replace('_', ' ')}
                            {u.assignedShelter ? ` • ${u.assignedShelter.split(' ')[0]}` : ''}
                            {u.assignedArea ? ` • ${u.assignedArea.split('-')[0]}` : ''}
                          </div>
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-stone-100 mt-2 pt-2 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-stone-600 hover:bg-stone-50 flex items-center gap-2 font-medium"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                    <span>View Role Permissions Matrix</span>
                  </button>

                  <button
                    onClick={() => {
                      sessionStorage.removeItem('leedo_auth_session');
                      window.location.reload();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out & Lock System</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
