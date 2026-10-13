import React, { useEffect, useState } from 'react';
import { History, Shield, CheckCircle2, Lock } from 'lucide-react';
import { auditApi } from '../services/api';
import { AuditLog } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await auditApi.getAll();
        if (res.success) setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Security Audit Logs & Compliance Trail</h1>
        <p className="text-xs text-slate-500">
          Tamper-evident system activity ledger with SHA-256 integrity verification hashes
        </p>
      </div>

      <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-3">
        <Lock className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block">Cryptographic Integrity Notice</span>
          <span className="text-slate-600">
            Every critical action (SOS broadcasts, emergency triage transitions, incident verification, and role modifications)
            records an unalterable audit entry verified via SHA-256 checksums to meet enterprise forensics standards.
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Integrity Hash</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 text-slate-500 font-sans">#{log.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="font-medium text-slate-800">{log.actorEmail || 'SYSTEM'}</span>
                    <span className="block text-[10px] text-slate-400">({log.actorRole || 'SYSTEM'})</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-600">
                    {log.entityType} #{log.entityId}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-[120px] truncate" title={log.recordHash}>
                    {log.recordHash ? `${log.recordHash.substring(0, 12)}...` : 'N/A'}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-sans text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
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
