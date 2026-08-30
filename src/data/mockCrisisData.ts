import { Incident, RescueUnit, SupplyDepot } from '../types';

export const INITIAL_SUPPLY_DEPOTS: SupplyDepot[] = [
  {
    id: 'DEPOT-ALPHA',
    name: 'Depot Alpha (Metropolitan Staging Base)',
    location: { lat: 37.7749, lng: -122.4194, sectorName: 'Sector Alpha - Central Command' },
    supplies: {
      potableWaterLitres: 45000,
      traumaKits: 380,
      mreRations: 12500,
      generators: 42,
      inflatableBoats: 18,
    },
    operationalCapacityPct: 94,
  },
  {
    id: 'DEPOT-BRAVO',
    name: 'Depot Bravo (Harbor & Marine Base)',
    location: { lat: 37.8044, lng: -122.4089, sectorName: 'Sector Bravo - Waterfront' },
    supplies: {
      potableWaterLitres: 28000,
      traumaKits: 220,
      mreRations: 8000,
      generators: 25,
      inflatableBoats: 35,
    },
    operationalCapacityPct: 88,
  },
  {
    id: 'DEPOT-CHARLIE',
    name: 'Depot Charlie (Highland Forward Outpost)',
    location: { lat: 37.7500, lng: -122.4477, sectorName: 'Sector Charlie - Ridge Ridge' },
    supplies: {
      potableWaterLitres: 19500,
      traumaKits: 160,
      mreRations: 6400,
      generators: 18,
      inflatableBoats: 4,
    },
    operationalCapacityPct: 76,
  },
];

export const INITIAL_RESCUE_UNITS: RescueUnit[] = [
  {
    id: 'UNIT-SKY-101',
    callsign: 'AeroLifter-101 (Helivac Drone)',
    type: 'AIR_EVAC_DRONE',
    status: 'AVAILABLE',
    currentLocation: { lat: 37.7749, lng: -122.4194 },
    crewCount: 0,
    capacity: 2,
    batteryOrFuelPct: 92,
  },
  {
    id: 'UNIT-SAR-204',
    callsign: 'Vanguard-204 (Heavy Urban SAR)',
    type: 'HEAVY_SAR',
    status: 'AVAILABLE',
    currentLocation: { lat: 37.7600, lng: -122.4350 },
    crewCount: 8,
    capacity: 12,
    batteryOrFuelPct: 85,
  },
  {
    id: 'UNIT-AQUA-308',
    callsign: 'Nautilus-308 (Amphibious Swiftwater)',
    type: 'AMPHIBIOUS_RESCUE',
    status: 'AVAILABLE',
    currentLocation: { lat: 37.8044, lng: -122.4089 },
    crewCount: 4,
    capacity: 8,
    batteryOrFuelPct: 96,
  },
  {
    id: 'UNIT-MEDIC-412',
    callsign: 'LifeGuard-412 (Mobile ICU Trauma)',
    type: 'MOBILE_ICU',
    status: 'AVAILABLE',
    currentLocation: { lat: 37.7850, lng: -122.4200 },
    crewCount: 6,
    capacity: 4,
    batteryOrFuelPct: 78,
  },
  {
    id: 'UNIT-AIRDROP-505',
    callsign: 'SupplyFalcon-505 (Cargo Drone Cluster)',
    type: 'SUPPLY_AIRDROP',
    status: 'AVAILABLE',
    currentLocation: { lat: 37.7500, lng: -122.4477 },
    crewCount: 0,
    capacity: 500,
    batteryOrFuelPct: 88,
  },
  {
    id: 'UNIT-HAZ-601',
    callsign: 'ChemShield-601 (HazMat & Gas Neutralizer)',
    type: 'HAZMAT_CONTAINMENT',
    status: 'AVAILABLE',
    currentLocation: { lat: 37.7700, lng: -122.4000 },
    crewCount: 5,
    capacity: 6,
    batteryOrFuelPct: 91,
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-081',
    title: 'Hospital Complex Power Severed & Flood Surge',
    type: 'FLOOD',
    priority: 'P1-CRITICAL',
    status: 'PENDING',
    location: {
      lat: 37.7650,
      lng: -122.4500,
      sectorName: 'Sector Charlie (Medical District)',
      gridRef: 'GR-4822',
      elevationMeters: 45,
    },
    reportedAt: '12 mins ago',
    casualtyEstimate: 34,
    structuralIntegrityPct: 42,
    hazardSummary: 'Basement backup generators submerged under 1.8m rising stormwater. 14 critical care patients on dwindling UPS batteries.',
    keyHazards: ['Submerged high-voltage grid', 'Rising flood torrents', 'Hypothermia risk', 'Depleting ventilator power'],
    requiredResources: [
      { type: 'Industrial Submersible Generators', count: 3, unit: 'Units', urgency: 'IMMEDIATE' },
      { type: 'Mobile ICU Evacuation Units', count: 4, unit: 'Vehicles', urgency: 'IMMEDIATE' },
      { type: 'High-Capacity Bilge Pumps', count: 2, unit: 'Sets', urgency: 'HIGH' },
    ],
    assignedUnitIds: [],
    source: 'DRONE_FEED',
    aiConfidence: 97,
  },
  {
    id: 'INC-2026-082',
    title: 'Overpass Span Structural Fracture with Trapped Commuters',
    type: 'STRUCTURAL_COLLAPSE',
    priority: 'P1-CRITICAL',
    status: 'PENDING',
    location: {
      lat: 37.7890,
      lng: -122.3980,
      sectorName: 'Sector Bravo (Harbor Viaduct)',
      gridRef: 'GR-1904',
      elevationMeters: 12,
    },
    reportedAt: '18 mins ago',
    casualtyEstimate: 18,
    structuralIntegrityPct: 28,
    hazardSummary: 'Upper deck concrete slab cracked along shear line; 6 passenger vehicles pinned beneath cantilevered rebar.',
    keyHazards: ['Secondary seismic collapse risk', 'Fuel leak ignition danger', 'Unstable cantilever rebar'],
    requiredResources: [
      { type: 'Hydraulic Jaws & Cutting Spreaders', count: 4, unit: 'Kits', urgency: 'IMMEDIATE' },
      { type: 'Heavy Urban SAR Personnel', count: 12, unit: 'Specialists', urgency: 'IMMEDIATE' },
      { type: 'Structural Acoustic Listening Sensors', count: 2, unit: 'Arrays', urgency: 'HIGH' },
    ],
    assignedUnitIds: [],
    source: 'SATELLITE_RADAR',
    aiConfidence: 94,
  },
  {
    id: 'INC-2026-083',
    title: 'Canyon Wildfire Crown Flare Approaching Subdivision',
    type: 'WILDFIRE',
    priority: 'P2-HIGH',
    status: 'PENDING',
    location: {
      lat: 37.7400,
      lng: -122.4600,
      sectorName: 'Sector Delta (Twin Peaks Perimeter)',
      gridRef: 'GR-8210',
      elevationMeters: 180,
    },
    reportedAt: '25 mins ago',
    casualtyEstimate: 0,
    structuralIntegrityPct: 75,
    hazardSummary: '35 knot wind gusts driving crowning firestorm toward 120 residential homes. Primary arterial route blocked by downed pine.',
    keyHazards: ['Rapid flame velocity (12 km/h)', 'Dense toxic smoke plume', 'Power grid arcing'],
    requiredResources: [
      { type: 'Aerial Fire Retardant Drones', count: 4, unit: 'Sorties', urgency: 'HIGH' },
      { type: 'Chainsaw Clearing & Bulldozer Unit', count: 2, unit: 'Crews', urgency: 'IMMEDIATE' },
      { type: 'Evacuation Escort Vans', count: 6, unit: 'Vehicles', urgency: 'HIGH' },
    ],
    assignedUnitIds: [],
    source: 'CITIZEN_REPORT',
    aiConfidence: 91,
  },
  {
    id: 'INC-2026-084',
    title: 'Industrial Chemical Transfer Depot Ammonia Breach',
    type: 'HAZMAT',
    priority: 'P2-HIGH',
    status: 'PENDING',
    location: {
      lat: 37.7720,
      lng: -122.3900,
      sectorName: 'Sector Alpha (Logistics Rail Yards)',
      gridRef: 'GR-3155',
      elevationMeters: 8,
    },
    reportedAt: '34 mins ago',
    casualtyEstimate: 6,
    structuralIntegrityPct: 82,
    hazardSummary: 'Anhydrous ammonia valve ruptured following ground liquefaction. Corrosive vapor plume drifting downwind toward residential blocks.',
    keyHazards: ['Toxic vapor inhalation', 'Downwind drift 15 knot NW', 'Corrosive eye/lung risk'],
    requiredResources: [
      { type: 'HazMat Level-A Protective Suits', count: 8, unit: 'Sets', urgency: 'IMMEDIATE' },
      { type: 'Vapor Neutralizing Fog Cannons', count: 2, unit: 'Units', urgency: 'HIGH' },
      { type: 'Downwind Air Quality Monitors', count: 5, unit: 'Nodes', urgency: 'HIGH' },
    ],
    assignedUnitIds: [],
    source: 'SENSOR_ARRAY',
    aiConfidence: 96,
  },
];

export interface DroneFeedSample {
  id: string;
  title: string;
  type: 'FLOOD' | 'EARTHQUAKE' | 'WILDFIRE' | 'HAZMAT' | 'STRUCTURAL_COLLAPSE' | 'HURRICANE';
  category: string;
  description: string;
  previewGradient: string;
  sampleImageUrl?: string;
  tags: string[];
  suggestedCasualties: number;
  suggestedSeverity: string;
  detectedHazards?: Array<{ label: string; x: number; y: number; width: number; height: number; type: 'critical' | 'warning' | 'info' }>;
}

export const SAMPLE_DRONE_FEEDS: DroneFeedSample[] = [
  {
    id: 'FEED-01',
    title: 'Submerged Residential Sector Roof Clusters (Flood)',
    type: 'FLOOD',
    category: 'Aerial Drone FLIR / Optical',
    description: 'Drone footage over 3rd Ave showing 4 family groups stranded on peaked rooftops with rising brown floodwaters and swift currents.',
    previewGradient: 'from-blue-600 to-cyan-800',
    sampleImageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80',
    tags: ['Water Surge', 'Trapped Civilians', 'Swirling Currents'],
    suggestedCasualties: 14,
    suggestedSeverity: 'P1-CRITICAL',
    detectedHazards: [
      { label: 'STRANDED SURVIVORS (4 GROUPS)', x: 28, y: 35, width: 34, height: 26, type: 'critical' },
      { label: 'WATER SURGE CORRIDOR (+2.4m)', x: 65, y: 60, width: 28, height: 25, type: 'warning' },
    ],
  },
  {
    id: 'FEED-02',
    title: 'Multi-Storey School Building Seismic Shear Failure',
    type: 'EARTHQUAKE',
    category: 'Satellite SAR Micro-Interferometry',
    description: 'High resolution optical survey showing pancake collapse of ground floor gymnasium with upper classrooms partially suspended.',
    previewGradient: 'from-amber-600 to-stone-800',
    sampleImageUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=1000&q=80',
    tags: ['Structural Failure', 'Pancake Collapse', 'Voids Detected'],
    suggestedCasualties: 22,
    suggestedSeverity: 'P1-CRITICAL',
    detectedHazards: [
      { label: 'GROUND FLOOR SHEAR COLLAPSE', x: 20, y: 48, width: 55, height: 35, type: 'critical' },
      { label: 'POTENTIAL SURVIVOR VOID DETECTED', x: 42, y: 25, width: 26, height: 20, type: 'warning' },
    ],
  },
  {
    id: 'FEED-03',
    title: 'Wildfire Spotting Over Urban Perimeter Defense Line',
    type: 'WILDFIRE',
    category: 'Thermal Infrared UAV Survey',
    description: 'Thermal UAV pass revealing 600°C ember spot fires igniting dry brush 150m behind fire break trenches near retirement facility.',
    previewGradient: 'from-red-600 to-orange-800',
    sampleImageUrl: 'https://images.unsplash.com/photo-1602980085566-4c478631168f?auto=format&fit=crop&w=1000&q=80',
    tags: ['Extreme Heat', 'Spot Ignition', 'Immediate Evacuation'],
    suggestedCasualties: 0,
    suggestedSeverity: 'P2-HIGH',
    detectedHazards: [
      { label: 'THERMAL FLAME FRONT (620°C)', x: 35, y: 20, width: 45, height: 40, type: 'critical' },
      { label: 'SECONDARY EMBER SPOTTING', x: 15, y: 65, width: 30, height: 22, type: 'warning' },
    ],
  },
  {
    id: 'FEED-04',
    title: 'Industrial Tank Farm Ammonia Cloud Dispersal',
    type: 'HAZMAT',
    category: 'Multispectral Gas Sensor Drone',
    description: 'Ultraviolet gas imaging detecting expanding ammonia aerosol plume crossing Highway 101 overpass with zero visibility.',
    previewGradient: 'from-emerald-700 to-slate-900',
    sampleImageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1000&q=80',
    tags: ['Toxic Gas Plume', 'Corrosive Vapor', 'Corridor Isolation'],
    suggestedCasualties: 8,
    suggestedSeverity: 'P1-CRITICAL',
    detectedHazards: [
      { label: 'TOXIC VAPOR PLUME (180 PPM)', x: 30, y: 30, width: 50, height: 45, type: 'critical' },
      { label: 'CORROSIVE LEAK ORIFICE', x: 45, y: 70, width: 22, height: 18, type: 'critical' },
    ],
  },
];

export const PRESET_DISASTER_SCENARIOS = [
  {
    id: 'SCENARIO-HURRICANE',
    name: 'Hurricane Typhoon "Apex" (Category 5 Landfall)',
    description: 'Massive storm surge overrunning coastal defenses, 130 mph winds, multiple structural breaches, and severed communications.',
    iconName: 'CloudRain',
    badge: 'Multi-Hazard Surge',
  },
  {
    id: 'SCENARIO-QUAKE',
    name: 'Magnitude 7.4 Megathrust Fault Rupture',
    description: 'Widespread bridge fractures, gas line ruptures, collapsed municipal buildings, and widespread electrical blackouts.',
    iconName: 'Activity',
    badge: 'Mass Casualty SAR',
  },
  {
    id: 'SCENARIO-WILDFIRE',
    name: 'Diablo Wind Complex Wildfire Firestorm',
    description: 'Extreme heat vortex, multiple ember storm spotting events, rapid urban-wildland interface evacuation required.',
    iconName: 'Flame',
    badge: 'Rapid Perimeter Defense',
  },
];
