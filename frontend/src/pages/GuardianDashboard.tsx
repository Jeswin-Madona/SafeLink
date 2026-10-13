import React, { useEffect, useState } from 'react';
import {
  Users,
  Compass,
  AlertOctagon,
  ShieldCheck,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { guardianApi } from '../services/api';
import { Emergency, Journey, User } from '../types';

export const GuardianDashboard: React.FC = () => {
  const [wards, setWards] = useState<User[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardianData = async () => {
      try {
        const [wardsRes, emgRes, jrnRes] = await Promise.all([
          guardianApi.getWards(),
          guardianApi.getWardEmergencies(),
          guardianApi.getWardJourneys(),
        ]);
        if (wardsRes.success) setWards(wardsRes.data);
        if (emgRes.success) setEmergencies(emgRes.data);
        if (jrnRes.success) setJourneys(jrnRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuardianData();
  }, []);

  const activeEmergencies = emergencies.filter((e) => e.status === 'ACTIVE');
  const activeJourneys = journeys.filter((j) => j.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Guardian Safety Console</h1>
          <p className="text-xs text-slate-500">
            Authorized oversight, live consensual travel monitoring, and emergency notifications
          </p>
        </div>
      </div>

      {/* High-priority Emergency Alert Notice if Ward triggered SOS */}
      {activeEmergencies.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertOctagon className="h-6 w-6 text-red-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h2 className="text-sm font-bold text-red-950">
                CRITICAL: EMERGENCY SOS BROADCAST RECEIVED
              </h2>
              <p className="mt-1 text-xs text-red-800">
                A connected family member has triggered an emergency distress signal. Location coordinates
                have been logged and dispatched to official emergency personnel.
              </p>
              <div className="mt-3 space-y-2">
                {activeEmergencies.map((e) => (
                  <div key={e.id} className="p-3 bg-white rounded border border-red-200 text-xs">
                    <p className="font-bold text-slate-900">
                      User: {e.userName} ({e.userPhone})
                    </p>
                    <p className="text-slate-600 mt-1">
                      <MapPin className="inline h-3.5 w-3.5 text-red-500 mr-1" />
                      {e.address} (GPS: {e.latitude.toFixed(4)}, {e.longitude.toFixed(4)})
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Triggered at: {new Date(e.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Connected Wards"
          value={wards.length}
          subtitle="Authorized accounts"
          icon={Users}
        />
        <MetricCard
          title="Active Live Journeys"
          value={activeJourneys.length}
          subtitle="Currently sharing route"
          icon={Compass}
          variant={activeJourneys.length > 0 ? 'success' : 'default'}
        />
        <MetricCard
          title="SOS Distress Alerts"
          value={activeEmergencies.length}
          subtitle="Requires attention"
          icon={AlertOctagon}
          variant={activeEmergencies.length > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Two Column: Connected Users & Active Journeys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Family / Users */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Connected Accounts</h3>
            <span className="text-xs text-slate-500 font-medium">Consensual Link</span>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {wards.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No connected user accounts linked yet.
              </p>
            ) : (
              wards.map((ward) => (
                <div key={ward.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-xs text-slate-900">{ward.fullName}</p>
                    <p className="text-[11px] text-slate-500">{ward.email}</p>
                    {ward.phoneNumber && (
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" /> {ward.phoneNumber}
                      </p>
                    )}
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active & Linked
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Journey Watch */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Live Journey Tracking</h3>
            <span className="text-xs text-slate-500">Consensual Stream</span>
          </div>

          <div className="mt-3">
            {activeJourneys.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <ShieldCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                No family members are currently in an active journey.
              </div>
            ) : (
              <div className="space-y-3">
                {activeJourneys.map((j) => (
                  <div key={j.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{j.userName}'s Journey</span>
                      <StatusBadge status={j.status} size="sm" />
                    </div>
                    <div className="mt-2 space-y-1 text-slate-600">
                      <p>From: {j.originName}</p>
                      <p>To: {j.destinationName}</p>
                      <p className="text-emerald-700 font-medium">
                        Estimated Risk: {j.routeLabel || 'Lower Estimated Risk Corridor'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
