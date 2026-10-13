import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { emergencyApi } from '../services/api';
import { Emergency } from '../types';

interface EmergencyButtonProps {
  onSosTriggered?: (emergency: Emergency) => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onSosTriggered }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrigger = async () => {
    setLoading(true);
    setError(null);

    // Capture browser geolocation if permitted, else default to central coordinates
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await emergencyApi.triggerSos({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: `Current GPS Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
            triggerReason: 'Manual SOS Activation Button',
          });
          if (res.success && res.data) {
            setActiveEmergency(res.data);
            setIsModalOpen(false);
            if (onSosTriggered) onSosTriggered(res.data);
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to dispatch SOS alert. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      async (err) => {
        // Fallback with standard sample city coordinates if browser location blocked
        try {
          const res = await emergencyApi.triggerSos({
            latitude: 12.9716,
            longitude: 77.5946,
            address: 'Bengaluru Central District (Browser Location Permission Blocked)',
            triggerReason: 'Manual SOS Activation Button (Fallback Coords)',
          });
          if (res.success && res.data) {
            setActiveEmergency(res.data);
            setIsModalOpen(false);
            if (onSosTriggered) onSosTriggered(res.data);
          }
        } catch (apiErr: any) {
          setError(apiErr.response?.data?.message || 'Failed to dispatch SOS alert.');
        } finally {
          setLoading(false);
        }
      },
      { timeout: 7000 }
    );
  };

  const handleCancelSos = async () => {
    if (!activeEmergency) return;
    setLoading(true);
    try {
      const res = await emergencyApi.updateStatus(activeEmergency.id, {
        status: 'CANCELLED',
        responseNotes: 'False alarm cancelled by user with confirmation.',
      });
      if (res.success) {
        setActiveEmergency(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel SOS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Active SOS Bar if an SOS is currently active */}
      {activeEmergency && activeEmergency.status === 'ACTIVE' && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <div>
                <p className="font-semibold text-red-950">EMERGENCY SOS ACTIVE (ID #{activeEmergency.id})</p>
                <p className="text-xs text-red-800">
                  Guardians and emergency dispatch officials have been alerted with your location.
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelSos}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-red-700 border border-red-300 hover:bg-red-100 transition-colors"
            >
              Cancel SOS (Safe Now)
            </button>
          </div>
        </div>
      )}

      {/* Standalone Enterprise SOS Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium text-sm rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        title="Trigger Emergency SOS"
      >
        <ShieldAlert className="h-4 w-4" />
        <span>Emergency SOS</span>
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold text-slate-900">Confirm Emergency SOS</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 text-sm text-slate-600 space-y-2">
              <p>
                Activating SOS will immediately:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                <li>Capture your current GPS location coordinates</li>
                <li>Dispatch high-priority alert to your registered guardians</li>
                <li>Simulate escalation to authorized official emergency command</li>
                <li>Open a live monitoring incident record</li>
              </ul>
              <p className="text-xs text-slate-500 pt-2 italic">
                Note: In this academic system, official dispatch is simulated for study & demonstration purposes.
              </p>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTrigger}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded shadow-sm disabled:opacity-50"
              >
                {loading ? 'Transmitting Alert...' : 'Yes, Broadcast SOS Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
