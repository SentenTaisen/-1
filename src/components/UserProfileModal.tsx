import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Coffee, 
  LogOut, 
  Check, 
  ShieldCheck, 
  PauseCircle, 
  RotateCcw,
  Zap,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playTactileClick, playCremaChime } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSystemeForm?: () => void;
  onNotice?: (msg: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenSystemeForm,
  onNotice,
}) => {
  if (!isOpen) return null;

  const { currentUser, logout, updateUser, cancelSubscription, systemeConfig } = useAuth();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(currentUser?.deliveryAddress || '');
  const [grindInput, setGrindInput] = useState(currentUser?.grindPreference || 'Espresso Fine (9 Bar)');

  if (!currentUser) return null;

  const handleSavePreferences = () => {
    updateUser({
      deliveryAddress: addressInput,
      grindPreference: grindInput,
    });
    playCremaChime();
    setIsEditingAddress(false);
    if (onNotice) onNotice('Profile preferences updated & saved.');
  };

  const handleCancelSub = () => {
    playTactileClick();
    cancelSubscription();
    if (onNotice) onNotice('Subscription paused. You can reactivate anytime.');
  };

  const handleLogout = () => {
    playTactileClick();
    logout();
    onClose();
    if (onNotice) onNotice('Signed out of Obsidian Brew cockpit.');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#141721] border border-white/12 rounded-[1.5rem] shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-[#1B202E] to-[#141721] border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff9f43] via-[#d87212] to-[#141721] border border-white/20 flex items-center justify-center text-white text-xl font-['Space_Grotesk'] font-bold shadow-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">
                  {currentUser.name}
                </h2>
                <span className="tag-label text-[9px] px-2 py-0.5 rounded-full bg-[#ff9f43]/20 text-[#ffc697] border border-[#ff9f43]/40">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-[#dac2b1]/70 block font-['Plus_Jakarta_Sans']">
                {currentUser.email}
              </span>
              <span className="text-[10px] text-white/40 font-mono mt-0.5 block">
                Member ID: {currentUser.id}
              </span>
            </div>
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

        {/* Member Details & Active Subscription */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Active Subscription Card */}
          <div className="p-5 rounded-2xl bg-[#181B24] border border-white/10 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="tag-label text-[10px] text-[#00f2fe] flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
                </span>
                ACTIVE SUBSCRIPTION ALLOCATION
              </span>

              {currentUser.membershipStatus === 'active' ? (
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] font-['Space_Grotesk'] font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px] font-['Space_Grotesk'] font-bold">
                  NO ACTIVE TIER
                </span>
              )}
            </div>

            {currentUser.membershipTier ? (
              <div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                  {currentUser.membershipTier}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#dac2b1]/80 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#ff9f43]" />
                    Cadence: {currentUser.frequency === 'biweekly' ? 'Every 2 Weeks' : 'Monthly'}
                  </span>
                  {currentUser.nextDeliveryDate && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#00f2fe]" />
                      Next Dispatch: {currentUser.nextDeliveryDate}
                    </span>
                  )}
                </div>

                {/* Systeme.io Sync Pill */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#0E1118] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#dac2b1]/70 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    Systeme.io Audience Sync:
                  </span>
                  <span className="text-[#00f2fe] font-mono text-[11px] font-bold">
                    TAG: {systemeConfig.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-3">
                  <button
                    onClick={handleCancelSub}
                    className="text-xs text-[#f43f5e] hover:underline font-['Space_Grotesk'] font-semibold flex items-center gap-1"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Pause Subscription</span>
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenSystemeForm) onOpenSystemeForm();
                    }}
                    className="text-xs text-[#ff9f43] hover:underline font-['Space_Grotesk'] font-semibold"
                  >
                    Change Tier / Cadence
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 space-y-2">
                <p className="text-xs text-[#dac2b1]/70">
                  You do not have an active micro-lot allocation yet.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenSystemeForm) onOpenSystemeForm();
                  }}
                  className="px-4 py-2 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase"
                >
                  Join Micro-Lot Club
                </button>
              </div>
            )}
          </div>

          {/* Delivery & Grind Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#ff9f43]" />
                Extraction & Delivery Settings
              </h3>
              {!isEditingAddress && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="text-xs text-[#00f2fe] hover:underline flex items-center gap-1 font-['Space_Grotesk']"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <div className="p-4 rounded-xl bg-[#0E1118] border border-white/10 space-y-3">
                <div>
                  <label className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 block mb-1">
                    Grind Particle Calibration
                  </label>
                  <select
                    value={grindInput}
                    onChange={(e) => setGrindInput(e.target.value)}
                    className="w-full bg-[#141721] border border-white/10 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Espresso Fine (9 Bar)">Espresso Fine (9 Bar EK43)</option>
                    <option value="Whole Bean">Whole Bean (Sealed Tin)</option>
                    <option value="Coarse (French/Chemex)">Coarse (Filter / Pour Over)</option>
                    <option value="Cold Extraction Ultra-Fine">Cold Extraction Ultra-Fine</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-['Space_Grotesk'] uppercase text-white/50 block mb-1">
                    Courier Drop Address
                  </label>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full bg-[#141721] border border-white/10 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingAddress(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-1.5 rounded-lg crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0E1118] border border-white/5">
                  <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/40 block mb-1">
                    Grind Calibration
                  </span>
                  <span className="font-semibold text-white block">
                    {currentUser.grindPreference}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0E1118] border border-white/5">
                  <span className="text-[10px] font-['Space_Grotesk'] uppercase text-white/40 block mb-1">
                    Destination Coordinates
                  </span>
                  <span className="font-semibold text-white block line-clamp-1">
                    {currentUser.deliveryAddress}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 bg-[#0B0D13] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="text-xs text-[#dac2b1]/60 hover:text-[#f43f5e] font-['Space_Grotesk'] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-['Space_Grotesk'] font-bold uppercase transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
