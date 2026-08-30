import React from 'react';
import { Shield, AlertTriangle, Radio, Activity, Cpu, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'triage' | 'dispatch' | 'iap' | 'broadcast';
  setActiveTab: (tab: 'map' | 'triage' | 'dispatch' | 'iap' | 'broadcast') => void;
  activeIncidentsCount: number;
  criticalCount: number;
  unitsActiveCount: number;
  civiliansAssisted: number;
  onOpenScenarioModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeIncidentsCount,
  criticalCount,
  unitsActiveCount,
  civiliansAssisted,
  onOpenScenarioModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  CrisisFlow AI
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                  LIVE GRID
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Autonomous Disaster Logistics & Multimodal Triage Grid
              </p>
            </div>
          </div>

          {/* Quick Scenario Preset Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={onOpenScenarioModal}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              title="Switch Operational Crisis Scenario"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Operational Scenario</span>
            </button>

            {/* Live Telemetry Pills */}
            <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{criticalCount} P1 Critical</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center space-x-1.5 text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
                <span>{unitsActiveCount} Units Deployed</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>{civiliansAssisted} Civilians Saved</span>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tactical Grid</span>
            </button>

            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'triage'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Drone Triage</span>
            </button>

            <button
              onClick={() => setActiveTab('dispatch')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'dispatch'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Rescue Dispatch</span>
            </button>

            <button
              onClick={() => setActiveTab('iap')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'iap'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>FEMA IAP</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'broadcast'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Emergency Broadcast</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
