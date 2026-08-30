import React, { useState } from 'react';
import { Incident, RescueUnit, SupplyDepot, DispatchPlanItem } from '../types';
import {
  Shield,
  Navigation,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  BatteryCharging,
  Users,
  Box,
  Truck,
  AlertTriangle,
  Flame,
  Droplets,
  Building,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface DispatchMatrixProps {
  incidents: Incident[];
  rescueUnits: RescueUnit[];
  supplyDepots: SupplyDepot[];
  onOptimizeDispatch: () => Promise<void>;
  onManualDispatchUnit: (unitId: string, incidentId: string) => void;
  onRecallUnit: (unitId: string) => void;
  isOptimizing: boolean;
  dispatchPlan: DispatchPlanItem[];
}

export const DispatchMatrix: React.FC<DispatchMatrixProps> = ({
  incidents,
  rescueUnits,
  supplyDepots,
  onOptimizeDispatch,
  onManualDispatchUnit,
  onRecallUnit,
  isOptimizing,
  dispatchPlan,
}) => {
  const [selectedIncidentForAssign, setSelectedIncidentForAssign] = useState<string>(incidents[0]?.id || '');

  const getUnitTypeIcon = (type: string) => {
    switch (type) {
      case 'AIR_EVAC_DRONE':
        return <Navigation className="w-4 h-4 text-cyan-400" />;
      case 'HEAVY_SAR':
        return <Shield className="w-4 h-4 text-amber-400" />;
      case 'AMPHIBIOUS_RESCUE':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'MOBILE_ICU':
        return <Truck className="w-4 h-4 text-rose-400" />;
      case 'HAZMAT_CONTAINMENT':
        return <Radio className="w-4 h-4 text-emerald-400" />;
      case 'SUPPLY_AIRDROP':
      default:
        return <Box className="w-4 h-4 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AVAILABLE</span>;
      case 'EN_ROUTE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">EN ROUTE</span>;
      case 'ON_SCENE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">ON SCENE</span>;
      case 'RETURNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">RETURNING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Tactical Resource Logistics & Fleet Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Autonomous Rescue Dispatch Matrix
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Execute real-time autonomous multi-unit dispatch. The Gemini AI optimizer matches specialized rescue capabilities to incident urgency, minimizing response latency and routing through safe corridors.
          </p>
        </div>

        {/* AI Optimize Button */}
        <button
          onClick={onOptimizeDispatch}
          disabled={isOptimizing}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Optimizing Logistics Grid...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Autonomous Dispatch</span>
            </>
          )}
        </button>
      </div>

      {/* AI Dispatch Plan Recommendations (if calculated) */}
      {dispatchPlan && dispatchPlan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Optimized Routing & Allocation Plan (Active)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{dispatchPlan.length} Missions Scheduled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dispatchPlan.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">{item.unitCallsign}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                      ETA: {item.estimatedEtaMinutes} min
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">{item.incidentTitle}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{item.logisticsRationale}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                  <span>Priority #{item.dispatchPriority}</span>
                  <span className="text-emerald-400 font-semibold">Auto-Synced</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Grid: Fleet Roster & Staging Depots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rescue Units Fleet (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Active Rescue & Tactical Fleet Roster</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{rescueUnits.length} Units On Duty</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rescueUnits.map((unit) => {
                const targetIncident = incidents.find((i) => i.id === unit.targetIncidentId);
                return (
                  <div
                    key={unit.id}
                    className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getUnitTypeIcon(unit.type)}
                          <span className="font-bold text-xs text-slate-200">{unit.callsign}</span>
                        </div>
                        {getStatusBadge(unit.status)}
                      </div>

                      {/* Telemetry Chips */}
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono mb-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block">CREW</span>
                          <span className="text-slate-300 font-semibold">{unit.crewCount} Personnel</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">CAPACITY</span>
                          <span className="text-slate-300 font-semibold">{unit.capacity} Souls</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">POWER</span>
                          <span className="text-emerald-400 font-semibold">{unit.batteryOrFuelPct}%</span>
                        </div>
                      </div>

                      {targetIncident && (
                        <div className="mb-3 p-2 bg-amber-950/30 rounded border border-amber-500/20 text-[11px]">
                          <span className="text-amber-400 font-mono font-bold block mb-0.5">Assigned Target:</span>
                          <span className="text-slate-200 line-clamp-1">{targetIncident.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            Sector: {targetIncident.location.sectorName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                      {unit.status === 'AVAILABLE' ? (
                        <button
                          onClick={() => onManualDispatchUnit(unit.id, selectedIncidentForAssign || incidents[0]?.id)}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Dispatch to Priority</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onRecallUnit(unit.id)}
                          className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Recall to Base</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Supply Depots & Inventory Logistics (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Box className="w-4 h-4 text-purple-400" />
                <span>Regional Staging Depots</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{supplyDepots.length} Active Bases</span>
            </div>

            <div className="space-y-4">
              {supplyDepots.map((depot) => (
                <div key={depot.id} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-xs text-slate-200">{depot.name}</h5>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {depot.operationalCapacityPct}% Capacity
                    </span>
                  </div>

                  {/* Stock Breakdown */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Potable Water:</span>
                      <span className="text-cyan-400 font-bold">{depot.supplies.potableWaterLitres.toLocaleString()} L</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Trauma Kits:</span>
                      <span className="text-rose-400 font-bold">{depot.supplies.traumaKits} Kits</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>MRE Rations:</span>
                      <span className="text-amber-400 font-bold">{depot.supplies.mreRations.toLocaleString()} Pk</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Inflatable Boats:</span>
                      <span className="text-blue-400 font-bold">{depot.supplies.inflatableBoats} Vessels</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
