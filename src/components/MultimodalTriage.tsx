import React, { useState, useRef } from 'react';
import { SAMPLE_DRONE_FEEDS, DroneFeedSample } from '../data/mockCrisisData';
import { Incident, TriageAnalysisResult } from '../types';
import {
  Cpu,
  UploadCloud,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Droplets,
  Flame,
  Building,
  Radio,
  Sliders,
  Crosshair,
  Maximize2,
  Trash2,
  HelpCircle,
  FileImage,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MultimodalTriageProps {
  onInjectIncident: (incident: Incident) => void;
  onNavigateToDispatch: () => void;
}

type VisionFilterMode = 'OPTICAL' | 'THERMAL_FLIR' | 'DAMAGE_EDGES';

export const MultimodalTriage: React.FC<MultimodalTriageProps> = ({
  onInjectIncident,
  onNavigateToDispatch,
}) => {
  const [selectedFeedId, setSelectedFeedId] = useState<string>(SAMPLE_DRONE_FEEDS[0].id);
  const [customReportText, setCustomReportText] = useState<string>(SAMPLE_DRONE_FEEDS[0].description);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageMime, setCustomImageMime] = useState<string>('image/jpeg');
  const [customImageName, setCustomImageName] = useState<string>('');
  const [customImageSize, setCustomImageSize] = useState<string>('');
  const [customImagePreviewUrl, setCustomImagePreviewUrl] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [visionMode, setVisionMode] = useState<VisionFilterMode>('OPTICAL');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<TriageAnalysisResult | null>(null);
  const [injectedSuccess, setInjectedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active preset feed (if selected)
  const activePreset = SAMPLE_DRONE_FEEDS.find((f) => f.id === selectedFeedId);

  // Handle Preset Feed Selection
  const handleSelectPreset = (feed: DroneFeedSample) => {
    setSelectedFeedId(feed.id);
    setCustomReportText(feed.description);
    setCustomImageBase64(null);
    setCustomImagePreviewUrl(feed.sampleImageUrl || null);
    setCustomImageName('');
    setCustomImageSize('');
    setInjectedSuccess(false);
  };

  // Process File from Input or Drag-and-Drop
  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setCustomImageName(file.name);
    setCustomImageMime(file.type || 'image/jpeg');
    setCustomImageSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    const reader = new FileReader();
    reader.onload = () => {
      const fullResult = reader.result as string;
      const pureBase64 = fullResult.split(',')[1] || fullResult;
      setCustomImageBase64(pureBase64);
      setCustomImagePreviewUrl(fullResult);
      setSelectedFeedId('CUSTOM_UPLOAD');
      setInjectedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedFile(file);
  };

  // Clear Custom Image
  const handleClearImage = () => {
    setCustomImageBase64(null);
    setCustomImagePreviewUrl(null);
    setCustomImageName('');
    setCustomImageSize('');
    // Switch back to first preset
    handleSelectPreset(SAMPLE_DRONE_FEEDS[0]);
  };

  // Execute Gemini AI Multimodal Triage Call
  const handleRunTriage = async () => {
    setIsAnalyzing(true);
    setInjectedSuccess(false);

    try {
      const activeFeed = SAMPLE_DRONE_FEEDS.find((f) => f.id === selectedFeedId);
      const res = await fetch('/api/triage/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customImageName ? `Aerial Recon: ${customImageName}` : activeFeed?.title || 'Aerial UAV Reconnaissance Incident',
          description: customReportText || 'Comprehensive multimodal aerial damage and casualty analysis requested.',
          imageBase64: customImageBase64 || undefined,
          mimeType: customImageMime,
          disasterType: activeFeed?.type || 'FLOOD',
        }),
      });

      const data = await res.json();
      if (data.result) {
        setAnalysisResult(data.result);
      }
    } catch (err) {
      console.error('Triage analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Inject Incident into Active Command Grid
  const handleInjectIntoLiveGrid = () => {
    if (!analysisResult) return;

    const newIncident: Incident = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: analysisResult.title,
      type: analysisResult.disasterType,
      priority: analysisResult.priority,
      status: 'TRIAGED',
      location: {
        lat: 37.7550 + (Math.random() * 0.04 - 0.02),
        lng: -122.4250 + (Math.random() * 0.04 - 0.02),
        sectorName: `Sector ${String.fromCharCode(65 + Math.floor(Math.random() * 4))} (Recon Zone)`,
        gridRef: `GR-${Math.floor(1000 + Math.random() * 9000)}`,
        elevationMeters: Math.floor(20 + Math.random() * 80),
      },
      reportedAt: 'Just now (AI Drone Recon)',
      casualtyEstimate: analysisResult.casualtyEstimate,
      structuralIntegrityPct: analysisResult.structuralIntegrityPct,
      hazardSummary: analysisResult.hazardSummary,
      keyHazards: analysisResult.keyHazards,
      requiredResources: analysisResult.requiredResources,
      assignedUnitIds: [],
      source: 'DRONE_FEED',
      aiConfidence: analysisResult.aiConfidence,
    };

    onInjectIncident(newIncident);
    setInjectedSuccess(true);
  };

  const getDisasterIcon = (type: string) => {
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

  // Current active image URL
  const currentImageUrl = customImagePreviewUrl || activePreset?.sampleImageUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-6">
      {/* 3-Step Functional Workflow Explainer Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <span>Multimodal Vision & Drone Telemetry Triage</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                  Gemini 3.7 Multi-Model
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload real field drone footage or select reconnaissance presets to extract damage grades, casualty headcounts, and required rescue assets.
              </p>
            </div>
          </div>

          {/* Step Badges */}
          <div className="flex items-center space-x-2 text-[11px] font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-around">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Ingest Imagery</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>AI Pixel Triage</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>Deploy to Grid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual HUD Ingestion & AI Intelligence Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Ingestion & Tactical HUD (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tactical Drone HUD Viewport */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Viewport Top Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {selectedFeedId === 'CUSTOM_UPLOAD' ? `CUSTOM: ${customImageName || 'Field Capture'}` : activePreset?.title}
                </span>
              </div>

              {/* Vision Mode Selectors */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
                <button
                  onClick={() => setVisionMode('OPTICAL')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    visionMode === 'OPTICAL'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Optical
                </button>
                <button
                  onClick={() => setVisionMode('THERMAL_FLIR')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    visionMode === 'THERMAL_FLIR'
                      ? 'bg-orange-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  FLIR Thermal
                </button>
                <button
                  onClick={() => setVisionMode('DAMAGE_EDGES')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    visionMode === 'DAMAGE_EDGES'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Edge Grid
                </button>
              </div>
            </div>

            {/* Interactive Image Frame with Telemetry Overlay */}
            <div className="relative aspect-video bg-slate-950 overflow-hidden group">
              {/* Filter Applied Image */}
              <img
                src={currentImageUrl}
                alt="Reconnaissance Ingestion"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  visionMode === 'THERMAL_FLIR'
                    ? 'filter contrast-150 saturate-200 hue-rotate-180 invert brightness-110'
                    : visionMode === 'DAMAGE_EDGES'
                    ? 'filter contrast-200 grayscale brightness-90'
                    : ''
                }`}
              />

              {/* HUD Crosshairs & Grid Lines */}
              <div className="absolute inset-0 pointer-events-none border border-slate-700/40 m-3 rounded-lg">
                {/* Corner Markers */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <Crosshair className="w-12 h-12 text-amber-400" />
                </div>

                {/* Telemetry Bar */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-slate-300 bg-slate-950/80 px-2 py-1 rounded backdrop-blur border border-slate-800">
                  <span>LAT: 37.7550° N | LNG: 122.4250° W</span>
                  <span>ALT: 120M AGL</span>
                  <span className="text-emerald-400">SENSOR: ACTIVE</span>
                </div>
              </div>

              {/* AI Detection Bounding Boxes */}
              {showBoundingBoxes && (
                <div className="absolute inset-0 pointer-events-none">
                  {selectedFeedId !== 'CUSTOM_UPLOAD' &&
                    activePreset?.detectedHazards?.map((box, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                        }}
                        className={`absolute border-2 rounded ${
                          box.type === 'critical'
                            ? 'border-red-500 bg-red-500/10 text-red-300'
                            : 'border-amber-400 bg-amber-400/10 text-amber-300'
                        } p-1 text-[9px] font-mono font-bold animate-pulse`}
                      >
                        <span className="bg-slate-950/90 px-1 py-0.5 rounded border border-current block w-max">
                          {box.label}
                        </span>
                      </div>
                    ))}

                  {/* Bounding Boxes for Custom Upload after analysis */}
                  {selectedFeedId === 'CUSTOM_UPLOAD' && analysisResult && (
                    <>
                      <div
                        style={{ left: '25%', top: '30%', width: '45%', height: '35%' }}
                        className="absolute border-2 border-red-500 bg-red-500/10 rounded p-1 text-[9px] font-mono font-bold text-red-300 animate-pulse"
                      >
                        <span className="bg-slate-950/90 px-1 py-0.5 rounded border border-red-500 block w-max">
                          STRUCTURAL DAMAGE: {100 - analysisResult.structuralIntegrityPct}%
                        </span>
                      </div>
                      <div
                        style={{ left: '50%', top: '65%', width: '30%', height: '25%' }}
                        className="absolute border-2 border-amber-400 bg-amber-400/10 rounded p-1 text-[9px] font-mono font-bold text-amber-300"
                      >
                        <span className="bg-slate-950/90 px-1 py-0.5 rounded border border-amber-400 block w-max">
                          EST. CASUALTIES: ~{analysisResult.casualtyEstimate}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Active Laser Scanning Animation */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-slate-950/90 border border-cyan-500 px-4 py-2 rounded-xl text-center space-y-1">
                      <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin mx-auto" />
                      <span className="text-xs font-mono font-bold text-cyan-300 block">
                        GEMINI MULTIMODAL INGESTION ACTIVE
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Scanning pixel density & fracture nodes...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Bottom Controls */}
            <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBoundingBoxes}
                  onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px] font-mono">Show AI Detection Bounding Boxes</span>
              </label>

              {selectedFeedId === 'CUSTOM_UPLOAD' && (
                <button
                  onClick={handleClearImage}
                  className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Upload Custom Drone / Eyewitness Imagery Dropzone */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-200">Upload Custom Disaster Image</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Supports drag & drop</span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg scale-[1.01]'
                  : 'border-slate-700 hover:border-amber-500 bg-slate-950/60 hover:bg-slate-950/90'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <FileImage className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-200 text-center">
                {customImageName ? `Selected: ${customImageName}` : 'Click to browse or drop disaster image here'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 text-center">
                Accepts drone reconnaissance photos, mobile captures, or satellite surveys (JPG, PNG, WEBP)
              </span>

              {customImageName && (
                <div className="mt-3 flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for Analysis • {customImageSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* Preset Recon Feeds Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Or Select Preset Drone Feed</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">1-click test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_DRONE_FEEDS.map((feed) => {
                const isSelected = selectedFeedId === feed.id;
                return (
                  <div
                    key={feed.id}
                    onClick={() => handleSelectPreset(feed)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        {getDisasterIcon(feed.type)}
                        <span className="font-bold text-xs text-slate-200">{feed.type}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-500/30">
                        {feed.suggestedSeverity}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-slate-300 line-clamp-1 mb-1">{feed.title}</h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{feed.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transcript / Field Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
              Field Notes / Eyewitness Recon Transcript
            </label>
            <textarea
              rows={3}
              value={customReportText}
              onChange={(e) => setCustomReportText(e.target.value)}
              placeholder="Enter situational details, survivor calls, observed hazards..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Right Column: AI Triage Output Visualizer (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Action Trigger Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Execute Multimodal Assessment</h4>
              <p className="text-xs text-slate-400">
                Sends high-res image & transcript to Gemini for automated damage grading.
              </p>
            </div>

            <button
              onClick={handleRunTriage}
              disabled={isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Imagery...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Triage Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* AI Intelligence Card */}
          {analysisResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6"
            >
              {/* Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
                        analysisResult.priority === 'P1-CRITICAL'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-orange-500 text-slate-950 font-bold'
                      }`}
                    >
                      {analysisResult.priority}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                      {analysisResult.disasterType}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{analysisResult.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">AI CONFIDENCE</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-400">
                    {analysisResult.aiConfidence}%
                  </span>
                </div>
              </div>

              {/* Core Metric Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-semibold">STRUCTURAL INTEGRITY</span>
                    <span className="text-base font-bold text-amber-400">{analysisResult.structuralIntegrityPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-amber-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${analysisResult.structuralIntegrityPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    {analysisResult.structuralIntegrityPct < 40 ? 'Severe structural compromise' : 'Moderate stability'}
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-semibold">CASUALTY & TRAPPED RISK</span>
                    <span className="text-base font-bold text-red-400">
                      {analysisResult.casualtyEstimate} Estimated
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, analysisResult.casualtyEstimate * 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">High urgency medical extrication priority</span>
                </div>
              </div>

              {/* Hazard Summary & Rationale */}
              <div className="space-y-3">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Tactical Hazard Summary</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.hazardSummary}</p>
                </div>

                <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/30">
                  <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Immediate Command Directive (Next 15 Min)</span>
                  </h4>
                  <p className="text-xs text-red-200 font-semibold leading-relaxed">
                    {analysisResult.immediateActionRequired}
                  </p>
                </div>
              </div>

              {/* Key Active Hazards Badges */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Detected Threat Vectors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keyHazards.map((hz, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono flex items-center space-x-1.5"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span>{hz}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Required Resources Matrix */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Required Emergency Assets & Supplies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysisResult.requiredResources.map((res, idx) => (
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

              {/* Deployment Controls */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                {injectedSuccess ? (
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Injected into Tactical Radar & Dispatch Matrix!</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Ready to mobilize rescue response</span>
                )}

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={handleInjectIntoLiveGrid}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Inject into Active Grid</span>
                  </button>

                  <button
                    onClick={onNavigateToDispatch}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    <span>View Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">Awaiting Multimodal Triage Run</h3>
              <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                Upload your disaster photo on the left (or pick a preset feed) and click &quot;Run AI Triage Analysis&quot;. Gemini will process the image pixels to grade structural damage, estimate casualties, and identify threat vectors.
              </p>
              <button
                onClick={handleRunTriage}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all hover:scale-105"
              >
                Analyze Current Imagery
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

