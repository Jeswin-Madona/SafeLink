import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileWarning, MapPin, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { incidentApi } from '../services/api';

export const ReportIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Poor Lighting');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [approximateAddress, setApproximateAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const captureGps = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setApproximateAddress(
          `GPS Fix: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        );
      },
      (err) => {
        alert('Could not access current location. You may specify location manually.');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await incidentApi.create({
        title,
        description,
        category,
        severity,
        latitude,
        longitude,
        approximateAddress,
        anonymous,
      });

      if (res.success) {
        setSuccessMsg('Incident submitted successfully. It will be reviewed by emergency officials.');
        setTimeout(() => {
          navigate('/safety-map');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit incident report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Report Safety Incident or Hazard</h1>
        <p className="text-xs text-slate-500">
          Citizen report will be analyzed by AI intelligence and escalated to safety officials for verification.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4" /> {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="font-semibold text-slate-800 block">Incident Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Non-functional Streetlights on Outer Ring Footpath"
              className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-800 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="Poor Lighting">Poor Lighting / Darkness</option>
                <option value="Harassment">Harassment / Eve-teasing</option>
                <option value="Suspicious Activity">Suspicious Activity / Loitering</option>
                <option value="Physical Threat">Physical Threat / Stalking</option>
                <option value="Infrastructure Hazard">Infrastructure Hazard</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block">Initial Severity Assessment</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="LOW">Low (Infrastructure inconvenience)</option>
                <option value="MEDIUM">Medium (Caution recommended)</option>
                <option value="HIGH">High (Active risk / Avoid route)</option>
                <option value="CRITICAL">Critical (Immediate danger)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block">Location / Address</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                required
                value={approximateAddress}
                onChange={(e) => setApproximateAddress(e.target.value)}
                placeholder="e.g. 5th Cross, Near Metro Station Pillar 104"
                className="block flex-1 p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
              />
              <button
                type="button"
                onClick={captureGps}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-700" /> Use Current GPS
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, time of day, whether you felt unsafe, or any identifiable characteristics..."
              className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {/* Privacy & Pseudonymity Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  Publish report anonymously
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Your name and profile will be masked as "Anonymous Reporter" on public maps and community feeds.
                  Only authorized investigating officials can access identity details under an audit trail.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs shadow-2xs disabled:opacity-50"
            >
              {loading ? 'Submitting Report...' : 'Submit Incident Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
