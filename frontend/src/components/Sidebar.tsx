import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  MapPin,
  FileWarning,
  Users,
  Compass,
  UserCheck,
  AlertOctagon,
  User,
  Activity,
  History,
  FileText,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, isUser, isGuardian, isOfficial, isAdmin } = useAuth();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-slate-800 text-white font-semibold'
        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen text-slate-100">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="h-8 w-8 rounded bg-brand-600 flex items-center justify-center text-white font-bold">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-wide text-white">SAFELINK</span>
          <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Safety & Emergency Core
          </span>
        </div>
      </div>

      {/* Role Pill Banner */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Workspace Role:</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-slate-800 text-brand-100 border border-slate-700">
            {user?.role.replace('ROLE_', '')}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* User Navigation */}
        {isUser && (
          <>
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Personal Safety
            </p>
            <NavLink to="/dashboard" end className={navItemClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/safety-map" className={navItemClass}>
              <MapPin className="h-4 w-4" />
              <span>Safety Map</span>
            </NavLink>
            <NavLink to="/report-incident" className={navItemClass}>
              <FileWarning className="h-4 w-4" />
              <span>Report Incident</span>
            </NavLink>
            <NavLink to="/community" className={navItemClass}>
              <Users className="h-4 w-4" />
              <span>Community Feed</span>
            </NavLink>
            <NavLink to="/journeys" className={navItemClass}>
              <Compass className="h-4 w-4" />
              <span>My Journeys</span>
            </NavLink>
            <NavLink to="/companion" className={navItemClass}>
              <UserCheck className="h-4 w-4" />
              <span>Companion Mode</span>
            </NavLink>
            <NavLink to="/emergency" className={navItemClass}>
              <AlertOctagon className="h-4 w-4 text-red-400" />
              <span className="text-red-300">Emergency Center</span>
            </NavLink>
          </>
        )}

        {/* Guardian Navigation */}
        {isGuardian && (
          <>
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Guardian Console
            </p>
            <NavLink to="/guardian/dashboard" end className={navItemClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/guardian/connected-users" className={navItemClass}>
              <Users className="h-4 w-4" />
              <span>Connected Wards</span>
            </NavLink>
            <NavLink to="/guardian/alerts" className={navItemClass}>
              <AlertOctagon className="h-4 w-4 text-red-400" />
              <span>Emergency Alerts</span>
            </NavLink>
            <NavLink to="/guardian/shared-journey" className={navItemClass}>
              <Compass className="h-4 w-4" />
              <span>Live Journey Watch</span>
            </NavLink>
          </>
        )}

        {/* Official & Admin Navigation */}
        {(isOfficial || isAdmin) && (
          <>
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Emergency Operations
            </p>
            <NavLink to="/official/dashboard" end className={navItemClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Operations Hub</span>
            </NavLink>
            <NavLink to="/official/emergencies" className={navItemClass}>
              <AlertOctagon className="h-4 w-4 text-red-400" />
              <span className="text-red-300">Active Emergencies</span>
            </NavLink>
            <NavLink to="/official/incidents" className={navItemClass}>
              <FileWarning className="h-4 w-4" />
              <span>Incident Investigation</span>
            </NavLink>
            <NavLink to="/official/community-review" className={navItemClass}>
              <ShieldCheck className="h-4 w-4" />
              <span>Community Moderation</span>
            </NavLink>
            <NavLink to="/official/map" className={navItemClass}>
              <Radio className="h-4 w-4" />
              <span>Tactical Map</span>
            </NavLink>
            <NavLink to="/official/audit-logs" className={navItemClass}>
              <History className="h-4 w-4" />
              <span>Security Audit Logs</span>
            </NavLink>
          </>
        )}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>
          <NavLink to="/profile" className={navItemClass}>
            <User className="h-4 w-4" />
            <span>Profile & Security</span>
          </NavLink>
        </div>
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-slate-300 font-medium">Core Services Online</span>
        </div>
        <p className="text-slate-500 text-[10px]">v1.0.0 (Enterprise Academic Build)</p>
      </div>
    </aside>
  );
};
