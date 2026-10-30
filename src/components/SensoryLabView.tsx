import React, { useState } from 'react';
import { Compass, Sparkles, Filter, Check, Eye } from 'lucide-react';
import { COFFEE_MENU, CoffeeItem } from '../data/coffeeData';
import { playTactileClick } from '../utils/audio';

interface SensoryLabViewProps {
  onSelectCoffee: (coffee: CoffeeItem) => void;
  onOpenRadar: (coffee: CoffeeItem, e: React.MouseEvent) => void;
}

export const SensoryLabView: React.FC<SensoryLabViewProps> = ({
  onSelectCoffee,
  onOpenRadar,
}) => {
  const [selectedAxis, setSelectedAxis] = useState<'all' | 'acidity' | 'sweetness' | 'floral' | 'body' | 'clarity'>('all');

  const filteredCoffees = COFFEE_MENU.filter((c) => {
    if (selectedAxis === 'all') return true;
    return c.flavorProfile[selectedAxis] >= 80;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="p-8 rounded-[1.5rem] bg-gradient-to-br from-[#181B24] via-[#141721] to-[#0E1118] border border-white/10 card-elevation relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#a78bfa]" />
            <span className="tag-label text-[#d8caff] tracking-widest">
              SQA CUPPING CALIBRATION LAB
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white tracking-tight">
            Sensory Spectrum Profiler
          </h1>
          <p className="text-sm text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] leading-relaxed">
            Every lot evaluated by our Q-Graders across 5 sensory parameters. Filter and target beans based on your preferred acidity brightness, syrupy body, or aromatic floral notes.
          </p>
        </div>
      </div>

      {/* Axis Selector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Terroirs' },
          { id: 'floral', label: 'Floral & Jasmine (>80%)' },
          { id: 'acidity', label: 'High Acidity & Citric (>80%)' },
          { id: 'sweetness', label: 'Caramel & Honey Sweetness (>80%)' },
          { id: 'body', label: 'Silky / Heavy Body (>80%)' },
          { id: 'clarity', label: 'Tea-Like Cup Clarity (>80%)' },
        ].map((pill) => {
          const isActive = selectedAxis === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => {
                playTactileClick();
                setSelectedAxis(pill.id as typeof selectedAxis);
              }}
              className={`px-4 py-2 rounded-full text-xs font-['Space_Grotesk'] font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                isActive
                  ? 'bg-[#a78bfa] text-[#0B0D13] shadow-md shadow-[#a78bfa]/20'
                  : 'bg-[#141721] text-[#dac2b1]/70 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Coffee Sensory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCoffees.map((coffee) => (
          <div
            key={coffee.id}
            className="p-5 rounded-2xl bg-[#141721] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <span className="tag-label text-[10px] text-[#00f2fe]">
                      {coffee.origin}
                    </span>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                      {coffee.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={(e) => onOpenRadar(coffee, e)}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#d8caff] border border-white/10 text-xs font-['Space_Grotesk'] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Radar</span>
                </button>
              </div>

              {/* Sensory parameter meters */}
              <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
                {[
                  { label: 'Floral Aromatics', val: coffee.flavorProfile.floral, color: '#A78BFA' },
                  { label: 'Bright Acidity', val: coffee.flavorProfile.acidity, color: '#F43F5E' },
                  { label: 'Sweetness', val: coffee.flavorProfile.sweetness, color: '#FBBF24' },
                  { label: 'Body & Mouthfeel', val: coffee.flavorProfile.body, color: '#FF9F43' },
                  { label: 'Cup Clarity', val: coffee.flavorProfile.clarity, color: '#00F2FE' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-['Space_Grotesk'] text-white/60 font-semibold w-32">
                      {stat.label}
                    </span>
                    <div className="flex-1 mx-3 h-1.5 bg-[#0E1118] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stat.val}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-white/80 w-8 text-right font-bold">
                      {stat.val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="font-['Space_Grotesk'] text-lg font-bold text-white">
                ${coffee.price.toFixed(2)}
              </span>
              <button
                onClick={() => onSelectCoffee(coffee)}
                className="px-5 py-2 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider"
              >
                Configure Extraction
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
