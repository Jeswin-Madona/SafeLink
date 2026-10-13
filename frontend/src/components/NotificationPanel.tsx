import React, { useEffect, useState } from 'react';
import { X, Check, BellRing } from 'lucide-react';
import { notificationApi } from '../services/api';
import { Notification } from '../types';
import { StatusBadge } from './StatusBadge';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getAll();
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-slate-600" />
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Alert Notifications
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active alerts or notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 transition-colors ${
                n.read ? 'bg-white' : 'bg-slate-50/80 font-medium'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <StatusBadge status={n.type} size="sm" />
                <span className="text-[10px] text-slate-400">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-slate-900">{n.title}</p>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.message}</p>
              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="mt-2 text-[11px] text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium"
                >
                  <Check className="h-3 w-3" /> Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
