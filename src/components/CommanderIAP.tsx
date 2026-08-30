import React, { useState } from 'react';
import { Incident, RescueUnit, SupplyDepot, IncidentActionPlan } from '../types';
import {
  FileText,
  Sparkles,
  RefreshCw,
  Printer,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Users,
  Layers,
  Zap,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface CommanderIAPProps {
  incidents: Incident[];
  rescueUnits: RescueUnit[];
  supplyDepots: SupplyDepot[];
}

export const CommanderIAP: React.FC<CommanderIAPProps> = ({
  incidents,
  rescueUnits,
  supplyDepots,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [iapData, setIapData] = useState<IncidentActionPlan | null>(null);

  const handleGenerateIAP = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/iap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidents,
          units: rescueUnits,
          depots: supplyDepots,
          scenarioName: 'Operation CrisisFlow: Multi-Sector Disaster Response',
        }),
      });

      const data = await res.json();
      if (data.iap) {
        setIapData(data.iap);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Error generating IAP:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>FEMA ICS-201 / ICS-202 Unified Command Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Incident Action Plan (IAP) Workbench
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Synthesize an official, multi-agency Incident Action Plan. Formatted for emergency commanders, FEMA coordinators, and ground division leaders with real-time operational objectives and safety protocols.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {iapData && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export Plan</span>
            </button>
          )}

          <button
            onClick={handleGenerateIAP}
            disabled={isGenerating}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing ICS Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Official IAP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Plan */}
      {iapData ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none"
        >
          {/* Official FEMA ICS Document Header */}
          <div className="border-b-2 border-slate-700 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  ICS FORM 201/202 BRIEFING
                </span>
                <span className="text-xs font-mono text-slate-400">UNIFIED COMMAND MATRIX</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{iapData.incidentCommander}</h3>
              <p className="text-xs font-mono text-emerald-400 mt-1 font-semibold">{iapData.operationalPeriod}</p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 space-y-1">
              <div>ACTIVE CRISIS NODES: <span className="text-slate-100 font-bold">{incidents.length}</span></div>
              <div>DEPLOYED ASSETS: <span className="text-emerald-400 font-bold">{rescueUnits.length}</span></div>
              <div>CLASSIFICATION: <span className="text-red-400 font-bold">UNRESTRICTED COMMAND</span></div>
            </div>
          </div>

          {/* Executive Situational Summary */}
          <div>
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Shield className="w-4 h-4" />
              <span>Executive Situational Overview</span>
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
              {iapData.executiveSummary}
            </div>
          </div>

          {/* Strategic Objectives */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Primary Commander Objectives (Operational Period)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {iapData.primaryObjectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs"
                >
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px]">
                    0{idx + 1}
                  </span>
                  <span className="text-slate-200 font-medium leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Division & Branch Assignments */}
          <div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Layers className="w-4 h-4" />
              <span>Tactical Division Assignments & Asset Allocation</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {iapData.divisionAssignments.map((div, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-xs text-slate-100">{div.division}</h5>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                        {div.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">{div.focus}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">ASSIGNED ASSETS:</span>
                    <div className="flex flex-wrap gap-1">
                      {div.assignedUnits.map((u, uIdx) => (
                        <span key={uIdx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-800">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocols & Hazards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl">
              <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Personnel Safety & Protection Briefing</span>
              </h4>
              <p className="text-xs text-red-200 leading-relaxed">{iapData.safetyBriefing}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Zap className="w-4 h-4" />
                <span>Weather & Environmental Obstacles</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{iapData.weatherAndTerrainHazards}</p>
            </div>
          </div>

          {/* Critical Bottlenecks */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Identified Logistics Bottlenecks & Required Interventions
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              {iapData.criticalBottlenecks.map((bt, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>{bt}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">FEMA Incident Action Plan Ready for Synthesis</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Click &quot;Generate Official IAP&quot; to aggregate real-time crisis coordinates, active SAR squads, and staging base inventory into an executive operational directive.
          </p>
          <button
            onClick={handleGenerateIAP}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all hover:scale-105"
          >
            Synthesize Action Plan Now
          </button>
        </div>
      )}
    </div>
  );
};
