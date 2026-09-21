import React from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Home,
  ClockAlert,
  Search,
  HeartPulse,
  Brain,
  Repeat,
  ExternalLink,
  CalendarCheck,
  AlertOctagon,
  FileBarChart,
  FolderLock,
  UserCog,
  ScrollText,
  Settings,
  X,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  BookCheck,
} from 'lucide-react';
import { getSixWeekStatus } from '../../utils/calculations';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    children,
    visibleChildren,
    notifications,
    setIsRegistrationModalOpen,
    currentUser,
  } = useLeedo();

  // Metrics for badges
  const over6WeeksCount = children.filter(c => {
    const status = getSixWeekStatus(c);
    return status.status === 'exceeded' || status.status === 'completed' || status.status === 'approaching';
  }).length;

  const tracingActiveCount = children.filter(c => c.familyTracingStatus === 'In Progress' || c.familyTracingStatus === 'Not Started').length;
  const reintegratedCount = children.filter(c => c.caseStatus === 'Reintegrated' || c.caseStatus === 'Ready for Reintegration').length;
  const leftWithoutNoticeCount = children.filter(c => c.caseStatus === 'Left Without Notice').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'children',
      label: 'Children & Cases',
      icon: Users,
      badge: visibleChildren.length,
      badgeClass: 'bg-stone-200 text-stone-700',
    },
    {
      id: 'shelters',
      label: 'Shelters',
      icon: Home,
      subtitle: 'Kamalapur & Kadamtali',
    },
    {
      id: 'six_weeks',
      label: '6-Week Stay Alerts',
      icon: ClockAlert,
      badge: over6WeeksCount > 0 ? over6WeeksCount : undefined,
      badgeClass: 'bg-rose-500 text-white font-bold animate-pulse',
    },
    {
      id: 'tracing',
      label: 'Family Tracing',
      icon: Search,
      badge: tracingActiveCount > 0 ? tracingActiveCount : undefined,
      badgeClass: 'bg-blue-100 text-blue-700',
    },
    { id: 'health', label: 'Health & Medical', icon: HeartPulse },
    { id: 'counseling', label: 'Counseling & Mental Health', icon: Brain },
    {
      id: 'reintegration',
      label: 'Family Reintegration',
      icon: Repeat,
      badge: reintegratedCount > 0 ? reintegratedCount : undefined,
      badgeClass: 'bg-emerald-100 text-emerald-700',
    },
    { id: 'referrals', label: 'Government Referrals', icon: ExternalLink },
    { id: 'follow_ups', label: 'Follow-up Schedule', icon: CalendarCheck },
    {
      id: 'left_without_notice',
      label: 'Left Without Notice',
      icon: AlertOctagon,
      badge: leftWithoutNoticeCount > 0 ? leftWithoutNoticeCount : undefined,
      badgeClass: 'bg-red-600 text-white font-bold',
    },
    {
      id: 'notifications',
      label: 'Tasks & Notifications',
      icon: ClockAlert,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
      badgeClass: 'bg-amber-500 text-white',
    },
    { id: 'sus', label: 'School Under Sky (SUS)', icon: BookOpen, subtitle: '7 Open Points' },
    { id: 'vocational', label: 'Vocational Training (VTC)', icon: GraduationCap, subtitle: 'Kadamtali Trade' },
    { id: 'user_manual', label: 'SOP & User Manual', icon: BookCheck, subtitle: 'Deployment & Guide' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
    { id: 'documents', label: 'Documents & Photos', icon: FolderLock },
    { id: 'users', label: 'Users & Roles (50+)', icon: UserCog },
    { id: 'audit', label: 'Audit Trail & Security', icon: ScrollText },
    { id: 'settings', label: 'Settings & System', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[57px] left-0 h-screen md:h-[calc(100vh-57px)] w-72 bg-white border-r border-stone-200 z-50 md:z-20 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Mobile header with close button */}
        <div className="md:hidden p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-stone-900">LEEDO CPIS</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Register New Child */}
        <div className="p-3">
          <button
            onClick={() => {
              setIsRegistrationModalOpen(true);
              onCloseMobile();
            }}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 text-sm font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Register New Child / Rescue</span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-red-50 text-red-700 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-red-600' : 'text-stone-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                      item.badgeClass || 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Current Role card */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-stone-500 font-medium">Logged in as:</span>
            </div>
            <span className="text-[11px] font-bold text-stone-700 capitalize">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <div className="text-xs font-semibold text-stone-900 truncate mt-0.5">
            {currentUser.name}
          </div>
          {currentUser.assignedArea && (
            <div className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">
              Area: {currentUser.assignedArea}
            </div>
          )}
          {currentUser.assignedShelter && (
            <div className="text-[10px] text-amber-700 font-medium truncate mt-0.5">
              Facility: {currentUser.assignedShelter}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
