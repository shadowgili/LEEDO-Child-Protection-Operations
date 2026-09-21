import React from 'react';
import { useLeedo } from '../../context/LeedoContext';
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '../../utils/calculations';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openChildProfileById,
  } = useLeedo();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Case Alerts, Tasks & Safeguarding Notifications
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated alerts for children approaching 6 weeks in shelter, upcoming medical visits, and post-reintegration milestones.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-lg transition-colors"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden divide-y divide-stone-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No active notifications.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                n.read ? 'bg-white hover:bg-stone-50/70' : 'bg-red-50/40 hover:bg-red-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {n.priority === 'urgent' ? (
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900 text-sm">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl">{n.message}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-400">
                    <span>{n.date}</span>
                    {n.childId && (
                      <>
                        <span>•</span>
                        <span className="font-mono font-bold text-red-600">{n.childId}</span>
                        {n.childName && <span>({n.childName})</span>}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="px-2.5 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                )}

                {n.childId && (
                  <button
                    onClick={() => {
                      markNotificationRead(n.id);
                      openChildProfileById(n.childId!);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Inspect Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
