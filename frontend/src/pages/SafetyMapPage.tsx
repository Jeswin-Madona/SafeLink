import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { incidentApi } from '../services/api';
import { Incident } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { MapPin, ShieldAlert, Layers, AlertCircle } from 'lucide-react';

export const SafetyMapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await incidentApi.getAll();
        if (res.success) setIncidents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on central benchmark coordinates (Bengaluru central coordinates)
    const map = L.map(mapContainerRef.current).setView([12.9716, 77.5946], 13);
    mapInstanceRef.current = map;

    // Use OpenStreetMap clean standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Try to get user current location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `<div style="background-color: #2563eb; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
            iconSize: [14, 14],
          });
          L.marker([pos.coords.latitude, pos.coords.longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<strong>Your Current Position</strong>')
            .openPopup();
        },
        () => {}
      );
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when incidents change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing incident markers (layers except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    const filtered = incidents.filter((i) => {
      if (filterSeverity === 'ALL') return true;
      return i.severity === filterSeverity;
    });

    filtered.forEach((inc) => {
      let markerColor = '#d97706'; // amber
      if (inc.severity === 'HIGH' || inc.severity === 'CRITICAL') {
        markerColor = '#dc2626'; // red
      } else if (inc.severity === 'LOW') {
        markerColor = '#2563eb'; // blue
      }

      const marker = L.circleMarker([inc.latitude, inc.longitude], {
        radius: 8,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedIncident(inc);
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong>${inc.title}</strong><br/>
          <span style="color: #64748b;">${inc.category} (${inc.severity})</span><br/>
          <span>${inc.approximateAddress || ''}</span>
        </div>
      `);
    });
  }, [incidents, filterSeverity]);

  return (
    <div className="space-y-4">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Geospatial Safety & Hazard Map</h1>
          <p className="text-xs text-slate-500">
            OpenStreetMap geospatial visualization with verified citizen reports and risk clusters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 shadow-2xs">
            <span className="font-semibold text-slate-700">Filter Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
        <div className="h-[520px] w-full rounded overflow-hidden relative">
          <div ref={mapContainerRef} className="h-full w-full" />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/95 border border-slate-300 rounded p-2.5 text-[11px] shadow-sm space-y-1 backdrop-blur-xs">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
              Hazard Legend
            </p>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 border border-white" />
              <span className="text-slate-600">High / Critical Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 border border-white" />
              <span className="text-slate-600">Medium Severity / Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 border border-white" />
              <span className="text-slate-600">Low / Infrastructure Issue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white" />
              <span className="text-slate-600">Your Current GPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Incident Drawer / Card */}
      {selectedIncident && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs text-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedIncident.severity} size="sm" />
                <StatusBadge status={selectedIncident.status} size="sm" />
                <span className="font-semibold text-slate-500 uppercase">{selectedIncident.category}</span>
              </div>
              <h3 className="mt-1 text-sm font-bold text-slate-900">{selectedIncident.title}</h3>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <p className="mt-2 text-slate-700">{selectedIncident.description}</p>
          <p className="mt-2 text-slate-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {selectedIncident.approximateAddress} (Coords: {selectedIncident.latitude.toFixed(4)},{' '}
            {selectedIncident.longitude.toFixed(4)})
          </p>
        </div>
      )}
    </div>
  );
};
