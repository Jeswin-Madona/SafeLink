import React, { useEffect, useState } from 'react';
import { UserCheck, Users, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { journeyApi } from '../services/api';
import { Journey } from '../types';

export const CompanionPage: React.FC = () => {
  const [companions, setCompanions] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const res = await journeyApi.getCompanions();
        if (res.success) setCompanions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanions();
  }, []);

  const handleToggleJoin = (journeyId: number) => {
    if (joinedGroups.includes(journeyId)) {
      setJoinedGroups(joinedGroups.filter((id) => id !== journeyId));
    } else {
      setJoinedGroups([...joinedGroups, journeyId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Companion Travel Mode</h1>
        <p className="text-xs text-slate-500">
          Peer safety groups for women commuting along overlapping routes with pseudonymized privacy protection
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">How Companion Mode Operates</h3>
            <p className="mt-1 text-xs text-slate-600 max-w-3xl">
              When commuting at late hours or across quiet transit corridors, companion mode enables
              you to pair with verified co-travelers travelling along comparable corridors.
              Exact residential addresses are never displayed; only general transit checkpoints are shared.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-900">Available Active Companion Corridors</h3>
          <span className="text-xs text-slate-500">{companions.length} Available in Metro Region</span>
        </div>

        {companions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            No active companion groups currently matching your route. You can start a journey and enable companion mode in the Journey Manager.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companions.map((c) => {
              const isJoined = joinedGroups.includes(c.id);
              return (
                <div key={c.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Corridor #{c.id} — {c.userName} (Verified Commuter)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Active Now
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <strong>Route:</strong> {c.originName} &rarr; {c.destinationName}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <strong>Est. Duration:</strong> {c.expectedDurationMinutes} mins
                    </p>
                    <p className="text-emerald-700 font-medium">
                      <ShieldCheck className="inline h-3.5 w-3.5 mr-1" />
                      {c.routeLabel || 'Lower Estimated Risk Corridor'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => handleToggleJoin(c.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                        isJoined
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isJoined ? 'Leave Companion Group' : 'Request to Join Group'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
