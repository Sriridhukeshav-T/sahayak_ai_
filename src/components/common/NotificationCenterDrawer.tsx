import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  AlertCircle,
  Inbox
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
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  if (!isOpen) return null;

  const now = new Date();
  const todayDateString = now.toDateString();

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  // Group notifications into Today vs Earlier
  const todayNotifications = filtered.filter(n => {
    if (!n.createdAt) return false;
    const d = new Date(n.createdAt);
    return d.toDateString() === todayDateString;
  });

  const earlierNotifications = filtered.filter(n => {
    if (!n.createdAt) return true;
    const d = new Date(n.createdAt);
    return d.toDateString() !== todayDateString;
  });

  const getNotificationIcon = (type?: string) => {
    if (type?.includes('DEADLINE')) {
      return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
    }
    if (type?.includes('APPROVED') || type?.includes('SUCCESS')) {
      return <CheckCircle2 className="w-4 h-4 text-[#065F46] shrink-0" />;
    }
    if (type?.includes('UPDATED')) {
      return <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />;
    }
    if (type?.includes('WAITING_PERIOD')) {
      return <Calendar className="w-4 h-4 text-slate-600 shrink-0" />;
    }
    return <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />;
  };

  const renderNotificationItem = (n: any) => (
    <div
      key={n.id}
      className={`p-3.5 border-b border-slate-100 last:border-b-0 transition-colors ${
        !n.read ? 'bg-emerald-50/30' : 'bg-white hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
              {n.title}
            </h4>
            {!n.read && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#065F46] shrink-0" title="Unread" />
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {n.message}
          </p>
          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span>
              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
            </span>
            {n.schemeId && (
              <Link
                to={`/schemes/${n.schemeId}`}
                onClick={onClose}
                className="text-[#065F46] hover:underline font-semibold flex items-center gap-0.5"
              >
                <span>View Guidelines</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            )}
            {n.applicationId && (
              <Link
                to="/applications"
                onClick={onClose}
                className="text-[#065F46] hover:underline font-semibold flex items-center gap-0.5"
              >
                <span>View Dossier</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
              <p className="text-[11px] text-slate-500">Government scheme updates and application alerts</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === 'ALL' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('UNREAD')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === 'UNREAD' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unread ({notifications.filter(n => !n.read).length})
              </button>
            </div>

            {notifications.some(n => !n.read) && (
              <button
                onClick={() => markNotificationsAsRead()}
                className="text-[11px] text-[#065F46] hover:underline font-semibold flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-medium text-slate-600">No notifications in this view</p>
              <p className="text-[11px] text-slate-400">Important scheme and application notices will appear here.</p>
            </div>
          ) : (
            <>
              {todayNotifications.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    Today
                  </div>
                  {todayNotifications.map(renderNotificationItem)}
                </div>
              )}

              {earlierNotifications.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    Earlier
                  </div>
                  {earlierNotifications.map(renderNotificationItem)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Official notices logged automatically</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
