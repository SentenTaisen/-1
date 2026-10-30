import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Gauge, 
  Flame, 
  Droplet, 
  Navigation, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  Cpu,
  Truck,
  Zap,
  MapPin,
  Sparkles
} from 'lucide-react';
import { playTactileClick, playDispatchBeep } from '../utils/audio';

export interface TelemetryState {
  currentStageIndex: number; // 0: Grinding & Dosing, 1: Hydro-Pressure Extraction, 2: Rapid Courier Transit, 3: Completed Hand-Off
  elapsedSeconds: number;
  temperature: number; // e.g. 93.4
  pressure: number; // 9.2
  tds: number; // 1.42
  courierSpeed: number; // km/h
  courierDistanceKm: number;
}

interface TelemetryTrackerProps {
  onBackToMenu?: () => void;
  orderItemsCount?: number;
  orderId?: string;
}

export const TelemetryTracker: React.FC<TelemetryTrackerProps> = ({
  onBackToMenu,
  orderItemsCount = 2,
  orderId = 'OBS-8942-X',
}) => {
  const [stageIndex, setStageIndex] = useState<number>(1); // default to live extraction
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(34);
  const [pressure, setPressure] = useState<number>(9.2);
  const [temp, setTemp] = useState<number>(93.4);
  const [tds, setTds] = useState<number>(1.42);
  const [speed, setSpeed] = useState<number>(28);

  const stages = [
    {
      id: 'grind',
      name: 'Grinding & Dosing',
      tag: 'EK43 98MM BURRS',
      status: 'CALIBRATED',
      desc: 'Precision volumetric dosing of 18.5g beans, ionized chamber to eliminate static clumping.',
      metricLabel: 'Particle Size',
      metricVal: '380μm Uniformity',
      submetric: 'Dose: 18.50g ±0.02g',
    },
    {
      id: 'extract',
      name: 'Hydro-Pressure Extraction',
      tag: '9.2 BAR ROTARY VANE',
      status: 'ACTIVE RUN',
      desc: 'Dual-boiler saturated grouphead infusion at 93.4°C with remineralized magnesium crystal solvent.',
      metricLabel: 'Extraction Flow',
      metricVal: '2.1 ml/s',
      submetric: 'Target Yield: 36.8g in 28s',
    },
    {
      id: 'transit',
      name: 'Rapid Courier Transit',
      tag: 'CRYOGENIC THERMAL PACK',
      status: 'EN ROUTE',
      desc: 'Vacuum-sealed in carbon-insulated pod on zero-emission rapid electric courier dispatch.',
      metricLabel: 'Courier Velocity',
      metricVal: `${speed} km/h`,
      submetric: 'ETA: 7 mins to Destination',
    },
    {
      id: 'complete',
      name: 'Delivered & Decanted',
      tag: 'OPTIMAL TEMPERATURE',
      status: 'HAND-OFF READY',
      desc: 'Aroma compounds preserved at peak sensory volatility. Uncap immediately for bloom bouquet.',
      metricLabel: 'Tasting Peak',
      metricVal: 'Now (Optimal)',
      submetric: 'Sensory Window: 25 mins',
    },
  ];

  // Micro-fluctuation effect for real telemetry sensors
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
      // Small sensor jitter to emulate live IoT telemetry
      setPressure((p) => +(9.15 + (Math.random() * 0.15 - 0.07)).toFixed(2));
      setTemp((t) => +(93.38 + (Math.random() * 0.12 - 0.06)).toFixed(1));
      setTds((d) => +(1.42 + (Math.random() * 0.04 - 0.02)).toFixed(2));
      setSpeed((s) => Math.floor(26 + Math.random() * 6));
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const progressPercentage = Math.min(100, Math.round(((stageIndex + 0.5) / stages.length) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Cockpit Telemetry Banner */}
      <div className="p-6 md:p-8 rounded-[1.5rem] bg-gradient-to-r from-[#141721] via-[#1B202E] to-[#141721] border border-white/10 relative overflow-hidden card-elevation">
        {/* Ambient neon dispatch glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#00f2fe]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-[#ff9f43]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f2fe]"></span>
              </span>
              <span className="tag-label text-[#00f2fe] tracking-widest">
                LIVE EXTRACTION & DISPATCH TELEMETRY
              </span>
              <span className="text-[11px] font-['Space_Grotesk'] text-white/40">
                • {orderId}
              </span>
            </div>

            <h1 className="font-['Space_Grotesk'] text-2xl md:text-4xl font-bold text-white tracking-tight">
              Real-Time Extraction Cockpit
            </h1>
            <p className="text-xs md:text-sm text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] mt-1 max-w-xl">
              Precision sensor feedback streamed direct from our laboratory La Marzocco KB90 groupheads and courier telemetry beacons.
            </p>
          </div>

          {/* Scrubber simulation controls */}
          <div className="flex items-center gap-2 bg-[#0E1118] p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => {
                playTactileClick();
                setStageIndex(Math.max(0, stageIndex - 1));
              }}
              disabled={stageIndex === 0}
              className="px-3 py-1.5 rounded-full text-xs font-['Space_Grotesk'] font-bold text-[#dac2b1] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Prev Stage
            </button>
            <button
              onClick={() => {
                playDispatchBeep();
                setStageIndex(Math.min(stages.length - 1, stageIndex + 1));
              }}
              disabled={stageIndex >= stages.length - 1}
              className="px-4 py-1.5 rounded-full bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 text-[#00f2fe] border border-[#00f2fe]/40 text-xs font-['Space_Grotesk'] font-bold transition-all"
            >
              Advance Stage
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setStageIndex(0);
                setSeconds(0);
              }}
              title="Reset simulation"
              className="p-1.5 rounded-full text-white/50 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Sensor Gauge Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-[#0c0e14]/70 border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[#dac2b1]/70 text-xs mb-1">
              <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-wider">
                Grouphead Temp
              </span>
              <Flame className="w-3.5 h-3.5 text-[#ff9f43]" />
            </div>
            <div className="font-['Space_Grotesk'] text-xl font-bold text-white">
              {temp}°C
            </div>
            <span className="text-[10px] text-[#ff9f43] font-mono">±0.05°C PID stability</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0e14]/70 border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[#dac2b1]/70 text-xs mb-1">
              <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-wider">
                Fluid Pressure
              </span>
              <Gauge className="w-3.5 h-3.5 text-[#00f2fe]" />
            </div>
            <div className="font-['Space_Grotesk'] text-xl font-bold text-[#00f2fe]">
              {pressure} BAR
            </div>
            <span className="text-[10px] text-[#00f2fe]/80 font-mono">Linear profiling</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0e14]/70 border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[#dac2b1]/70 text-xs mb-1">
              <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-wider">
                TDS Refractometer
              </span>
              <Droplet className="w-3.5 h-3.5 text-[#a78bfa]" />
            </div>
            <div className="font-['Space_Grotesk'] text-xl font-bold text-white">
              {tds}%
            </div>
            <span className="text-[10px] text-[#a78bfa] font-mono">21.8% Ext. Yield</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0e14]/70 border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[#dac2b1]/70 text-xs mb-1">
              <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-wider">
                Courier Transit
              </span>
              <Truck className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div className="font-['Space_Grotesk'] text-xl font-bold text-[#10B981]">
              {speed} KM/H
            </div>
            <span className="text-[10px] text-[#10B981]/80 font-mono">Vacuum insulated</span>
          </div>
        </div>
      </div>

      {/* Multi-Tier Timeline Card with Animated Neon Cyan Progress Thread */}
      <div className="p-6 md:p-8 rounded-[1.5rem] bg-[#141721] border border-white/10 card-elevation relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00f2fe]" />
              Sequential Telemetry Timeline
            </h2>
            <p className="text-xs text-[#dac2b1]/70 mt-0.5">
              Visualized using active cryogenic nitrogen thread with illuminated pulse ring
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-white/50 block font-semibold">
              Telemetry Phase
            </span>
            <span className="font-['Space_Grotesk'] text-base font-bold text-[#00f2fe]">
              Step {stageIndex + 1} of {stages.length}
            </span>
          </div>
        </div>

        {/* The Animated Thread & Milestone Nodes */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {/* Active neon cyan progress thread terminating in illuminated pulse ring */}
          <div
            className="absolute left-3 sm:left-5 top-3 w-0.5 bg-gradient-to-b from-[#00f2fe] via-[#00f2fe] to-[#ff9f43] transition-all duration-700 ease-out"
            style={{
              height: `${Math.min(94, (stageIndex / (stages.length - 1)) * 94)}%`,
            }}
          >
            {/* Illuminated Pulse Ring at the terminating point */}
            <div className="absolute -bottom-2 -left-[7px] w-4 h-4 rounded-full bg-[#00f2fe] border-2 border-[#0B0D13] shadow-[0_0_15px_#00f2fe] flex items-center justify-center animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          {stages.map((stage, idx) => {
            const isCompleted = idx < stageIndex;
            const isCurrent = idx === stageIndex;
            const isUpcoming = idx > stageIndex;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  playTactileClick();
                  setStageIndex(idx);
                }}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1B202E] border-[#00f2fe]/60 shadow-[0_10px_28px_-6px_rgba(0,242,254,0.22)]'
                    : isCompleted
                    ? 'bg-[#141721]/90 border-white/10 text-white/80'
                    : 'bg-[#0E1118]/60 border-white/5 opacity-50 hover:opacity-80'
                }`}
              >
                {/* Node marker on thread line */}
                <div
                  className={`absolute -left-6 sm:-left-10 top-5 w-6 h-6 -translate-x-1/2 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'border-[#00f2fe] bg-[#00f2fe] shadow-[0_0_12px_#00f2fe] text-[#0B0D13]'
                      : isCompleted
                      ? 'border-[#10B981] bg-[#10B981] text-[#0B0D13]'
                      : 'border-white/20 bg-[#141721] text-white/30'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="font-['Space_Grotesk'] text-[11px] font-bold">
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Stage Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="tag-label px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#dac2b1]">
                      {stage.tag}
                    </span>
                    <span
                      className={`text-[10px] font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCurrent
                          ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30'
                          : isCompleted
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-[#dac2b1]/80 max-w-xl font-['Plus_Jakarta_Sans']">
                    {stage.desc}
                  </p>
                </div>

                {/* Telemetry Metric pill for this step */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-white/50">
                    {stage.metricLabel}
                  </span>
                  <span
                    className={`font-['Space_Grotesk'] text-base md:text-lg font-bold ${
                      isCurrent ? 'text-[#00f2fe]' : isCompleted ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {stage.metricVal}
                  </span>
                  <span className="text-[10px] text-[#dac2b1]/60 font-mono">
                    {stage.submetric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier Transit Live Map Mockup when in transit */}
        <div className="mt-8 p-5 rounded-2xl bg-[#0E1118] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#00f2fe] animate-pulse" />
              <span className="text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider">
                Electric Rapid Transit Radar
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-2 py-0.5 rounded-full border border-[#00f2fe]/20">
              COURIER UNIT #07 • ZERO EMISSION
            </span>
          </div>

          <div className="relative h-28 w-full rounded-xl overflow-hidden bg-[#07090e] border border-white/5 p-4 flex items-center justify-between">
            {/* Grid background lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1f2438_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Visual Vector Route Line */}
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff9f43] via-[#00f2fe] to-[#10B981] transition-all duration-500"
                style={{ width: `${Math.min(100, (stageIndex / 3) * 100)}%` }}
              />
            </div>

            {/* Station 1: Roastery Lab */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#181b24] border border-[#ff9f43] flex items-center justify-center text-[#ff9f43]">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-['Space_Grotesk'] font-bold text-white mt-1">
                Roastery Lab
              </span>
              <span className="text-[9px] text-white/50">Extraction Bay</span>
            </div>

            {/* Courier in Motion */}
            <div
              className="relative z-10 flex flex-col items-center transition-all duration-700"
              style={{
                transform: `translateX(${stageIndex === 0 ? '-30px' : stageIndex === 1 ? '0px' : stageIndex === 2 ? '40px' : '90px'})`,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[#00f2fe]/20 border-2 border-[#00f2fe] shadow-[0_0_20px_#00f2fe] flex items-center justify-center text-[#00f2fe] animate-bounce">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-['Space_Grotesk'] font-bold text-[#00f2fe] mt-1">
                {stageIndex >= 2 ? 'In Flight (28 km/h)' : 'Packing Capsule'}
              </span>
            </div>

            {/* Destination Point */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                stageIndex === 3 ? 'border-[#10B981] bg-[#10B981] text-[#0B0D13]' : 'border-white/20 bg-[#181b24] text-white/40'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-['Space_Grotesk'] font-bold text-white mt-1">
                Your Coordinates
              </span>
              <span className="text-[9px] text-white/50">Priority Drop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
