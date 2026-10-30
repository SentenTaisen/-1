import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Thermometer, 
  Flame, 
  Droplet, 
  Check, 
  Plus, 
  Minus, 
  Zap,
  Info
} from 'lucide-react';
import { CoffeeItem, BrewCustomization } from '../data/coffeeData';
import { playTactileClick, playCremaChime } from '../utils/audio';

interface BrewConfiguratorModalProps {
  coffee: CoffeeItem | null;
  onClose: () => void;
  onAddToCart: (coffee: CoffeeItem, customization: BrewCustomization, calculatedPrice: number) => void;
}

export const BrewConfiguratorModal: React.FC<BrewConfiguratorModalProps> = ({
  coffee,
  onClose,
  onAddToCart,
}) => {
  if (!coffee) return null;

  const [grind, setGrind] = useState<BrewCustomization['grind']>(
    coffee.category === 'WHOLE_BEAN' ? 'Whole Bean' : 'Espresso Fine (9 Bar)'
  );
  const [milk, setMilk] = useState<BrewCustomization['milk']>('None (Black Terroir)');
  const [sweetener, setSweetener] = useState<BrewCustomization['sweetener']>('None / Pure');
  const [temperature, setTemperature] = useState<BrewCustomization['temperature']>(
    coffee.defaultTemp
  );
  const [extraShots, setExtraShots] = useState<number>(0);
  const [nitrogenBoost, setNitrogenBoost] = useState<boolean>(
    coffee.category === 'FLASH_CHILL'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Grind options for segmented pill toggle
  const grindOptions: BrewCustomization['grind'][] = [
    'Whole Bean',
    'Coarse (French/Chemex)',
    'Espresso Fine (9 Bar)',
    'Cold Extraction Ultra-Fine',
  ];

  // Milk tile options
  const milkOptions: { label: BrewCustomization['milk']; extra: number; desc: string }[] = [
    { label: 'None (Black Terroir)', extra: 0, desc: 'Pure single origin extraction' },
    { label: 'Oat M*lk Microfoam', extra: 0.85, desc: 'Steamed to 60°C micro-silk' },
    { label: 'Macadamia Silken Cream', extra: 1.10, desc: 'Decadent botanical nuttiness' },
    { label: 'Whole Jersey Farm Milk', extra: 0.50, desc: 'High butterfat sweetness' },
  ];

  // Sweetener tile options
  const sweetenerOptions: { label: BrewCustomization['sweetener']; extra: number; desc: string }[] = [
    { label: 'None / Pure', extra: 0, desc: 'Zero sweeteners, unmasked terroir' },
    { label: 'Vanilla Infused Panela', extra: 0.60, desc: 'Madagascar pods & raw cane' },
    { label: 'Lavender Honey Nectar', extra: 0.75, desc: 'Cold harvested organic blossom' },
  ];

  // Temperature choices
  const tempOptions: { label: BrewCustomization['temperature']; desc: string; icon: string }[] = [
    { label: 'Nitro Chilled (2°C)', desc: 'Cryo-flash cooled & dense', icon: '❄️' },
    { label: 'Ambient (8°C)', desc: 'Room temp tasting calibration', icon: '💧' },
    { label: 'Precision Extract (93.5°C)', desc: 'Calibrated SCA extraction temp', icon: '🔥' },
  ];

  // Dynamic price calculation
  const milkExtra = milkOptions.find((m) => m.label === milk)?.extra || 0;
  const sweetExtra = sweetenerOptions.find((s) => s.label === sweetener)?.extra || 0;
  const shotExtra = extraShots * 1.75;
  const nitroExtra = nitrogenBoost && coffee.category !== 'FLASH_CHILL' ? 0.95 : 0;
  const unitPrice = coffee.price + milkExtra + sweetExtra + shotExtra + nitroExtra;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    playCremaChime();
    onAddToCart(
      coffee,
      {
        grind,
        milk,
        sweetener,
        temperature,
        extraShots,
        nitrogenBoost,
        notes: customNotes,
        quantity,
      },
      totalPrice
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#141721] border border-white/10 rounded-[1.5rem] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with hero image preview */}
        <div className="relative p-6 bg-gradient-to-b from-[#1b202e] to-[#141721] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/15 shrink-0 bg-black">
              <img
                src={coffee.image}
                alt={coffee.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="tag-label px-2 py-0.5 rounded-full bg-[#ff9f43]/15 text-[#ffc697] border border-[#ff9f43]/30">
                  {coffee.tag}
                </span>
                <span className="text-[11px] font-['Space_Grotesk'] text-[#00f2fe] font-semibold">
                  {coffee.origin}
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {coffee.name}
              </h2>
              <p className="text-xs text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] line-clamp-1">
                {coffee.subname}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Configuration Controls */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-['Plus_Jakarta_Sans']">
          {/* Section 1: Grind & Particle Geometry Radios (Segmented pill toggle control) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ff9f43]" />
                1. Grind Calibration & Micron Size
              </label>
              <span className="text-[11px] font-['Space_Grotesk'] text-[#dac2b1]/70">
                EK43 Titanium Burrs
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-[#0E1118] rounded-2xl border border-white/10">
              {grindOptions.map((opt) => {
                const selected = grind === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setGrind(opt);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-center text-xs font-['Space_Grotesk'] font-semibold transition-all relative ${
                      selected
                        ? 'bg-[#FF9F43] text-[#0B0D13] shadow-md shadow-[#ff9f43]/30 font-bold'
                        : 'text-[#dac2b1]/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {opt.split(' (')[0]}
                    {opt.includes('(') && (
                      <span className="block text-[9px] opacity-80 font-normal">
                        ({opt.split('(')[1]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Temperature Extraction Profile */}
          <div>
            <label className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 mb-2.5">
              <Thermometer className="w-3.5 h-3.5 text-[#00f2fe]" />
              2. Thermal Profile & Service Temperature
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {tempOptions.map((t) => {
                const isSelected = temperature === t.label;
                return (
                  <div
                    key={t.label}
                    onClick={() => {
                      playTactileClick();
                      setTemperature(t.label);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#00f2fe]/10 border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                        : 'bg-[#181b24] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{t.icon}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#00f2fe] bg-[#00f2fe]' : 'border-white/20'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0B0D13]" />}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-['Space_Grotesk'] font-bold text-white">
                        {t.label}
                      </div>
                      <div className="text-[10px] text-[#dac2b1]/60 mt-0.5">{t.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Milk & Microfoam (Custom rounded-sm tiles with animated inner glowing dot) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-[#a78bfa]" />
                3. Microfoam & Dairy Emulsion
              </label>
              <span className="text-[10px] text-[#dac2b1]/60">Micro-steamed 62°C</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {milkOptions.map((opt) => {
                const selected = milk === opt.label;
                return (
                  <div
                    key={opt.label}
                    onClick={() => {
                      playTactileClick();
                      setMilk(opt.label);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-[#a78bfa]/15 border-[#a78bfa] shadow-[0_0_12px_rgba(167,139,250,0.2)]'
                        : 'bg-[#181b24] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Custom tile with animated inner glowing dot */}
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          selected
                            ? 'border-[#a78bfa] bg-[#a78bfa]/20'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {selected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] shadow-[0_0_8px_#a78bfa]" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{opt.label}</div>
                        <div className="text-[10px] text-[#dac2b1]/60">{opt.desc}</div>
                      </div>
                    </div>
                    {opt.extra > 0 && (
                      <span className="text-xs font-['Space_Grotesk'] font-bold text-[#ff9f43]">
                        +${opt.extra.toFixed(2)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Sweetener Infusions */}
          <div>
            <label className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              4. Artisanal Sweetener Infusion
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {sweetenerOptions.map((opt) => {
                const selected = sweetener === opt.label;
                return (
                  <div
                    key={opt.label}
                    onClick={() => {
                      playTactileClick();
                      setSweetener(opt.label);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selected
                        ? 'bg-[#FBBF24]/10 border-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                        : 'bg-[#181b24] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          selected ? 'border-[#FBBF24] bg-[#FBBF24]/30' : 'border-white/20'
                        }`}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-[#FBBF24]" />}
                      </div>
                      {opt.extra > 0 && (
                        <span className="text-[11px] font-['Space_Grotesk'] font-bold text-[#ff9f43]">
                          +${opt.extra.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-white">{opt.label}</div>
                      <div className="text-[10px] text-[#dac2b1]/60 mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Precision Extraction Enhancements */}
          <div className="p-4 rounded-2xl bg-[#0E1118] border border-white/10 space-y-3">
            <div className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00f2fe]" />
              Extra Extraction & Nitrogen Injection
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-semibold text-white">Additional Ristretto Shot</div>
                <div className="text-[10px] text-[#dac2b1]/60">
                  +18g single-origin extraction (+1.75 each)
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#181b24] rounded-full p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setExtraShots(Math.max(0, extraShots - 1));
                  }}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-['Space_Grotesk'] font-bold text-xs text-white px-1">
                  +{extraShots}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setExtraShots(extraShots + 1);
                  }}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <div className="text-xs font-semibold text-white">Micro-Nitrogen Cascade Charge</div>
                <div className="text-[10px] text-[#dac2b1]/60">
                  Infuses ultra-fine cryogenic N2 bubbles for velvety head
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setNitrogenBoost(!nitrogenBoost);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-['Space_Grotesk'] font-bold uppercase transition-all ${
                  nitrogenBoost
                    ? 'nitro-btn shadow-md'
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}
              >
                {nitrogenBoost ? '⚡ Active (+0.95)' : 'Inactive'}
              </button>
            </div>
          </div>

          {/* Barista Instructions Input */}
          <div>
            <label className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white/80 block mb-1.5">
              Specific Extraction Notes for Barista
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot 68°C, double rinse paper filter, split shot into two cups..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-[#0E1118] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f2fe]"
            />
          </div>
        </div>

        {/* Bottom Sticky Action Tray */}
        <div className="p-5 bg-[#0B0D13] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-['Space_Grotesk'] text-[#dac2b1]/70 font-semibold uppercase">
              Qty
            </span>
            <div className="flex items-center gap-2 bg-[#181b24] p-1 rounded-full border border-white/10">
              <button
                onClick={() => {
                  playTactileClick();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-['Space_Grotesk'] text-base font-bold text-white px-2 min-w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => {
                  playTactileClick();
                  setQuantity(quantity + 1);
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Action Button (Crema Button with inner reflection and active scale) */}
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-full crema-btn font-['Space_Grotesk'] text-sm tracking-wide uppercase transition-all"
          >
            <span>Add to Order Tray</span>
            <span className="font-extrabold text-base border-l border-[#0B0D13]/30 pl-3">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
