import React from 'react';
import { X, Sparkles, Droplet, Flame, Award, ChevronRight } from 'lucide-react';
import { CoffeeItem } from '../data/coffeeData';
import { playTactileClick } from '../utils/audio';

interface SensoryRadarModalProps {
  coffee: CoffeeItem | null;
  onClose: () => void;
  onOpenConfigurator?: (coffee: CoffeeItem) => void;
}

export const SensoryRadarModal: React.FC<SensoryRadarModalProps> = ({
  coffee,
  onClose,
  onOpenConfigurator,
}) => {
  if (!coffee) return null;

  const { acidity, sweetness, body, floral, clarity } = coffee.flavorProfile;

  // Radar polygon points calculation (5-axis radar chart)
  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;

  // 5 axes: Acidity (top), Sweetness (top-right), Body (bottom-right), Floral (bottom-left), Clarity (top-left)
  const axes = [
    { label: 'Acidity', value: acidity, angle: -90 },
    { label: 'Sweetness', value: sweetness, angle: -18 },
    { label: 'Body', value: body, angle: 54 },
    { label: 'Floral', value: floral, angle: 126 },
    { label: 'Clarity', value: clarity, angle: 198 },
  ];

  const getPoint = (angleDeg: number, val: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const dist = (val / 100) * radius;
    return {
      x: center + dist * Math.cos(rad),
      y: center + dist * Math.sin(rad),
    };
  };

  const polygonPoints = axes
    .map((axis) => {
      const p = getPoint(axis.angle, axis.value);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#141721] border border-white/12 rounded-[1.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-b from-[#1b202e] to-[#141721] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] shadow-[0_0_8px_#a78bfa]" />
            <span className="tag-label text-[#d8caff] tracking-wider">
              SENSORY SPECTRUM & SQA CALIBRATION
            </span>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-['Space_Grotesk'] uppercase text-[#dac2b1]/60 tracking-widest">
                {coffee.origin} • {coffee.altitude}
              </span>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-tight">
                {coffee.name}
              </h3>
              <p className="text-xs text-[#dac2b1]/80 mt-0.5">
                Varietal: <span className="text-white font-medium">{coffee.varietal}</span> ({coffee.process})
              </p>
            </div>
            {coffee.badge && (
              <span className="tag-label px-2.5 py-1 rounded-full bg-[#ff9f43]/15 text-[#ffc697] border border-[#ff9f43]/40 shrink-0">
                {coffee.badge}
              </span>
            )}
          </div>

          {/* SVG Radar Chart Display */}
          <div className="relative flex flex-col items-center justify-center py-2 bg-[#0E1118] rounded-2xl border border-white/5">
            <svg width={size} height={size} className="overflow-visible">
              {/* Concentric grid rings */}
              {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius * scale}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray={scale === 1 ? 'none' : '3 3'}
                />
              ))}

              {/* Axis rays */}
              {axes.map((axis, i) => {
                const edge = getPoint(axis.angle, 100);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={edge.x}
                    y2={edge.y}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(167, 139, 250, 0.28)"
                stroke="#A78BFA"
                strokeWidth="2.5"
                className="transition-all duration-500 ease-out"
              />

              {/* Data points */}
              {axes.map((axis, i) => {
                const p = getPoint(axis.angle, axis.value);
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#FF9F43"
                    stroke="#0B0D13"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Axis labels */}
              {axes.map((axis, i) => {
                const labelPos = getPoint(axis.angle, 122);
                return (
                  <text
                    key={i}
                    x={labelPos.x}
                    y={labelPos.y + 3}
                    textAnchor="middle"
                    fill="#DAC2B1"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="Space Grotesk"
                  >
                    {axis.label} ({axis.value}%)
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Extraction Specs Bar */}
          <div className="grid grid-cols-3 gap-2.5 text-center p-3 rounded-2xl bg-[#181b24] border border-white/5">
            <div>
              <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 block">
                Target TDS
              </span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#00f2fe]">
                {coffee.telemetry.tds}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 block">
                Brew Ratio
              </span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#ff9f43]">
                {coffee.telemetry.ratio}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 block">
                Contact Time
              </span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#a78bfa]">
                {coffee.telemetry.extractionTime}
              </span>
            </div>
          </div>

          {/* Tasting Notes */}
          <div>
            <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/60 tracking-wider block mb-2 font-bold">
              Identified Volatile Tasting Notes
            </span>
            <div className="flex flex-wrap gap-2">
              {coffee.tastingNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-[#181b24] border border-[#a78bfa]/25 text-xs text-white font-['Plus_Jakarta_Sans'] font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0B0D13] border-t border-white/10 flex items-center justify-between">
          <span className="font-['Space_Grotesk'] text-base font-bold text-white">
            ${coffee.price.toFixed(2)}
          </span>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
              if (onOpenConfigurator) {
                onOpenConfigurator(coffee);
              }
            }}
            className="px-6 py-2.5 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold tracking-wider uppercase flex items-center gap-1.5"
          >
            <span>Configure Extraction</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
