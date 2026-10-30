import React from 'react';
import { MapPin, Droplets, Flame, Cpu, Award, Compass, ShieldCheck } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

export const ProvenanceView: React.FC = () => {
  const roasterySpecs = [
    {
      title: 'Water Matrix Calibration',
      subtitle: 'Custom Remineralized Reverse Osmosis',
      value: '135 ppm',
      metric: 'GH: 85 ppm | KH: 45 ppm | pH: 6.92',
      desc: 'Formulated with food-grade magnesium and calcium ions to maximize extraction of floral monoterpenes and volatile aldehydes.',
      icon: <Droplets className="w-5 h-5 text-[#00f2fe]" />,
    },
    {
      title: 'Thermal Profiling',
      subtitle: 'Single-Pass Loring S15 Kestrel',
      value: '204°C Drop',
      metric: '12.4% Dev Time Ratio',
      desc: 'Convection roasting suspends beans on a cyclone of superheated air, yielding edge-to-edge even development without roast smokiness.',
      icon: <Flame className="w-5 h-5 text-[#ff9f43]" />,
    },
    {
      title: 'Cryogenic Flash Preservation',
      subtitle: 'Liquid Nitrogen Inert Purge',
      value: '< 0.5% O2',
      metric: 'Residual Oxygen in Tin',
      desc: 'All whole beans and nitro concentrates are packaged in sealed obsidian tins flushed with inert gas, pausing staling for 90 days.',
      icon: <Cpu className="w-5 h-5 text-[#a78bfa]" />,
    },
    {
      title: 'Hydraulic Pressure Profiling',
      subtitle: 'Direct Rotary Saturated Grouphead',
      value: '9.2 Bar',
      metric: '6s Gentle Pre-Infusion (2.5 Bar)',
      desc: 'Prevents puck channeling and unlocks viscous crema with rounded sweetness and low perceived astringency.',
      icon: <Award className="w-5 h-5 text-[#10B981]" />,
    },
  ];

  const origins = [
    {
      country: 'Ethiopia',
      region: 'Gedeb Chelchele, Yirgacheffe',
      altitude: '2,200m MASL',
      producer: 'Smallholder Garden Plots',
      harvest: 'Nov – Jan (Late Harvest)',
      notes: 'White Peach, Bergamot, Honeysuckle',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    },
    {
      country: 'Colombia',
      region: 'San Adolfo, Huila',
      altitude: '1,820m MASL',
      producer: 'Rodrigo Sanchez (Finca Monteblanco)',
      harvest: 'Thermal Shock Anaerobic',
      notes: 'Pink Grapefruit, Papaya, Cardamom',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    },
    {
      country: 'Panama',
      region: 'Boquete, Volcán Barú',
      altitude: '1,850m MASL',
      producer: 'Hacienda La Esmeralda',
      harvest: 'Green Tip Geisha Microlot',
      notes: 'Mandarin Blossom, Apricot, Jasmine',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Intro */}
      <div className="p-8 rounded-[1.5rem] bg-[#141721] border border-white/10 card-elevation relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="tag-label text-[#ff9f43] tracking-widest">
              DIRECT TRADE & SCIENTIFIC RIGOR
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white tracking-tight">
            The Obsidian Philosophy
          </h1>
          <p className="text-sm text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] leading-relaxed">
            We treat specialty coffee as both high-velocity engineering and an intimate nocturnal sensory experience. Every variable—from mineral water chemistry to micron particle dispersion—is locked to scientific tolerances.
          </p>
        </div>
      </div>

      {/* Laboratory Engineering Specs */}
      <div>
        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00f2fe]" />
          Extraction Standards & Calibration Benchmarks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roasterySpecs.map((spec, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#141721] border border-white/10 hover:border-white/20 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  {spec.icon}
                </div>
                <div className="text-right">
                  <span className="font-['Space_Grotesk'] text-xl font-bold text-white">
                    {spec.value}
                  </span>
                  <span className="text-[10px] text-[#dac2b1]/60 block font-mono">
                    {spec.metric}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  {spec.title}
                </h3>
                <span className="text-[11px] text-[#ffc697] font-['Space_Grotesk'] block">
                  {spec.subtitle}
                </span>
                <p className="text-xs text-[#dac2b1]/70 mt-1 font-['Plus_Jakarta_Sans'] leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Trade Origin Cards */}
      <div>
        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#ff9f43]" />
          Producer Provenance & Micro-Lot Origins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {origins.map((orig, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#141721] border border-white/10 overflow-hidden flex flex-col justify-between"
            >
              <div className="h-44 relative bg-black">
                <img
                  src={orig.image}
                  alt={orig.country}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141721] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 tag-label px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {orig.country}
                </span>
                <span className="absolute bottom-2 left-3 font-['Space_Grotesk'] text-xs font-bold text-[#00f2fe]">
                  {orig.altitude}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  {orig.region}
                </h3>
                <div className="text-xs text-[#dac2b1]/70 font-['Plus_Jakarta_Sans']">
                  Producer: <span className="text-white font-medium">{orig.producer}</span>
                </div>
                <div className="text-xs text-[#dac2b1]/70 font-['Plus_Jakarta_Sans']">
                  Process: <span className="text-[#ff9f43] font-medium">{orig.harvest}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 block mb-1">
                    Volatiles
                  </span>
                  <div className="text-xs font-medium text-white/90">
                    {orig.notes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
