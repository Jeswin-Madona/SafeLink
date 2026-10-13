import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  FileText,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  Check,
  X,
  MapPin,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { emergencyApi, incidentApi } from '../services/api';
import { Emergency, Incident } from '../types';

export const OfficialDashboard: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchData = async () => {
    try {
      const [emgRes, incRes] = await Promise.all([
        emergencyApi.getActiveEmergencies(),
        incidentApi.getAll(),
      ]);
      if (emgRes.success) setEmergencies(emgRes.data);
      if (incRes.success) setIncidents(incRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto-refresh for official console
    return () => clearInterval(interval);
  }, []);

  const handleUpdateEmergency = async (id: number, nextStatus: string) => {
    try {
      await emergencyApi.updateStatus(id, {
        status: nextStatus,
        responseNotes: `Updated by emergency dispatch to ${nextStatus}`,
      });
      fetchData();
    } catch (err) {
      alert('Failed to update emergency status.');
    }
  };

  const handleReviewIncident = async (status: string) => {
    if (!selectedIncident) return;
    try {
      await incidentApi.review(selectedIncident.id, {
        status,
        officialNotes: reviewNote || `Reviewed and marked as ${status} by official authority.`,
      });
      setSelectedIncident(null);
      setReviewNote('');
      fetchData();
    } catch (err) {
      alert('Failed to update incident verification.');
    }
  };

  const activeEmergencies = emergencies.filter(
    (e) => e.status === 'ACTIVE' || e.status === 'ACKNOWLEDGED' || e.status === 'RESPONDING'
  );
  const awaitingReview = incidents.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW');
  const verifiedIncidents = incidents.filter((i) => i.status === 'VERIFIED');
  const resolvedIncidents = incidents.filter((i) => i.status === 'RESOLVED');

  const filteredIncidents = incidents.filter((i) => {
    if (filterStatus === 'ALL') return true;
    return i.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Emergency Operations Command</h1>
          <p className="text-xs text-slate-500">
            Real-time emergency dispatch queue, incident validation, and tactical monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
          </span>
        </div>
      </div>

      {/* Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Active SOS Alerts"
          value={activeEmergencies.length}
          subtitle="Immediate dispatch needed"
          icon={AlertOctagon}
          variant={activeEmergencies.length > 0 ? 'danger' : 'default'}
        />
        <MetricCard
          title="Awaiting Review"
          value={awaitingReview.length}
          subtitle="Citizen reports"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Verified Incidents"
          value={verifiedIncidents.length}
          subtitle="Confirmed hazards"
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title="Resolved Cases"
          value={resolvedIncidents.length}
          subtitle="Closed investigations"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Total Reports"
          value={incidents.length}
          subtitle="All-time logs"
          icon={FileText}
        />
      </div>

      {/* Active Emergencies Queue (Highest Priority Section) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 bg-red-50/60 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-900">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <h3 className="font-bold text-sm">Active SOS Emergency Dispatch Queue</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-red-600 text-white">
            {activeEmergencies.length} Active
          </span>
        </div>

        {activeEmergencies.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No active SOS distress signals in progress. All emergency queues clear.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeEmergencies.map((emg) => (
              <div key={emg.id} className="p-4 sm:p-5 hover:bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={emg.status} size="sm" />
                    <span className="font-bold text-sm text-slate-900">
                      Alert ID #{emg.id} — {emg.userName}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">({emg.userPhone})</span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {emg.address} (GPS: {emg.latitude.toFixed(4)}, {emg.longitude.toFixed(4)})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Triggered at: {new Date(emg.createdAt).toLocaleTimeString()} ({new Date(emg.createdAt).toLocaleDateString()})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {emg.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateEmergency(emg.id, 'ACKNOWLEDGED')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded shadow-2xs"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  {emg.status === 'ACKNOWLEDGED' && (
                    <button
                      onClick={() => handleUpdateEmergency(emg.id, 'RESPONDING')}
                      className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded shadow-2xs"
                    >
                      Dispatch Patrol Unit
                    </button>
                  )}
                  {(emg.status === 'RESPONDING' || emg.status === 'ACKNOWLEDGED' || emg.status === 'ACTIVE') && (
                    <button
                      onClick={() => handleUpdateEmergency(emg.id, 'RESOLVED')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-2xs"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incident Reports Table & Official Moderation */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Incident Investigations & Citizen Reports</h3>
            <p className="text-xs text-slate-500">Review, verify evidence, and dispatch ground verification</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-600">#{inc.id}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-slate-900 line-clamp-1">{inc.title}</p>
                    <p className="text-slate-500 text-[11px] line-clamp-1">{inc.description}</p>
                    {inc.aiAnalyzed && (
                      <span className="inline-block mt-1 text-[10px] font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                        AI Analyzed
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{inc.category}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inc.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">{inc.reporterDisplayName}</span>
                    {inc.anonymous && (
                      <span className="block text-[10px] text-slate-400 italic">(User requested anonymity)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inc.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedIncident(inc);
                        setReviewNote(inc.officialNotes || '');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                    >
                      <Eye className="h-3.5 w-3.5" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verification Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Official Incident Review: #{selectedIncident.id}
              </h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block">Incident Title:</span>
                <p className="text-sm font-bold text-slate-900">{selectedIncident.title}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Description:</span>
                <p className="mt-1 p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800">
                  {selectedIncident.description}
                </p>
              </div>

              {selectedIncident.aiAnalyzed && (
                <div className="p-3 bg-brand-50 border border-brand-200 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-900">AI Intelligence Summary</span>
                    <span className="text-[10px] text-brand-700 font-medium">(AI-generated analysis)</span>
                  </div>
                  <p className="mt-1 text-slate-800">{selectedIncident.aiSummary}</p>
                  <p className="mt-1 text-[11px] text-brand-800">
                    <strong>Suggested Category:</strong> {selectedIncident.aiSuggestedCategory} |{' '}
                    <strong>Risk Indicators:</strong> {selectedIncident.aiRiskFactors}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-700 block">Location:</span>
                  <p className="text-slate-600">{selectedIncident.approximateAddress}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Lat: {selectedIncident.latitude.toFixed(4)}, Lng: {selectedIncident.longitude.toFixed(4)}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Current Status:</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedIncident.status} size="sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block">Official Investigation Notes:</label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Enter dispatch notes, CCTV findings, patrol assignments..."
                  className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleReviewIncident('REJECTED')}
                className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded text-xs font-semibold"
              >
                Reject Report
              </button>
              <button
                type="button"
                onClick={() => handleReviewIncident('UNDER_REVIEW')}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-semibold"
              >
                Mark Under Review
              </button>
              <button
                type="button"
                onClick={() => handleReviewIncident('VERIFIED')}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-2xs"
              >
                Verify Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
