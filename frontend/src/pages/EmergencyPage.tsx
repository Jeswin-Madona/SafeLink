import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { emergencyApi } from '../services/api';
import { Emergency } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmergencyButton } from '../components/EmergencyButton';

export const EmergencyPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEmergencies = async () => {
    try {
      const res = await emergencyApi.getMyEmergencies();
      if (res.success) setEmergencies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEmergencies();
    const interval = setInterval(fetchMyEmergencies, 8000);
    return () => clearInterval(interval);
  }, []);

  const activeAlert = emergencies.find((e) => e.status === 'ACTIVE' || e.status === 'ACKNOWLEDGED' || e.status === 'RESPONDING');

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you certain you want to cancel this emergency alert?')) return;
    try {
      await emergencyApi.updateStatus(id, {
        status: 'CANCELLED',
        responseNotes: 'User confirmed safety; alert cancelled.',
      });
      fetchMyEmergencies();
    } catch (err) {
      alert('Failed to cancel alert.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Emergency SOS Command Center</h1>
        <p className="text-xs text-slate-500">
          Distress signal broadcasting, high-priority guardian alerting, and official response simulation
        </p>
      </div>

      {/* Academic Project Realistic Limitations Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Academic Demonstration & Simulation Architecture Notice</p>
          <p className="mt-0.5 text-blue-800 leading-relaxed">
            In this final-year engineering system, external police dispatch is modeled via an internal
            Authorized Official Emergency Operations console with audit logging. In real-world deployment,
            this connects via certified emergency telecommunications gateways (e.g. 112 / Emergency Response Support System CAD).
          </p>
        </div>
      </div>

      {/* Main SOS Trigger Station */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Broadcast High-Priority Distress SOS</h3>
            <p className="text-xs text-slate-600 max-w-xl">
              Pressing the emergency button instantly transmits your real-time coordinates, generates an
              unforgeable audit log entry, and issues multi-channel notifications to your guardian list and on-duty dispatchers.
            </p>
          </div>
          <div className="shrink-0">
            <EmergencyButton onSosTriggered={() => fetchMyEmergencies()} />
          </div>
        </div>

        {/* Active Emergency Live Card */}
        {activeAlert && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-red-700 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
                Active Incident #{activeAlert.id} Under Monitoring
              </span>
              <StatusBadge status={activeAlert.status} size="sm" />
            </div>
            <p><strong>Captured Location:</strong> {activeAlert.address}</p>
            <p><strong>Trigger Mode:</strong> {activeAlert.triggerReason}</p>
            {activeAlert.responseNotes && (
              <p><strong>Official Dispatch Note:</strong> {activeAlert.responseNotes}</p>
            )}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleCancel(activeAlert.id)}
                className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded font-semibold text-xs hover:bg-red-100"
              >
                Cancel Emergency (I Am Safe Now)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SOS Incident Log History */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">Your Emergency Incident History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Alert ID</th>
                <th className="py-2.5 px-3">Trigger Reason</th>
                <th className="py-2.5 px-3">Location Coordinates</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3 text-right">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emergencies.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono font-medium text-slate-700">#{e.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{e.triggerReason}</td>
                  <td className="py-3 px-3 text-slate-600">{e.address}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={e.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {e.responseNotes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
