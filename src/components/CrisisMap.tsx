import React, { useState } from 'react';
import { Incident, RescueUnit, SupplyDepot } from '../types';
import {
  AlertTriangle,
  Flame,
  Droplets,
  Building,
  Radio,
  Layers,
  Wind,
  Compass,
  Zap,
  CheckCircle2,
  Navigation,
  Box,
  SlidersHorizontal,
  PlusCircle,
  Eye,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CrisisMapProps {
  incidents: Incident[];
  rescueUnits: RescueUnit[];
  supplyDepots: SupplyDepot[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident | null) => void;
  onQuickDispatch: (incidentId: string) => void;
  onSpawnNewIncident: () => void;
  onOpenTriageForIncident: (incident: Incident) => void;
}

export const CrisisMap: React.FC<CrisisMapProps> = ({
  incidents,
  rescueUnits,
  supplyDepots,
  selectedIncident,
  onSelectIncident,
  onQuickDispatch,
  onSpawnNewIncident,
  onOpenTriageForIncident,
}) => {
  // Layer toggles
  const [showThermalLayer, setShowThermalLayer] = useState(true);
  const [showFloodDepthLayer, setShowFloodDepthLayer] = useState(true);
  const [showSeismicLayer, setShowSeismicLayer] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  // Convert GPS Coordinates (San Francisco Bay test bounds: 37.72 to 37.82, -122.48 to -122.38) to SVG % (0-100)
  const mapLatRange = [37.72, 37.82];
  const mapLngRange = [-122.48, -122.38];

  const getSvgCoords = (lat: number, lng: number) => {
    const x = ((lng - mapLngRange[0]) / (mapLngRange[1] - mapLngRange[0])) * 100;
    const y = (1 - (lat - mapLatRange[0]) / (mapLatRange[1] - mapLatRange[0])) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.priority === filterSeverity;
  });

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'FLOOD':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'WILDFIRE':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'HAZMAT':
        return <Radio className="w-4 h-4 text-emerald-400" />;
      case 'STRUCTURAL_COLLAPSE':
      case 'EARTHQUAKE':
      default:
        return <Building className="w-4 h-4 text-amber-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1-CRITICAL':
        return 'bg-red-500 border-red-400 text-white shadow-red-500/50';
      case 'P2-HIGH':
        return 'bg-orange-500 border-orange-400 text-white shadow-orange-500/50';
      case 'P3-MODERATE':
        return 'bg-amber-500 border-amber-400 text-slate-900 shadow-amber-500/50';
      default:
        return 'bg-blue-500 border-blue-400 text-white shadow-blue-500/50';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Tactical Canvas Area */}
      <div className="relative flex-1 h-full bg-[#0a0f1d] overflow-hidden select-none border-r border-slate-800 flex flex-col">
        {/* Top Floating Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-2xl">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950 rounded-lg text-xs font-mono text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>GRID: SECTOR-01-TAC</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Layer Toggles */}
          <button
            onClick={() => setShowFloodDepthLayer(!showFloodDepthLayer)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              showFloodDepthLayer
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Hydro Flood Inundation Overlay"
          >
            <Droplets className="w-3 h-3" />
            <span>Flood Surge</span>
          </button>

          <button
            onClick={() => setShowThermalLayer(!showThermalLayer)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              showThermalLayer
                ? 'bg-red-950/80 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle FLIR Thermal Hotspots"
          >
            <Flame className="w-3 h-3" />
            <span>Thermal FLIR</span>
          </button>

          <button
            onClick={() => setShowSeismicLayer(!showSeismicLayer)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              showSeismicLayer
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Seismic Fault Vectors"
          >
            <Zap className="w-3 h-3" />
            <span>Fault Lines</span>
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              showRoutes
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Autonomous Dispatch Corridors"
          >
            <Navigation className="w-3 h-3" />
            <span>Routes</span>
          </button>
        </div>

        {/* Top Right Spawn Trigger */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <button
            onClick={onSpawnNewIncident}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 border border-red-400/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Inject Crisis Alert</span>
          </button>
        </div>

        {/* GIS Vector Map Canvas */}
        <div className="relative w-full h-full cursor-crosshair overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Subtle Grid Pattern */}
              <pattern id="tacGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.15" />
              </pattern>

              {/* Water Inundation Radial Gradient */}
              <radialGradient id="floodGlow1" cx="65%" cy="30%" r="25%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0" />
              </radialGradient>

              {/* Thermal Fire Hazard Gradient */}
              <radialGradient id="fireGlow1" cx="25%" cy="75%" r="20%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0" />
              </radialGradient>

              {/* HazMat Vapor Plume Gradient */}
              <radialGradient id="hazmatGlow" cx="80%" cy="60%" r="18%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="100" height="100" fill="#090d16" />
            <rect width="100" height="100" fill="url(#tacGrid)" />

            {/* Topological Contour Vector Lines */}
            <g stroke="#1e293b" strokeWidth="0.2" fill="none" opacity="0.6">
              <path d="M 0 20 Q 30 15 50 35 T 100 25" />
              <path d="M 0 45 Q 25 55 60 40 T 100 65" />
              <path d="M 0 70 Q 40 60 70 85 T 100 80" />
              <path d="M 20 0 Q 35 40 15 80 T 30 100" />
              <path d="M 70 0 Q 85 45 65 75 T 80 100" />
            </g>

            {/* Dynamic Hazard Heatmap Overlays */}
            {showFloodDepthLayer && (
              <g>
                <circle cx="65" cy="30" r="22" fill="url(#floodGlow1)" />
                <circle cx="35" cy="45" r="15" fill="url(#floodGlow1)" />
                <path
                  d="M 50 20 Q 70 30 85 45"
                  stroke="#06b6d4"
                  strokeWidth="0.6"
                  strokeDasharray="1 1"
                  fill="none"
                  opacity="0.8"
                />
              </g>
            )}

            {showThermalLayer && (
              <g>
                <circle cx="25" cy="75" r="18" fill="url(#fireGlow1)" />
                <path
                  d="M 15 80 Q 25 65 40 75"
                  stroke="#f97316"
                  strokeWidth="0.5"
                  strokeDasharray="1.5 0.5"
                  fill="none"
                  opacity="0.7"
                />
              </g>
            )}

            {showSeismicLayer && (
              <g>
                <line x1="10" y1="10" x2="90" y2="90" stroke="#eab308" strokeWidth="0.4" strokeDasharray="1 2" />
                <circle cx="50" cy="50" r="12" stroke="#eab308" strokeWidth="0.3" fill="none" opacity="0.4" />
                <circle cx="50" cy="50" r="24" stroke="#eab308" strokeWidth="0.2" fill="none" opacity="0.2" />
              </g>
            )}

            {/* Dynamic Dispatch Route Corridors */}
            {showRoutes &&
              rescueUnits
                .filter((u) => u.targetIncidentId && u.status === 'EN_ROUTE')
                .map((unit) => {
                  const targetInc = incidents.find((i) => i.id === unit.targetIncidentId);
                  if (!targetInc) return null;
                  const from = getSvgCoords(unit.currentLocation.lat, unit.currentLocation.lng);
                  const to = getSvgCoords(targetInc.location.lat, targetInc.location.lng);
                  return (
                    <g key={`route-${unit.id}`}>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke="#10b981"
                        strokeWidth="0.6"
                        strokeDasharray="1.2 0.8"
                        className="animate-pulse"
                      />
                      {/* Midpoint waypoint ping */}
                      <circle
                        cx={(from.x + to.x) / 2}
                        cy={(from.y + to.y) / 2}
                        r="0.8"
                        fill="#34d399"
                        opacity="0.8"
                      />
                    </g>
                  );
                })}

            {/* Supply Depots on SVG */}
            {supplyDepots.map((depot) => {
              const coords = getSvgCoords(depot.location.lat, depot.location.lng);
              return (
                <g key={depot.id} transform={`translate(${coords.x}, ${coords.y})`}>
                  <rect x="-2" y="-2" width="4" height="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.3" rx="0.5" />
                  <circle cx="0" cy="0" r="1.2" fill="#3b82f6" opacity="0.9" />
                  <text x="3" y="1" fill="#93c5fd" fontSize="1.8" fontWeight="bold" fontFamily="monospace">
                    {depot.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* HTML Overlay: Incidents Markers */}
          {filteredIncidents.map((incident) => {
            const coords = getSvgCoords(incident.location.lat, incident.location.lng);
            const isSelected = selectedIncident?.id === incident.id;
            const isCritical = incident.priority === 'P1-CRITICAL';

            return (
              <div
                key={incident.id}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                onClick={() => onSelectIncident(incident)}
              >
                {/* Pulsing Radar Ring */}
                <div
                  className={`absolute -inset-3 rounded-full opacity-75 animate-ping pointer-events-none ${
                    isCritical ? 'bg-red-500/40' : 'bg-orange-500/30'
                  }`}
                />

                {/* Pin Head Button */}
                <button
                  className={`relative p-2 rounded-xl shadow-xl border flex items-center justify-center transition-transform transform group-hover:scale-125 ${getPriorityColor(
                    incident.priority
                  )} ${isSelected ? 'ring-4 ring-amber-400 scale-125 z-40' : ''}`}
                >
                  {getIncidentIcon(incident.type)}
                </button>

                {/* Mini Quick Label */}
                <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-slate-200 pointer-events-none opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-md">
                  <span className="font-bold text-amber-400">{incident.id}</span> | {incident.location.gridRef}
                </div>
              </div>
            );
          })}

          {/* HTML Overlay: Rescue Units Markers */}
          {rescueUnits.map((unit) => {
            const coords = getSvgCoords(unit.currentLocation.lat, unit.currentLocation.lng);
            const isEnRoute = unit.status === 'EN_ROUTE';

            return (
              <motion.div
                key={unit.id}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                animate={{
                  scale: isEnRoute ? [1, 1.1, 1] : 1,
                }}
                transition={{ repeat: isEnRoute ? Infinity : 0, duration: 2 }}
              >
                <div className="bg-emerald-500/20 border border-emerald-400 p-1.5 rounded-lg backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Navigation className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-300 border border-emerald-500/30">
                  {unit.callsign.split(' ')[0]}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Status Ticker */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RADAR SYNCHRONIZED: 100% OPERATIONAL</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">COORDINATES: WGS-84 CALIBRATED</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-300 font-bold">{filteredIncidents.length} INCIDENTS ACTIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{rescueUnits.length} RESCUE ASSETS READY</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Incident Inspector & Live Triage Queue */}
      <div className="w-full lg:w-96 h-auto lg:h-full bg-slate-900 flex flex-col border-l border-slate-800 overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Incident Command Queue</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300">
              {incidents.length} Total
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            {['ALL', 'P1-CRITICAL', 'P2-HIGH', 'P3-MODERATE'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-1 rounded text-[10px] font-semibold tracking-wider whitespace-nowrap transition-all ${
                  filterSeverity === sev
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Incident Deep Inspection Card */}
        {selectedIncident ? (
          <div className="p-4 bg-slate-800/60 border-b border-slate-700 m-3 rounded-xl shadow-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(selectedIncident.priority)}`}>
                {selectedIncident.priority}
              </span>
              <span className="text-[11px] font-mono text-slate-400">{selectedIncident.location.sectorName}</span>
            </div>

            <h4 className="font-bold text-sm text-slate-100 mb-2 leading-snug">{selectedIncident.title}</h4>
            <p className="text-xs text-slate-300 mb-3 line-clamp-3">{selectedIncident.hazardSummary}</p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">EST. CASUALTIES</span>
                <span className="font-bold text-red-400 text-sm">{selectedIncident.casualtyEstimate} Persons</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">STRUCTURAL INTEGRITY</span>
                <span className="font-bold text-amber-400 text-sm">{selectedIncident.structuralIntegrityPct}%</span>
              </div>
            </div>

            {/* Key Hazards List */}
            <div className="mb-3">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">ACTIVE THREAT VECTORS</span>
              <div className="flex flex-wrap gap-1">
                {selectedIncident.keyHazards.map((hz, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 text-[10px] border border-red-500/30">
                    {hz}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60">
              <button
                onClick={() => onQuickDispatch(selectedIncident.id)}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-Dispatch</span>
              </button>

              <button
                onClick={() => onOpenTriageForIncident(selectedIncident)}
                className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Run Drone AI</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 my-auto">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
            <p className="text-xs font-medium">Click any incident pin on the map to inspect or dispatch tactical units.</p>
          </div>
        )}

        {/* Incident List */}
        <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
          <div className="text-[11px] font-mono font-semibold text-slate-400 px-1">ACTIVE THREAT REGISTRY</div>
          {filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getPriorityColor(incident.priority)}`}>
                    {incident.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{incident.reportedAt}</span>
                </div>

                <h5 className="font-semibold text-xs text-slate-200 line-clamp-1 mb-1">{incident.title}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{incident.hazardSummary}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>{incident.location.gridRef}</span>
                  <span className="text-emerald-400 font-semibold">{incident.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
