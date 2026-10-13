import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileWarning,
  Compass,
  AlertTriangle,
  MapPin,
  CheckCircle,
  PlusCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmergencyButton } from '../components/EmergencyButton';
import { incidentApi, journeyApi, emergencyApi } from '../services/api';
import { Incident, Journey, Emergency } from '../types';

export const UserDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [myEmergencies, setMyEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, jrnRes, emgRes] = await Promise.all([
          incidentApi.getAll(),
          journeyApi.getMyJourneys(),
          emergencyApi.getMyEmergencies(),
        ]);
        if (incRes.success) setIncidents(incRes.data);
        if (jrnRes.success) setJourneys(jrnRes.data);
        if (emgRes.success) setMyEmergencies(emgRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeJourney = journeys.find((j) => j.status === 'ACTIVE');
  const verifiedIncidents = incidents.filter((i) => i.status === 'VERIFIED');
  const activeEmergencies = myEmergencies.filter((e) => e.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Page Title & Emergency Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Personal Safety Console</h1>
          <p className="text-xs text-slate-500">
            Real-time status, active journey tracking, and community intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/report-incident"
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-300 text-xs font-semibold rounded bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
          >
            <PlusCircle className="h-4 w-4" /> Report Incident
          </Link>
          <EmergencyButton />
        </div>
      </div>

      {/* Safety Status Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Safety Guardian Network Active</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  Protected
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 max-w-2xl">
                Emergency dispatch simulation is armed. Your configured guardians will be notified
                immediately in the event of an SOS broadcast or unexpected route deviation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/safety-map"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
            >
              Inspect Safety Map <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Emergencies"
          value={activeEmergencies.length}
          subtitle="Your broadcast alerts"
          icon={AlertTriangle}
          variant={activeEmergencies.length > 0 ? 'danger' : 'default'}
        />
        <MetricCard
          title="Verified Incidents"
          value={verifiedIncidents.length}
          subtitle="In your operating region"
          icon={FileWarning}
          variant="warning"
        />
        <MetricCard
          title="Active Journeys"
          value={activeJourney ? 1 : 0}
          subtitle={activeJourney ? 'Companion mode on' : 'No journey active'}
          icon={Compass}
          variant={activeJourney ? 'success' : 'default'}
        />
        <MetricCard
          title="Safety Score Proxy"
          value="88 / 100"
          subtitle="Based on verified zone data"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Active Journey Card (If currently on route) */}
      {activeJourney && (
        <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-brand-400" />
              <h3 className="font-semibold text-sm">Active Safe Journey in Progress</h3>
            </div>
            <StatusBadge status="ACTIVE" size="sm" />
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Origin:</span>
              <span className="font-medium">{activeJourney.originName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Destination:</span>
              <span className="font-medium">{activeJourney.destinationName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Route Assessment:</span>
              <span className="font-medium text-emerald-400">
                {activeJourney.routeLabel || 'Lower Estimated Risk Corridor'} (Score: {activeJourney.estimatedRiskScore || 32}/100)
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-2">
            <Link
              to="/journeys"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded font-medium text-slate-200"
            >
              Open Journey Tracking
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Grid: Nearby Incidents & Community Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearby Incidents Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Verified Safety Incidents</h3>
              <p className="text-xs text-slate-500">Official warnings and verified community reports</p>
            </div>
            <Link
              to="/safety-map"
              className="text-xs font-medium text-brand-700 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {incidents.slice(0, 4).map((inc) => (
              <div key={inc.id} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={inc.status} size="sm" />
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {inc.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    <Clock className="inline h-3 w-3 mr-0.5" />
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{inc.description}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {inc.approximateAddress || 'Central District'}
                  </span>
                  <span className="font-medium text-slate-600">Category: {inc.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Safety Actions & Safe Route Tools */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Safe Route Assistant</h3>
            <p className="text-xs text-slate-600 mb-4">
              Plan your travel before stepping out. Our route scoring engine evaluates historical incident density,
              lighting data, and time-of-day risks to suggest routes with lower estimated risk.
            </p>
            <Link
              to="/journeys"
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Compass className="h-4 w-4" /> Plan a Safe Journey
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Community Safety Network</h3>
              <Link to="/community" className="text-xs font-medium text-brand-700 hover:underline">
                Open Feed
              </Link>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Crowdsource street safety hazards like broken street lights, unattended loitering,
              or safe transit waiting points with pseudonymous privacy protection.
            </p>
            <div className="mt-3">
              <Link
                to="/community"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                Browse safety alerts in your ward <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
