import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, Navigation, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { journeyApi } from '../services/api';
import { Journey } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const JourneysPage: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [expectedDuration, setExpectedDuration] = useState(30);
  const [companionMode, setCompanionMode] = useState(false);
  const [shareGuardians, setShareGuardians] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Safe Route Multi-Option Comparison Simulation State
  const [showRouteComparison, setShowRouteComparison] = useState(false);
  const [selectedRouteOption, setSelectedRouteOption] = useState<'A' | 'B'>('B');

  const fetchJourneys = async () => {
    try {
      const res = await journeyApi.getMyJourneys();
      if (res.success) setJourneys(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const handleCalculateRoutes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originName || !destinationName) return;
    setShowRouteComparison(true);
  };

  const handleStartJourney = async () => {
    setSubmitting(true);
    try {
      const res = await journeyApi.startJourney({
        originName,
        destinationName,
        startLatitude: 12.9352,
        startLongitude: 77.6245,
        destinationLatitude: 12.9719,
        destinationLongitude: 77.5937,
        expectedDurationMinutes: expectedDuration,
        companionModeEnabled: companionMode,
        shareWithGuardians: shareGuardians,
      });

      if (res.success) {
        setShowRouteComparison(false);
        setOriginName('');
        setDestinationName('');
        fetchJourneys();
      }
    } catch (err) {
      alert('Failed to start journey.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await journeyApi.completeJourney(id);
      fetchJourneys();
    } catch (err) {
      alert('Failed to mark journey as completed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Safe Route & Journey Manager</h1>
        <p className="text-xs text-slate-500">
          Transparent multi-factor risk estimation, consented guardian tracking, and companion routing
        </p>
      </div>

      {/* Route Planning Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Plan Journey with Route Risk Analysis</h3>

        <form onSubmit={handleCalculateRoutes} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-800 block">Origin Location</label>
              <input
                type="text"
                required
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                placeholder="e.g. City Tech Park, Outer Ring Rd"
                className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block">Destination</label>
              <input
                type="text"
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Ashok Nagar Residency"
                className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-800 block">Estimated Travel Time (Minutes)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={expectedDuration}
                onChange={(e) => setExpectedDuration(parseInt(e.target.value))}
                className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareGuardians}
                  onChange={(e) => setShareGuardians(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="text-slate-800 font-medium">Share live route with registered guardians</span>
              </label>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={companionMode}
                  onChange={(e) => setCompanionMode(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="text-slate-800 font-medium">Enable Companion Mode matching</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs shadow-2xs"
          >
            Evaluate Available Routes & Risk Scores
          </button>
        </form>

        {/* Route Risk Comparison Section */}
        {showRouteComparison && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multi-Factor Risk Assessment Results
              </h4>
              <p className="text-[11px] text-slate-500">
                Evaluation considers: verified incident density, streetlight coverage ratings, time of day, and transit activity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Route Option A */}
              <div
                onClick={() => setSelectedRouteOption('A')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedRouteOption === 'A'
                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Route A (Direct Cut-through)</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Risk Score: 68 / 100
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-slate-600 text-xs">
                  <p><strong>Distance:</strong> 2.8 km (Fastest route)</p>
                  <p><strong>Estimated Travel:</strong> 18 mins</p>
                  <p className="text-amber-700 font-medium">
                    <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                    Contains 2 unverified poor-lighting spots & isolated pedestrian sections.
                  </p>
                </div>
              </div>

              {/* Route Option B (Recommended) */}
              <div
                onClick={() => setSelectedRouteOption('B')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedRouteOption === 'B'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Route B (Main Arterial Corridor)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-700 text-white">
                      Recommended
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Risk Score: 32 / 100
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-slate-600 text-xs">
                  <p><strong>Distance:</strong> 3.2 km (Slightly longer)</p>
                  <p><strong>Estimated Travel:</strong> 23 mins</p>
                  <p className="text-emerald-800 font-medium">
                    <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Lower estimated risk compared with available alternatives. Continuous commercial lighting & active transit stops.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 italic">
                * Safelink indicates lower estimated risk based on available proxy data; situational vigilance remains essential.
              </span>
              <button
                onClick={handleStartJourney}
                disabled={submitting}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-2xs"
              >
                {submitting ? 'Initiating Journey...' : `Start Journey via Selected Route ${selectedRouteOption}`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Journey History & Active Journeys Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">Your Journey Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Origin & Destination</th>
                <th className="py-2.5 px-3">Route Label</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journeys.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono text-slate-500">#{j.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{j.originName} &rarr; {j.destinationName}</p>
                    <p className="text-[11px] text-slate-500">Expected: {j.expectedDurationMinutes} mins</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{j.routeLabel || 'Standard Corridor'}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{j.estimatedRiskScore || 35} / 100</span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={j.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(j.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {j.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleComplete(j.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                      >
                        Mark Reached Safely
                      </button>
                    )}
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
