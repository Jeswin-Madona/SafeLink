import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Phone, Mail, Award, Building, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">User Profile & Account Security</h1>
        <p className="text-xs text-slate-500">
          Identity details, role permissions, and access verification credentials
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
            {user?.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <Shield className="h-3.5 w-3.5 text-brand-700" />
              Role: {user?.role.replace('ROLE_', '')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block">Registered Email</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1 mt-1">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> {user?.email}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block">Emergency Contact Phone</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1 mt-1">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> {user?.phoneNumber || 'Not configured'}
            </span>
          </div>

          {user?.badgeNumber && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">Official Badge Number</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1 mt-1">
                <Award className="h-3.5 w-3.5 text-slate-400" /> {user.badgeNumber}
              </span>
            </div>
          )}

          {user?.department && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">Department / Command</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1 mt-1">
                <Building className="h-3.5 w-3.5 text-slate-400" /> {user.department}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Security & Authentication Features Armed
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>JWT Bearer Stateless Authentication (HMAC-SHA256 Signed)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Password stored using BCrypt Salted Hashing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Role-Based Access Control (Spring Security SecurityFilterChain)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Immutable cryptographic hash auditing on critical actions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
