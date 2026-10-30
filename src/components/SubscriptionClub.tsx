import React, { useState } from 'react';
import { Sparkles, Award, Shield, Calendar, ArrowRight, Check, Droplets, MapPin } from 'lucide-react';
import { playTactileClick, playCremaChime } from '../utils/audio';

import { SystemeSubscriptionForm } from './SystemeSubscriptionForm';

interface SubscriptionClubProps {
  onSubscribeNotice?: (planName: string) => void;
  targetTier?: string;
  onOpenAuth?: () => void;
}

export const SubscriptionClub: React.FC<SubscriptionClubProps> = ({ 
  onSubscribeNotice,
  targetTier = 'Cup of Excellence Vault',
  onOpenAuth,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'nocturnal' | 'competition' | 'roaster'>('competition');
  const [frequency, setFrequency] = useState<'biweekly' | 'monthly'>('biweekly');
  const [activeFormTier, setActiveFormTier] = useState<string>(targetTier);

  const tiers = [
    {
      id: 'nocturnal',
      name: 'Nocturnal Cold Extract',
      badge: 'NITRO SPECIALIST',
      price: 38,
      frequencyText: frequency === 'biweekly' ? 'every 2 weeks' : 'per month',
      gradient: 'from-[#00f2fe]/20 via-[#181b24] to-[#141721]',
      border: 'border-[#00f2fe]/40',
      accentColor: '#00f2fe',
      features: [
        '2x 1-Liter Nitrogen-Sealed Flash Chill Flasks',
        'Direct Kyoto-style single-origin releases',
        'Chilled thermal insulated pack included',
        'Private sensory lab extraction logs',
      ],
      description: 'Engineered for night owls, coders, and connoisseurs of cryogenic cold extraction.',
    },
    {
      id: 'competition',
      name: 'Cup of Excellence Vault',
      badge: 'MOST COVETED',
      price: 54,
      frequencyText: frequency === 'biweekly' ? 'every 2 weeks' : 'per month',
      gradient: 'from-[#a78bfa]/25 via-[#ff9f43]/15 to-[#141721]',
      border: 'border-[#a78bfa]/60 shadow-[0_12px_32px_-8px_rgba(167,139,250,0.3)]',
      accentColor: '#a78bfa',
      popular: true,
      features: [
        '2x 250g Ultra-Micro Lots (>92 SQA Points)',
        'Numbered collector matte obsidian nitrogen tins',
        'Priority dispatch slot (guaranteed 25m delivery)',
        'Exclusive Geisha & Thermal Shock varietals',
        'Monthly virtual cupping calibration stream',
      ],
      description: 'Rare competition lots directly sourced from producers in Huila, Boquete, and Gedeb.',
    },
    {
      id: 'roaster',
      name: 'Curator Roaster Selection',
      badge: 'TERROIR PURIST',
      price: 44,
      frequencyText: frequency === 'biweekly' ? 'every 2 weeks' : 'per month',
      gradient: 'from-[#ff9f43]/20 via-[#181b24] to-[#141721]',
      border: 'border-[#ff9f43]/40',
      accentColor: '#ff9f43',
      features: [
        '2x 250g Seasonal Single Origins',
        'Light to medium roast profile calibrations',
        'Detailed moisture & water mineral brewing recipe',
        'Free doorstep courier shipping',
      ],
      description: 'A curated global rotation highlighting contrasting fermentation philosophies.',
    },
  ];

  const handleSelectTierForForm = (planName: string) => {
    playCremaChime();
    setActiveFormTier(planName);
    const formEl = document.getElementById('systeme-subscription-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
    if (onSubscribeNotice) onSubscribeNotice(planName);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative p-8 md:p-10 rounded-[1.5rem] bg-gradient-to-br from-[#181B24] via-[#141721] to-[#0E1118] border border-[#a78bfa]/30 overflow-hidden card-elevation">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#a78bfa]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-[#ff9f43]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="tag-label text-[#d8caff] tracking-widest">
              OBSIDIAN RESERVE ALLOCATION
            </span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Micro-Lot Rituals & Guaranteed Allocations
          </h1>

          <p className="text-sm md:text-base text-[#dac2b1]/80 font-['Plus_Jakarta_Sans'] leading-relaxed">
            Competition lots are limited by nature. As an Obsidian Club Member, your tins are nitrogen-purged and dispatched within 48 hours of roasting on our Loring convection machines. Integrated with <strong className="text-white">Systeme.io</strong> for automated lead tagging and dispatch delivery alerts.
          </p>

          {/* Cadence Toggle */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs font-['Space_Grotesk'] font-bold text-white/60 uppercase">
              Dispatch Cadence:
            </span>
            <div className="inline-flex p-1 rounded-full bg-[#0E1118] border border-white/10">
              <button
                onClick={() => {
                  playTactileClick();
                  setFrequency('biweekly');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-['Space_Grotesk'] font-bold transition-all ${
                  frequency === 'biweekly'
                    ? 'bg-[#a78bfa] text-[#0B0D13] shadow-md shadow-[#a78bfa]/30'
                    : 'text-[#dac2b1]/60 hover:text-white'
                }`}
              >
                Every 2 Weeks (Fresh Peak)
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  setFrequency('monthly');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-['Space_Grotesk'] font-bold transition-all ${
                  frequency === 'monthly'
                    ? 'bg-[#a78bfa] text-[#0B0D13] shadow-md shadow-[#a78bfa]/30'
                    : 'text-[#dac2b1]/60 hover:text-white'
                }`}
              >
                Monthly Allocation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isSelected = selectedPlan === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => {
                playTactileClick();
                setSelectedPlan(tier.id as typeof selectedPlan);
                setActiveFormTier(tier.name);
              }}
              className={`relative rounded-[1.5rem] p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                tier.gradient
              } ${tier.border} ${
                isSelected
                  ? 'ring-2 ring-white/30 scale-[1.02]'
                  : 'hover:scale-[1.01] hover:border-white/30'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff9f43] to-[#a78bfa] text-[#0B0D13] font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  Curator Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="tag-label px-2.5 py-1 rounded-full text-[10px]"
                    style={{
                      backgroundColor: `${tier.accentColor}18`,
                      color: tier.accentColor,
                      border: `1px solid ${tier.accentColor}40`,
                    }}
                  >
                    {tier.badge}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-white bg-white text-[#0B0D13]'
                        : 'border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">
                  {tier.name}
                </h3>
                <p className="text-xs text-[#dac2b1]/70 mt-1 font-['Plus_Jakarta_Sans']">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="my-5 flex items-baseline gap-1.5">
                  <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
                    ${tier.price}
                  </span>
                  <span className="text-xs font-['Space_Grotesk'] text-[#dac2b1]/60">
                    / {tier.frequencyText}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs font-['Plus_Jakarta_Sans'] text-[#dac2b1]">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: tier.accentColor }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTierForForm(tier.name);
                }}
                className={`mt-6 w-full py-3 rounded-full text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  tier.popular ? 'crema-btn' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <span>Reserve via Systeme.io</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Embedded Systeme.io Subscription & Opt-In Form Section */}
      <div id="systeme-subscription-section" className="pt-4">
        <SystemeSubscriptionForm
          initialTier={activeFormTier}
          onSuccessNotice={onSubscribeNotice}
          onOpenAuth={onOpenAuth}
        />
      </div>
    </div>
  );
};
