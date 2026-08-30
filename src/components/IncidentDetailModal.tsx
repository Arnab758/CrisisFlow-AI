import React from 'react';
import { Incident } from '../types';
import {
  X,
  AlertTriangle,
  Flame,
  Droplets,
  Building,
  Radio,
  CheckCircle2,
  Eye,
  Shield,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onDispatch: (incidentId: string) => void;
  onOpenTriage: (incident: Incident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onDispatch,
  onOpenTriage,
}) => {
  if (!incident) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1-CRITICAL':
        return 'bg-red-500 text-white';
      case 'P2-HIGH':
        return 'bg-orange-500 text-slate-950 font-bold';
      case 'P3-MODERATE':
        return 'bg-amber-500 text-slate-950 font-bold';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Priority & Sector */}
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded text-xs font-black ${getPriorityColor(incident.priority)}`}>
            {incident.priority}
          </span>
          <span className="text-xs font-mono text-slate-400">{incident.location.sectorName}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-cyan-400">{incident.location.gridRef}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-white mb-3 leading-snug">{incident.title}</h3>

        {/* Hazard Summary */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6 font-sans">
          {incident.hazardSummary}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">EST. CASUALTIES</span>
            <span className="text-base font-bold text-red-400">{incident.casualtyEstimate} Souls</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">STRUCTURAL</span>
            <span className="text-base font-bold text-amber-400">{incident.structuralIntegrityPct}% Intact</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">STATUS</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block">{incident.status}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">ELEVATION</span>
            <span className="text-xs font-bold text-cyan-400 mt-1 block">+{incident.location.elevationMeters || 10}m ASL</span>
          </div>
        </div>

        {/* Key Hazards */}
        <div className="mb-6">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Active Hazard Threat Vectors
          </h4>
          <div className="flex flex-wrap gap-2">
            {incident.keyHazards.map((hz, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-500/30 text-xs font-mono text-red-300 flex items-center space-x-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span>{hz}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Required Resources */}
        <div className="mb-8">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Required Resources & Personnel
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {incident.requiredResources.map((res, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200 font-medium">{res.type}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {res.count} {res.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onDispatch(incident.id);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Dispatch Matching Units Now</span>
          </button>

          <button
            onClick={() => {
              onOpenTriage(incident);
              onClose();
            }}
            className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Open Drone Vision Triage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
