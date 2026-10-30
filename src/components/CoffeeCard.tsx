import React from 'react';
import { Plus, Star, Compass, Droplet, Thermometer, Wind } from 'lucide-react';
import { CoffeeItem } from '../data/coffeeData';
import { playTactileClick } from '../utils/audio';

interface CoffeeCardProps {
  coffee: CoffeeItem;
  onOpenConfigurator: (coffee: CoffeeItem) => void;
  onQuickAdd: (coffee: CoffeeItem, e: React.MouseEvent) => void;
  onOpenRadar: (coffee: CoffeeItem, e: React.MouseEvent) => void;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({
  coffee,
  onOpenConfigurator,
  onQuickAdd,
  onOpenRadar,
}) => {
  // Render roast intensity bars (micro segmented lines)
  const renderRoastBars = (intensity: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 w-3.5 rounded-full transition-colors ${
              level <= intensity
                ? 'bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => {
        playTactileClick();
        onOpenConfigurator(coffee);
      }}
      className={`group relative rounded-[1.5rem] p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden border ${
        coffee.isSpecialty
          ? 'bg-gradient-to-b from-[#181b24] to-[#12141c] border-[#a78bfa]/40 hover:border-[#a78bfa] shadow-[0_12px_32px_-8px_rgba(167,139,250,0.18)] hover:shadow-[0_16px_40px_-6px_rgba(167,139,250,0.3)]'
          : 'bg-[#141721] hover:bg-[#191c28] border-white/[0.07] hover:border-white/20 card-elevation hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Background ambient color glow for specialty lots */}
      {coffee.isSpecialty && (
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-[#ff9f43]/15 to-[#a78bfa]/20 blur-3xl pointer-events-none" />
      )}

      {/* Top Tag & Badge */}
      <div className="flex items-start justify-between gap-2 z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="tag-label px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#dac2b1] tracking-wider">
            {coffee.tag}
          </span>
          {coffee.badge && (
            <span className="tag-label px-2.5 py-1 rounded-full bg-[#ff9f43]/15 border border-[#ff9f43]/40 text-[#ffc697] font-semibold">
              {coffee.badge}
            </span>
          )}
        </div>

        {/* Sensory Radar quick modal button */}
        <button
          onClick={(e) => {
            playTactileClick();
            onOpenRadar(coffee, e);
          }}
          title="Inspect Sensory Spectrum Radar"
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[#dac2b1] hover:text-[#00f2fe] transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Photography Container */}
      <div className="relative my-4 aspect-[4/3] rounded-2xl overflow-hidden bg-[#0c0e14] border border-white/10 group-hover:border-white/20 transition-all">
        <img
          src={coffee.image}
          alt={coffee.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-95 group-hover:brightness-105"
          loading="lazy"
        />
        {/* Subtle Vignette & Gradient rim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14]/90 via-transparent to-transparent" />

        {/* Floating Telemetry Metric Overlays */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-['Space_Grotesk'] font-medium text-white/90">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <Thermometer className="w-3 h-3 text-[#ff9f43]" />
            <span>{coffee.defaultTemp.includes('Chilled') ? '2.0°C' : '93.5°C'}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <Droplet className="w-3 h-3 text-[#00f2fe]" />
            <span>TDS {coffee.telemetry.tds}</span>
          </div>
        </div>
      </div>

      {/* Coffee Information & Provenance */}
      <div className="z-10 space-y-2">
        <div>
          <div className="text-[11px] font-['Space_Grotesk'] uppercase tracking-widest text-[#dac2b1]/70 font-semibold">
            {coffee.origin} • {coffee.altitude}
          </div>
          <h3 className="font-['Space_Grotesk'] text-lg md:text-xl font-bold text-white tracking-tight mt-0.5 group-hover:text-[#ffc697] transition-colors">
            {coffee.name}
          </h3>
          <p className="text-xs text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] line-clamp-1">
            {coffee.subname}
          </p>
        </div>

        {/* Tasting Notes Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {coffee.tastingNotes.slice(0, 3).map((note, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-full bg-[#1e2230] border border-white/5 text-[#e2e2eb] font-['Plus_Jakarta_Sans']"
            >
              {note}
            </span>
          ))}
          {coffee.tastingNotes.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/50">
              +{coffee.tastingNotes.length - 3}
            </span>
          )}
        </div>

        {/* Roast Intensity Micro-Bars & Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-[#dac2b1]/70">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider font-semibold text-white/50">
              Roast
            </span>
            {renderRoastBars(coffee.roastIntensity)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-['Space_Grotesk'] text-[#FBBF24]">
            <Star className="w-3.5 h-3.5 fill-[#FBBF24]" />
            <span className="font-bold">{coffee.rating}</span>
            <span className="text-white/40">({coffee.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Price & Docked Instant "+" Pill Action */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10 z-10">
        <div>
          <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-white/50 block font-semibold">
            Extracted to Order
          </span>
          <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">
            ${coffee.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={(e) => {
            playTactileClick();
            onQuickAdd(coffee, e);
          }}
          title="Instant Quick Add with Standard Barista Spec"
          className="flex items-center gap-1 px-3.5 py-2 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold tracking-wider uppercase transition-transform active:scale-95 group/btn"
        >
          <Plus className="w-3.5 h-3.5 text-[#0B0D13] stroke-[3]" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
