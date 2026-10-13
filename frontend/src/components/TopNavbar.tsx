import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmergencyButton } from './EmergencyButton';
import { NotificationPanel } from './NotificationPanel';
import { notificationApi } from '../services/api';

export const TopNavbar: React.FC = () => {
  const { user, logout, isUser } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnread = async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      if (res.success && res.data) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // ignore silently on polling
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // 15 sec polling
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">SAFELINK Platform</h2>
          <p className="text-xs text-slate-500">Autonomous Safety & Emergency Dispatch Architecture</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Render Emergency SOS button directly in navbar for USER */}
        {isUser && <EmergencyButton />}

        {/* Notifications Icon with Panel */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md relative transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationPanel
              onClose={() => {
                setIsNotifOpen(false);
                fetchUnread();
              }}
            />
          )}
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-800">{user?.fullName}</p>
            <p className="text-[11px] text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
