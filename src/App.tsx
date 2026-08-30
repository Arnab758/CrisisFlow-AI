import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CrisisMap } from './components/CrisisMap';
import { MultimodalTriage } from './components/MultimodalTriage';
import { DispatchMatrix } from './components/DispatchMatrix';
import { CommanderIAP } from './components/CommanderIAP';
import { EmergencyBroadcast } from './components/EmergencyBroadcast';
import { ScenarioModal } from './components/ScenarioModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import {
  INITIAL_INCIDENTS,
  INITIAL_RESCUE_UNITS,
  INITIAL_SUPPLY_DEPOTS,
} from './data/mockCrisisData';
import { Incident, RescueUnit, SupplyDepot, DispatchPlanItem } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'triage' | 'dispatch' | 'iap' | 'broadcast'>('map');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [rescueUnits, setRescueUnits] = useState<RescueUnit[]>(INITIAL_RESCUE_UNITS);
  const [supplyDepots, setSupplyDepots] = useState<SupplyDepot[]>(INITIAL_SUPPLY_DEPOTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(INITIAL_INCIDENTS[0]);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('SCENARIO-HURRICANE');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [dispatchPlan, setDispatchPlan] = useState<DispatchPlanItem[]>([]);
  const [civiliansAssisted, setCiviliansAssisted] = useState<number>(48);

  // Real-time autonomous simulation ticker: advances units along routes, resolves missions
  useEffect(() => {
    const timer = setInterval(() => {
      setRescueUnits((prevUnits) => {
        return prevUnits.map((unit) => {
          if (unit.status === 'EN_ROUTE' && unit.targetIncidentId) {
            // Decrement ETA or transition to ON_SCENE
            const currentEta = unit.etaMinutes ?? 4;
            if (currentEta <= 1) {
              // Unit arrived on scene!
              setIncidents((prevIncidents) =>
                prevIncidents.map((inc) =>
                  inc.id === unit.targetIncidentId ? { ...inc, status: 'ON_SCENE' } : inc
                )
              );
              setCiviliansAssisted((c) => c + Math.floor(2 + Math.random() * 4));
              return { ...unit, status: 'ON_SCENE', etaMinutes: 0 };
            } else {
              return { ...unit, etaMinutes: currentEta - 1 };
            }
          }
          return unit;
        });
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Quick Dispatch single incident
  const handleQuickDispatch = (incidentId: string) => {
    const availableUnit = rescueUnits.find((u) => u.status === 'AVAILABLE');
    if (!availableUnit) {
      alert('All tactical units are currently deployed or refueling. Recall a unit or wait for mission completion.');
      return;
    }

    setRescueUnits((prev) =>
      prev.map((u) =>
        u.id === availableUnit.id
          ? {
              ...u,
              status: 'EN_ROUTE',
              targetIncidentId: incidentId,
              etaMinutes: Math.floor(3 + Math.random() * 5),
            }
          : u
      )
    );

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'DISPATCHED',
              assignedUnitIds: [...inc.assignedUnitIds, availableUnit.id],
            }
          : inc
      )
    );
  };

  // Run Autonomous Gemini AI Dispatch Optimizer
  const handleOptimizeDispatch = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/dispatch/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidents,
          units: rescueUnits,
        }),
      });

      const data = await res.json();
      if (data.dispatchPlan) {
        setDispatchPlan(data.dispatchPlan);

        // Apply assignments to state
        data.dispatchPlan.forEach((item: DispatchPlanItem) => {
          setRescueUnits((prev) =>
            prev.map((u) =>
              u.id === item.assignedUnitId
                ? {
                    ...u,
                    status: 'EN_ROUTE',
                    targetIncidentId: item.incidentId,
                    etaMinutes: item.estimatedEtaMinutes,
                  }
                : u
            )
          );

          setIncidents((prev) =>
            prev.map((inc) =>
              inc.id === item.incidentId
                ? {
                    ...inc,
                    status: 'DISPATCHED',
                    assignedUnitIds: Array.from(new Set([...inc.assignedUnitIds, item.assignedUnitId])),
                  }
                : inc
            )
          );
        });

        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error('Failed to optimize dispatch:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Manual Unit Dispatch
  const handleManualDispatchUnit = (unitId: string, incidentId: string) => {
    setRescueUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              status: 'EN_ROUTE',
              targetIncidentId: incidentId,
              etaMinutes: Math.floor(2 + Math.random() * 4),
            }
          : u
      )
    );

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'DISPATCHED',
              assignedUnitIds: Array.from(new Set([...inc.assignedUnitIds, unitId])),
            }
          : inc
      )
    );
  };

  // Recall Unit to Base
  const handleRecallUnit = (unitId: string) => {
    setRescueUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              status: 'AVAILABLE',
              targetIncidentId: undefined,
              etaMinutes: undefined,
            }
          : u
      )
    );
  };

  // Inject New Incident from Drone Triage
  const handleInjectIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    setActiveTab('map');
  };

  // Spawn Random Emergency Crisis into Map
  const handleSpawnNewIncident = () => {
    const types = ['FLOOD', 'WILDFIRE', 'HAZMAT', 'STRUCTURAL_COLLAPSE'] as const;
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const idNum = Math.floor(100 + Math.random() * 900);

    const randomIncident: Incident = {
      id: `INC-2026-${idNum}`,
      title: `Emergency Flash Alert: ${chosenType.replace('_', ' ')} Spike in Sector ${String.fromCharCode(
        65 + Math.floor(Math.random() * 4)
      )}`,
      type: chosenType,
      priority: Math.random() > 0.4 ? 'P1-CRITICAL' : 'P2-HIGH',
      status: 'PENDING',
      location: {
        lat: 37.7400 + Math.random() * 0.06,
        lng: -122.4600 + Math.random() * 0.06,
        sectorName: `Sector ${String.fromCharCode(65 + Math.floor(Math.random() * 4))} (Active)`,
        gridRef: `GR-${Math.floor(1000 + Math.random() * 9000)}`,
        elevationMeters: Math.floor(10 + Math.random() * 120),
      },
      reportedAt: 'Just now',
      casualtyEstimate: Math.floor(4 + Math.random() * 18),
      structuralIntegrityPct: Math.floor(25 + Math.random() * 50),
      hazardSummary: 'Rapidly unfolding multi-hazard event detected via real-time satellite radar and municipal sensors.',
      keyHazards: ['Impassable primary artery', 'Rising threat levels', 'Power disruption'],
      requiredResources: [
        { type: 'Heavy Rescue Squad', count: 2, unit: 'Squads', urgency: 'IMMEDIATE' },
        { type: 'Emergency Medical Ambulances', count: 3, unit: 'Units', urgency: 'HIGH' },
      ],
      assignedUnitIds: [],
      source: 'SENSOR_ARRAY',
      aiConfidence: 93,
    };

    setIncidents((prev) => [randomIncident, ...prev]);
    setSelectedIncident(randomIncident);
  };

  // Handle Scenario Switch
  const handleSelectScenario = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
    setIncidents(INITIAL_INCIDENTS);
    setRescueUnits(INITIAL_RESCUE_UNITS);
    setDispatchPlan([]);
  };

  const criticalCount = incidents.filter((i) => i.priority === 'P1-CRITICAL').length;
  const unitsActiveCount = rescueUnits.filter((u) => u.status !== 'AVAILABLE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeIncidentsCount={incidents.length}
        criticalCount={criticalCount}
        unitsActiveCount={unitsActiveCount}
        civiliansAssisted={civiliansAssisted}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <CrisisMap
            incidents={incidents}
            rescueUnits={rescueUnits}
            supplyDepots={supplyDepots}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            onQuickDispatch={handleQuickDispatch}
            onSpawnNewIncident={handleSpawnNewIncident}
            onOpenTriageForIncident={(inc) => {
              setSelectedIncident(inc);
              setActiveTab('triage');
            }}
          />
        )}

        {activeTab === 'triage' && (
          <MultimodalTriage
            onInjectIncident={handleInjectIncident}
            onNavigateToDispatch={() => setActiveTab('dispatch')}
          />
        )}

        {activeTab === 'dispatch' && (
          <DispatchMatrix
            incidents={incidents}
            rescueUnits={rescueUnits}
            supplyDepots={supplyDepots}
            onOptimizeDispatch={handleOptimizeDispatch}
            onManualDispatchUnit={handleManualDispatchUnit}
            onRecallUnit={handleRecallUnit}
            isOptimizing={isOptimizing}
            dispatchPlan={dispatchPlan}
          />
        )}

        {activeTab === 'iap' && (
          <CommanderIAP
            incidents={incidents}
            rescueUnits={rescueUnits}
            supplyDepots={supplyDepots}
          />
        )}

        {activeTab === 'broadcast' && <EmergencyBroadcast incidents={incidents} />}
      </main>

      {/* Modals */}
      <ScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectScenario={handleSelectScenario}
        currentScenarioId={currentScenarioId}
      />
    </div>
  );
}
