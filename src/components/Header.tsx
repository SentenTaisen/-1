import React from 'react';
import { 
  Search, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  Sparkles, 
  Menu, 
  X, 
  Compass, 
  User as UserIcon 
} from 'lucide-react';
import { playTactileClick } from '../utils/audio';
import { NavView } from './Sidebar';
import { User } from '../types/auth';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCommandPalette: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currentView: NavView;
  onSelectView: (v: NavView) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  user?: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  soundOn,
  onToggleSound,
  cartCount,
  onOpenCart,
  currentView,
  onSelectView,
  mobileMenuOpen,
  onToggleMobileMenu,
  user,
  onOpenAuth,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0D13]/85 border-b border-white/[0.07] px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Mobile Logo & Menu button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => {
              playTactileClick();
              onToggleMobileMenu();
            }}
            className="p-2 rounded-xl bg-[#141721] border border-white/10 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="font-['Space_Grotesk'] text-base font-bold tracking-tight text-white flex items-center gap-1">
            OBSIDIAN <span className="text-[#ff9f43]">BREW</span>
          </div>
        </div>

        {/* Recessed Inset Container Search Bar (as specified: #0E1118 with generous padding, search icon, ⌘K tag) */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <div
            onClick={onOpenCommandPalette}
            className="group cursor-pointer relative flex items-center bg-[#0E1118] border border-white/10 hover:border-[#00f2fe]/50 focus-within:border-[#00f2fe] focus-within:ring-2 focus-within:ring-[#00f2fe]/20 rounded-full px-4 py-2 transition-all duration-200"
          >
            <Search className="w-4 h-4 text-[#dac2b1]/60 group-hover:text-[#00f2fe] transition-colors shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Search origin, anaerobic profile, tasting notes (e.g. Jasmine, Peach)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent border-none outline-none text-sm text-[#e2e2eb] placeholder:text-white/35 w-full font-['Plus_Jakarta_Sans']"
            />
            {/* Keyboard shortcut tag */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-['Space_Grotesk'] text-[#dac2b1]/70 font-semibold shadow-inner">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Sound Toggle for Tactile Haptics */}
          <button
            onClick={() => {
              playTactileClick();
              onToggleSound();
            }}
            title={soundOn ? 'Tactile Audio Feedback ON' : 'Audio Muted'}
            className="p-2.5 rounded-full bg-[#141721] hover:bg-[#1f2331] border border-white/10 text-[#dac2b1] hover:text-white transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#00f2fe]" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          {/* Sensory Lab shortcut */}
          <button
            onClick={() => {
              playTactileClick();
              onSelectView('sensory-lab');
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-['Plus_Jakarta_Sans'] text-[#dac2b1] hover:text-white transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Sensory Radar</span>
          </button>

          {/* Micro-Lot Rituals pill */}
          <button
            onClick={() => {
              playTactileClick();
              onSelectView('subscriptions');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 border border-[#a78bfa]/30 text-xs font-['Space_Grotesk'] font-bold text-[#d8caff] uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Reserves</span>
          </button>

          {/* User Auth / Profile Pill Button with clearly visible email */}
          {user ? (
            <button
              onClick={() => {
                playTactileClick();
                onOpenProfile();
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#181B24] hover:bg-[#202533] border border-[#ff9f43]/30 transition-all text-xs font-['Space_Grotesk'] text-white group shadow-sm"
              title={`Logged in as ${user.email} (${user.name})`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff9f43] to-[#d87212] flex items-center justify-center text-[#0B0D13] font-bold text-[11px] shadow-sm shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left leading-none max-w-[130px] sm:max-w-[160px] truncate">
                <span className="font-bold text-white text-[11px] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#ffc697] truncate font-mono">
                  {user.email}
                </span>
              </div>
              <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/30 font-bold uppercase">
                {user.membershipTier ? 'VIP' : 'MEMBER'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                playTactileClick();
                onOpenAuth();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#ff9f43]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Crema Pill Action */}
          <button
            onClick={() => {
              playTactileClick();
              onOpenCart();
            }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full crema-btn text-xs font-['Space_Grotesk'] tracking-wide uppercase transition-transform"
          >
            <ShoppingBag className="w-4 h-4 text-[#0B0D13]" />
            <span className="font-bold">Tray</span>
            {cartCount > 0 && (
              <span className="bg-[#0B0D13] text-[#ff9f43] text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown if open */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 pb-2">
          {/* Mobile search */}
          <div className="flex items-center bg-[#0E1118] border border-white/10 rounded-full px-3 py-2">
            <Search className="w-4 h-4 text-[#dac2b1]/60 mr-2" />
            <input
              type="text"
              placeholder="Search coffees & notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[#e2e2eb] w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => {
                onSelectView('menu');
                onToggleMobileMenu();
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                currentView === 'menu' ? 'bg-[#ff9f43] text-[#0B0D13]' : 'bg-[#141721] text-white'
              }`}
            >
              ☕ Barista Menu
            </button>
            <button
              onClick={() => {
                onSelectView('telemetry');
                onToggleMobileMenu();
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                currentView === 'telemetry' ? 'bg-[#00f2fe] text-[#0B0D13]' : 'bg-[#141721] text-white'
              }`}
            >
              ⚡ Telemetry Tracker
            </button>
            <button
              onClick={() => {
                onSelectView('subscriptions');
                onToggleMobileMenu();
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                currentView === 'subscriptions' ? 'bg-[#a78bfa] text-[#0B0D13]' : 'bg-[#141721] text-white'
              }`}
            >
              ✨ Micro-Lot Club
            </button>
            <button
              onClick={() => {
                onSelectView('sensory-lab');
                onToggleMobileMenu();
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                currentView === 'sensory-lab' ? 'bg-[#ff9f43] text-[#0B0D13]' : 'bg-[#141721] text-white'
              }`}
            >
              🧭 Sensory Spectrum
            </button>
          </div>

          {/* Mobile Profile / Sign in row */}
          <div className="pt-2">
            {user ? (
              <button
                onClick={() => {
                  onToggleMobileMenu();
                  onOpenProfile();
                }}
                className="w-full p-2.5 rounded-xl bg-[#181B24] border border-[#ff9f43]/30 flex items-center justify-between text-xs text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#ff9f43] text-[#0B0D13] font-bold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">{user.name}</span>
                    <span className="text-[10px] text-[#ffc697] font-mono block">{user.email}</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#00f2fe] font-mono">Profile & Plan →</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onToggleMobileMenu();
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase text-center"
              >
                Sign In / Join Obsidian Club
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
