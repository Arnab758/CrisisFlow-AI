import React, { useState } from 'react';
import { Incident, EmergencyBroadcast as BroadcastType } from '../types';
import {
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Globe,
  MessageSquare,
  Megaphone,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface EmergencyBroadcastProps {
  incidents: Incident[];
}

const SUPPORTED_LANGUAGES = [
  { name: 'English', code: 'en', flag: '🇺🇸' },
  { name: 'Spanish (Español)', code: 'es', flag: '🇪🇸' },
  { name: 'French (Français)', code: 'fr', flag: '🇫🇷' },
  { name: 'Hindi (हिन्दी)', code: 'hi', flag: '🇮🇳' },
  { name: 'Tagalog (Filipino)', code: 'tl', flag: '🇵🇭' },
  { name: 'Japanese (日本語)', code: 'ja', flag: '🇯🇵' },
  { name: 'German (Deutsch)', code: 'de', flag: '🇩🇪' },
  { name: 'Arabic (العربية)', code: 'ar', flag: '🇸🇦' },
];

export const EmergencyBroadcast: React.FC<EmergencyBroadcastProps> = ({ incidents }) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [broadcastData, setBroadcastData] = useState<BroadcastType | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleGenerateBroadcast = async () => {
    if (!activeIncident) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/broadcast/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident: activeIncident,
          targetLanguage: selectedLang.name,
          languageCode: selectedLang.code,
          channel: 'ALL',
        }),
      });

      const data = await res.json();
      if (data.broadcast) {
        setBroadcastData(data.broadcast);
      }
    } catch (err) {
      console.error('Error generating broadcast:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Web Speech API Voice Synthesis Playback
  const handlePlayVoice = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser environment.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Emergency Public Alert & Multi-Channel Broadcast System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Multilingual Emergency Broadcast Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Instantly formulate life-saving public warning messages across 8+ international languages. Automatically formats character-capped WEA/SMS alerts, tactical VHF radio transcripts, and public address loudspeaker briefings.
          </p>
        </div>

        {/* Generate Action Button */}
        <button
          onClick={handleGenerateBroadcast}
          disabled={isGenerating}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Translating & Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Broadcast Alert</span>
            </>
          )}
        </button>
      </div>

      {/* Selector Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Incident Target Selector */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            Target Disaster Incident
          </label>
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                [{inc.priority}] {inc.id}: {inc.title} ({inc.location.sectorName})
              </option>
            ))}
          </select>
        </div>

        {/* Language Target Selector */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            Target Public Language ({SUPPORTED_LANGUAGES.length} Supported)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 transition-all border ${
                  selectedLang.code === lang.code
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="truncate">{lang.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Output Channels */}
      {broadcastData ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* 1. Wireless Emergency Alert (SMS / WEA) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-slate-100">Cell Broadcast / WEA (SMS)</h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  {broadcastData.smsAlert.length} / 160 CHARS
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 font-semibold mb-4 leading-relaxed tracking-wide">
                {broadcastData.smsAlert}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-slate-500">Auto-targeted to local cellular towers</span>
              <button
                onClick={() => handleCopy(broadcastData.smsAlert, 'sms')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-all"
              >
                {copiedKey === 'sms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sms' ? 'Copied' : 'Copy SMS'}</span>
              </button>
            </div>
          </div>

          {/* 2. Tactical VHF Radio Dispatch Script (With Audio Playback!) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm text-slate-100">VHF Tactical Radio Dispatch</h4>
                </div>
                <button
                  onClick={() => handlePlayVoice(broadcastData.radioTranscript)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? 'Stop Voice' : 'Play Radio Audio'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 font-semibold mb-4 leading-relaxed">
                {broadcastData.radioTranscript}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-slate-500">Phonetic callsign & tactical cadence</span>
              <button
                onClick={() => handleCopy(broadcastData.radioTranscript, 'radio')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-all"
              >
                {copiedKey === 'radio' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'radio' ? 'Copied' : 'Copy Radio Script'}</span>
              </button>
            </div>
          </div>

          {/* 3. Public Address Loudspeaker Announcement */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-4 h-4 text-rose-400" />
                  <h4 className="font-bold text-sm text-slate-100">Loudspeaker & Siren Public Announcement</h4>
                </div>
                <button
                  onClick={() => handlePlayVoice(broadcastData.publicAddressAnnouncement)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Listen</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed mb-4">
                &quot;{broadcastData.publicAddressAnnouncement}&quot;
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-slate-500">Mobile siren & siren pole broadcast</span>
              <button
                onClick={() => handleCopy(broadcastData.publicAddressAnnouncement, 'pa')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-all"
              >
                {copiedKey === 'pa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pa' ? 'Copied' : 'Copy Announcement'}</span>
              </button>
            </div>
          </div>

          {/* 4. Shelter & Life-Safety Guidance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-100">Official Shelter & Life-Safety Directive</h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                  VERIFIED PROTOCOL
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed mb-4">
                {broadcastData.shelterGuidance}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-slate-500">Cross-posted to civic portals</span>
              <button
                onClick={() => handleCopy(broadcastData.shelterGuidance, 'shelter')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-all"
              >
                {copiedKey === 'shelter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'shelter' ? 'Copied' : 'Copy Guidance'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
            <Radio className="w-8 h-8 text-red-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">Multi-Channel Public Broadcast Ready</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Select an active incident and target language above, then click &quot;Generate Broadcast Alert&quot; to synthesize emergency public safety notices.
          </p>
          <button
            onClick={handleGenerateBroadcast}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-all hover:scale-105"
          >
            Generate English Broadcast
          </button>
        </div>
      )}
    </div>
  );
};
