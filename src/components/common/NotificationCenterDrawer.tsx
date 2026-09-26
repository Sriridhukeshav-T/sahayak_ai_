import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Link } from 'react-router-dom';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { notifications, markNotificationsAsRead } = useAppData();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SCHEMES' | 'APPLICATIONS'>('ALL');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (selectedFilter === 'SCHEMES') {
      return n.type?.startsWith('SCHEME_') || n.schemeId;
    }
    if (selectedFilter === 'APPLICATIONS') {
      return n.type?.startsWith('APPLICATION_') || n.type?.startsWith('WAITING_PERIOD_') || n.applicationId;
    }
    return true;
  });

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIconForType = (type?: string) => {
    if (type?.includes('DEADLINE')) {
      return <Clock className="w-4 h-4 text-amber-600" />;
    }
    if (type?.includes('APPROVED') || type?.includes('SUCCESS')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    if (type?.includes('UPDATED')) {
      return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    }
    if (type?.includes('WAITING_PERIOD')) {
      return <Calendar className="w-4 h-4 text-purple-600" />;
    }
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Civic Notifications</h3>
                <span className="text-[10px] text-slate-500">Government scheme updates and dossier alerts</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              onClick={() => setSelectedFilter('SCHEMES')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedFilter === 'SCHEMES'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Schemes
            </button>
            <button
              onClick={() => setSelectedFilter('APPLICATIONS')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedFilter === 'APPLICATIONS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Applications
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">No notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id || notif.notificationId}
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                  notif.read ? 'bg-white border-slate-200' : 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIconForType(notif.type)}
                    <span className="font-bold text-slate-900 leading-tight">{notif.title}</span>
                  </div>
                  {notif.priority && notif.priority !== 'NORMAL' && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${getPriorityBadge(notif.priority)}`}>
                      {notif.priority}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pl-6 text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="font-mono">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                  </span>

                  {notif.actionLink && (
                    <Link
                      to={notif.actionLink}
                      onClick={onClose}
                      className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={markNotificationsAsRead}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
          <span className="text-[10px] text-slate-400">Idempotent Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterDrawer;
