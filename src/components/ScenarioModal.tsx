import React from 'react';
import { PRESET_DISASTER_SCENARIOS } from '../data/mockCrisisData';
import { Sparkles, X, CloudRain, Activity, Flame, ShieldAlert, Check } from 'lucide-react';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioId: string) => void;
  currentScenarioId: string;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  currentScenarioId,
}) => {
  if (!isOpen) return null;

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-6 h-6 text-cyan-400" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-amber-400" />;
      case 'Flame':
      default:
        return <Flame className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Operational Crisis Environment Switcher</span>
        </div>
        <h3 className="text-xl font-extrabold text-white mb-1">Select Disaster Operations Theater</h3>
        <p className="text-xs text-slate-400 mb-6">
          Switch operational environments to re-calibrate the command grid with active emergency conditions, weather vectors, and casualty profiles.
        </p>

        {/* Scenario Options */}
        <div className="space-y-3 mb-6">
          {PRESET_DISASTER_SCENARIOS.map((sc) => {
            const isSelected = currentScenarioId === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-start space-x-4 ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 shadow-lg ring-1 ring-amber-500'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                  {getScenarioIcon(sc.iconName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-slate-100">{sc.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{sc.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono transition-all"
          >
            Cancel & Close
          </button>
        </div>
      </div>
    </div>
  );
};
