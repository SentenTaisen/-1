import React from 'react';
import { 
  Flame, 
  Activity, 
  Sparkles, 
  Compass, 
  Award, 
  MapPin, 
  ShoppingBag,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { playTactileClick } from '../utils/audio';

import { User } from '../types/auth';

export type NavView = 'menu' | 'telemetry' | 'subscriptions' | 'provenance' | 'sensory-lab';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeOrderActive: boolean;
  orderProgressStage: string;
  user?: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  cartCount,
  onOpenCart,
  activeOrderActive,
  orderProgressStage,
  user,
  onOpenAuth,
  onOpenProfile,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; tag?: string }[] = [
    { id: 'menu', label: 'Barista Extraction', icon: <Flame className="w-4 h-4" />, tag: 'LIVE' },
    { id: 'telemetry', label: 'Telemetry Tracker', icon: <Activity className="w-4 h-4" />, tag: activeOrderActive ? 'ACTIVE' : 'READY' },
    { id: 'subscriptions', label: 'Micro-Lot Rituals', icon: <Sparkles className="w-4 h-4" />, tag: 'EXCLUSIVE' },
    { id: 'sensory-lab', label: 'Sensory Spectrum', icon: <Compass className="w-4 h-4" /> },
    { id: 'provenance', label: 'Origin Roastery', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col h-[calc(100vh-2rem)] sticky top-4 rounded-3xl glass-floating p-5 select-none border border-white/10 card-elevation z-30">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff9f43] to-[#d87212] flex items-center justify-center shadow-lg shadow-[#ff9f43]/20 border border-white/20">
            <Cpu className="w-5 h-5 text-[#0B0D13]" />
          </div>
          <div>
            <div className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              OBSIDIAN <span className="text-[#ff9f43]">BREW</span>
            </div>
            <div className="text-[10px] uppercase font-['Space_Grotesk'] tracking-widest text-[#dac2b1]/60">
              Lab & Express Roasters
            </div>
          </div>
        </div>
      </div>

      {/* Live Lab Extraction Status Chip */}
      <div className="my-4 p-3 rounded-2xl bg-[#141721] border border-white/5 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1.5 text-xs text-[#dac2b1]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
            </span>
            Extraction Bay 03
          </span>
          <span className="font-['Space_Grotesk'] text-[10px] text-[#00f2fe] font-semibold bg-[#00f2fe]/10 px-2 py-0.5 rounded-full border border-[#00f2fe]/30">
            93.4°C / 9.2 BAR
          </span>
        </div>
        <div className="text-[11px] text-[#e2e2eb]/70 font-sans leading-tight">
          {activeOrderActive ? (
            <span className="text-[#ff9f43] font-medium flex items-center gap-1">
              <Activity className="w-3 h-3 animate-spin" /> In Progress: {orderProgressStage}
            </span>
          ) : (
            'Standby for next artisanal single-origin dispatch.'
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 mt-1">
        <div className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-white/40 px-3 py-1 font-semibold">
          Cockpit Hubs
        </div>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playTactileClick();
                onSelectView(item.id);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff9f43]/20 via-[#ff9f43]/10 to-transparent text-white border-l-4 border-l-[#ff9f43] border border-white/10'
                  : 'text-[#dac2b1]/80 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#ff9f43] text-[#0B0D13]' : 'bg-white/5 text-[#dac2b1] group-hover:text-white group-hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
                  {item.label}
                </span>
              </div>
              {item.tag && (
                <span
                  className={`text-[9px] font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#ff9f43] text-[#0B0D13]'
                      : item.id === 'telemetry' && activeOrderActive
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40 animate-pulse'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Specialty Micro-lot Card snippet */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#a78bfa]/20 via-[#181b24] to-[#141721] border border-[#a78bfa]/30 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-[#a78bfa]" />
          <span className="text-[11px] font-['Space_Grotesk'] font-bold tracking-wider text-[#d8caff] uppercase">
            Cup of Excellence
          </span>
        </div>
        <div className="text-xs font-semibold text-white">Huila Pink Bourbon 2026</div>
        <p className="text-[11px] text-[#dac2b1]/70 mt-0.5 line-clamp-2">
          Thermal shock anaerobic ferment with blood orange & honey aroma.
        </p>
        <button
          onClick={() => {
            playTactileClick();
            onSelectView('subscriptions');
          }}
          className="mt-2.5 text-[11px] font-bold text-[#ff9f43] hover:text-[#ffb77a] flex items-center gap-1 group"
        >
          Explore Allocation <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Member Profile or Sign In Card */}
      <div className="mb-3">
        {user ? (
          <button
            onClick={() => {
              playTactileClick();
              onOpenProfile();
            }}
            className="w-full p-2.5 rounded-2xl bg-[#141721] hover:bg-[#191c28] border border-white/10 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff9f43] to-[#d87212] flex items-center justify-center text-[#0B0D13] font-['Space_Grotesk'] font-bold text-xs shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#ffc697] font-mono block truncate">
                  {user.email}
                </span>
                <span className="text-[9px] text-[#00f2fe] font-mono block">
                  {user.membershipTier ? `VIP: ${user.membershipTier.split(' ')[0]}` : 'Member'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => {
              playTactileClick();
              onOpenAuth();
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider transition-all"
          >
            <span>Member Sign In / Join</span>
          </button>
        )}
      </div>

      {/* Cart Quick Trigger */}
      <button
        onClick={() => {
          playTactileClick();
          onOpenCart();
        }}
        className="w-full py-3 px-4 rounded-2xl bg-[#141721] hover:bg-[#1c202d] border border-white/10 flex items-center justify-between text-white transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#ff9f43]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#ff9f43] text-[#0B0D13] font-['Space_Grotesk'] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium font-['Plus_Jakarta_Sans']">Order Tray</span>
        </div>
        <span className="text-[11px] font-['Space_Grotesk'] font-bold text-[#ff9f43] group-hover:underline">
          View Cart
        </span>
      </button>
    </aside>
  );
};
