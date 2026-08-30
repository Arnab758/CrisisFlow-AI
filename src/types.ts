export type PriorityLevel = 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MODERATE' | 'P4-LOW';
export type IncidentStatus = 'PENDING' | 'TRIAGED' | 'DISPATCHED' | 'ON_SCENE' | 'CONTAINED' | 'RESOLVED';
export type DisasterType = 'FLOOD' | 'EARTHQUAKE' | 'WILDFIRE' | 'HURRICANE' | 'STRUCTURAL_COLLAPSE' | 'HAZMAT';

export interface IncidentLocation {
  lat: number;
  lng: number;
  sectorName: string;
  gridRef: string;
  elevationMeters?: number;
}

export interface RequiredResource {
  type: string;
  count: number;
  unit: string;
  urgency: 'IMMEDIATE' | 'HIGH' | 'ROUTINE';
}

export interface Incident {
  id: string;
  title: string;
  type: DisasterType;
  priority: PriorityLevel;
  status: IncidentStatus;
  location: IncidentLocation;
  reportedAt: string;
  casualtyEstimate: number;
  structuralIntegrityPct: number;
  hazardSummary: string;
  keyHazards: string[];
  requiredResources: RequiredResource[];
  assignedUnitIds: string[];
  imageUrl?: string;
  source: 'DRONE_FEED' | 'CITIZEN_REPORT' | 'SATELLITE_RADAR' | 'SENSOR_ARRAY';
  aiConfidence: number;
}

export interface RescueUnit {
  id: string;
  callsign: string;
  type: 'AIR_EVAC_DRONE' | 'HEAVY_SAR' | 'AMPHIBIOUS_RESCUE' | 'MOBILE_ICU' | 'HAZMAT_CONTAINMENT' | 'SUPPLY_AIRDROP';
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'RETURNING' | 'MAINTENANCE';
  currentLocation: { lat: number; lng: number };
  targetIncidentId?: string;
  crewCount: number;
  capacity: number;
  batteryOrFuelPct: number;
  etaMinutes?: number;
}

export interface SupplyDepot {
  id: string;
  name: string;
  location: { lat: number; lng: number; sectorName: string };
  supplies: {
    potableWaterLitres: number;
    traumaKits: number;
    mreRations: number;
    generators: number;
    inflatableBoats: number;
  };
  operationalCapacityPct: number;
}

export interface TriageAnalysisResult {
  title: string;
  disasterType: DisasterType;
  priority: PriorityLevel;
  structuralIntegrityPct: number;
  casualtyEstimate: number;
  hazardSummary: string;
  keyHazards: string[];
  requiredResources: RequiredResource[];
  recommendedUnitTypes: string[];
  triageRationale: string;
  immediateActionRequired: string;
  aiConfidence: number;
}

export interface DispatchPlanItem {
  incidentId: string;
  incidentTitle: string;
  assignedUnitId: string;
  unitCallsign: string;
  unitType: string;
  estimatedEtaMinutes: number;
  dispatchPriority: number;
  logisticsRationale: string;
  routesWaypoints: { lat: number; lng: number }[];
}

export interface IncidentActionPlan {
  operationalPeriod: string;
  incidentCommander: string;
  executiveSummary: string;
  primaryObjectives: string[];
  safetyBriefing: string;
  weatherAndTerrainHazards: string;
  divisionAssignments: {
    division: string;
    focus: string;
    assignedUnits: string[];
    status: string;
  }[];
  criticalBottlenecks: string[];
}

export interface EmergencyBroadcast {
  language: string;
  languageCode: string;
  urgencyLevel: string;
  smsAlert: string;
  radioTranscript: string;
  publicAddressAnnouncement: string;
  shelterGuidance: string;
}
